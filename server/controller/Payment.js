const { instance } = require("../config/razorpay")
const crypto = require("crypto")
const User = require("../models/User")
const Order=require("../models/Order")
const mailSender = require("../utils/mailSender")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const items = req.body.cart
  if (items.length === 0) {
    return res.json({ success: false, message: "Please Provide Item to Buy" })
  }
 
  let total_amount = 0  

    for (const item of items) {
      total_amount += item.price 
    } 
  

  const options = {
    amount: total_amount * 100,    
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log('paymentResponse in capturePayment-->',paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log('Payment.js 37',error)
    res.status(500).json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id 
  //* check req.body is undefined or not if not return razorpay_order_id from req.body otherwise undefined
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const items = req.body?.cart
  const userId = req.user?.id
  const email=req.user?.email
  const cart=req.body?.cart

  console.log('userId and email in verifyPayment',userId,email)

  console.log(req.body?.razorpay_payment_id, req.body?.razorpay_signature,req.body?.cart,req.user?.id,req.user?.email)
  if (!razorpay_order_id ||!razorpay_payment_id ||!razorpay_signature ||!items ||!userId) {
    console.log('data not send in verifyPayment')
    return res.status(400).json({ 
      success: false, 
      message: "Payment Failed"
    })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex")

  if (expectedSignature === razorpay_signature) {

    console.log('Payment verified in verifyPayment');
      
    const orderResult = await addOrders(cart, userId,email);

    if (orderResult.success) {
      return res.status(200).json({ success: true, message: "Payment Verified" });
    } 
    else {
      return res.status(500).json({ success: false, message: "Order creation failed" });
    }
  } 
  else {
      console.log('Signature verification failed in verifyPayment');
      return res.status(400).json({ success: false, message: "Payment Failed" });
    }  

  }


exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body
 
  const userId = req.user.id 
  console.log('userId in sendPaymentSuccessEmail',userId)

  if (!orderId || !paymentId || !amount || !userId) {
    console.log( "Please provide all the details")
    return res.status(400).json({ success: false, message: "Please provide all the details" })
  }

  try {
    const Order_User = await User.findById(userId)
    console.log('going to send email',Order_User?.email,Order_User?.name,userId)
    await mailSender(
      Order_User.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${Order_User.name}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res.status(400).json({ success: false, message: "Could not send email" })
  }
}


const addOrders = async (cart, userId, email) => {
  if (!cart || !userId) {
    return { success: false, status: 400, message: "Please Provide User ID" };
  }

  try {
    let eId = await Order.findOne({ email });

    if (!eId) {
      
      const orders = await Order.create({ email: email, order_data: [cart] });
      return { success: true, status: 200, data: orders, message: 'New User Order' };
    } else {
     
      const orders = await Order.findOneAndUpdate({ email: email },{ $push: { order_data: cart } },{ new: true } );
      return { success: true, status: 200, data: orders, message: 'Existing User Order' };
    }
  } catch (error) {
    console.error("Error in addOrders:", error);
    return { success: false, status: 500, message: "Order not stored in order_data Array" };
  }
};
