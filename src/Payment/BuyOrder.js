import { toast } from "react-hot-toast";
import axios from "axios";
import { empty } from "../redux/Slices/CartSlice";

function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
   
  
  export async function BuyItem(token,cart,navigate,dispatch) {
   
    const toastId = toast.loading("Loading...")
   
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
  
      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Check your Internet Connection."
        )
        return
      }
  
     
      const orderResponse = await axios.post('https://ecomzy-qy66.onrender.com/api/v1/capturePayment',{cart},{headers: { Authorization: `Bearer ${token}`}} )
  
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message)
      }
      //console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)
  
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        currency: orderResponse.data.data.currency,
        amount: `${orderResponse.data.data.amount}`,
        order_id: orderResponse.data.data.id,
        name: "Ecomzy",
        description: "Thank you for Shopping.",
        //image:Ecomzy ,
        // prefill: {
        //   name: signupData.name,
        //   email:signupData.email,
        // },
        handler: function (response) {
          sendPaymentSuccessEmail(response, orderResponse.data.data.amount,token)  
          verifyPayment({ ...response, cart },  navigate, dispatch,token)   
        },
      }
      const paymentObject = new window.Razorpay(options)
  
      paymentObject.open()
      paymentObject.on("payment.failed", function (response) {
        toast.error("Oops! Payment Failed.")
        console.log(response.error)
      })
    } catch (error) {
      console.log("PAYMENT API ERROR............", error)
      toast.error("Could Not make Payment.")
    }
    toast.dismiss(toastId)
  }
  
  async function verifyPayment(bodyData, navigate, dispatch,token) {

    const toastId = toast.loading("Verifying Payment...")
    try {
      const response = await axios.post("https://ecomzy-qy66.onrender.com/api/v1/verifyPayment", bodyData,{ headers: { Authorization: `Bearer ${token}`}} )
  
     console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)
  
      if (!response.data.success) {
        console.log('Error in !response.data.success')
        throw new Error(response.data.message)
      }
  
      toast.success("Payment Successful ")
      dispatch(empty())
      navigate("/dashboard")

    } catch (error) {
      console.log("PAYMENT VERIFY ERROR............",error.response.data.message)
      toast.error("Could Not Verify Payment.")
    }
    toast.dismiss(toastId)
  }
  
  async function sendPaymentSuccessEmail(response, amount, token) {
    try {
      await axios.post("https://ecomzy-qy66.onrender.com/api/v1/sendPaymentSuccessEmail",
        { orderId: response.razorpay_order_id,paymentId: response.razorpay_payment_id,amount,},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      console.log("PAYMENT SUCCESS EMAIL ERROR............", error.response.data.message)
      toast.error(error.response.data.message)
    }
  }
  