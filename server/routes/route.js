const express=require('express');
const router=express.Router()

const {addUser}=require("../controller/Signup")
const {login}=require("../controller/Login")
const {sendOTP}=require("../controller/OTP")

router.post("/login",login)
router.post("/signup",addUser)  
router.post("/otp",sendOTP)


const {auth}=require("../middleware/auth")

const {capturePayment,verifyPayment,sendPaymentSuccessEmail} = require("../controller/Payment")
  
router.post("/capturePayment",auth,capturePayment)
router.post("/verifyPayment",auth,verifyPayment)
router.post("/sendPaymentSuccessEmail",auth,sendPaymentSuccessEmail)


module.exports=router 