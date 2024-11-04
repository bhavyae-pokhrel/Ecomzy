const User=require("../models/User")
const OtpGenerator=require("otp-generator")
const OTP=require("../models/OTP")

exports.sendOTP=async(req,res)=>{

    try{
        const {email}=req.body;
    
        if(!email){
            return res.status(400).json({
                success:false,
                message:'Please Enter Email',
            })
        }
    
        const checkUserPresent=await User.findOne({email})
    
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User Already Registered'
    
            })
        }
        var otp=OtpGenerator.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        })
         
        const otpBody=await OTP.create({email,otp});
        console.log(otpBody)
        return res.status(200).json({
            success:true,
            otp,
            message:'OTP Generated Successfully'
        })
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}