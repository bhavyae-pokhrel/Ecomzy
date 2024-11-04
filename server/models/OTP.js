const mongoose=require('mongoose');
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema= mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now,
        expire:60*5
    },
    otp:{
        type:String,
        require:true,
    }
})

const sendVerificationEmail=async (email,otp)=>{
    try{
        const mailResponse= await mailSender(email,'Verification Email',emailTemplate(otp))
        console.log('mail Response--->',mailResponse.response)
    }
    catch(error){
        console.log('mail error-->',error.message);
    }
}

OTPSchema.pre("save",async function (next){
    if(this.isNew){
       console.log('Preparing to send verification email:', { email: this.email, otp: this.otp });
       await sendVerificationEmail(this.email,this.otp);
       next();
    }
})  

module.exports=mongoose.model("OTP",OTPSchema)