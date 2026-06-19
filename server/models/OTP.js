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
        expires:60*5
    },
    otp:{
        type:String,
        require:true,
    }
})

const sendVerificationEmail = async (email, otp) => {
    const mailResponse = await mailSender(email, 'Verification Email', emailTemplate(otp));
    console.log('mail Response--->', mailResponse.response);
}

OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            console.log('Preparing to send verification email:', { email: this.email, otp: this.otp });
            await sendVerificationEmail(this.email, this.otp);
            next();
        } catch (error) {
            console.log('FULL OTP ERROR:', error);
            next(error);
        }
    } else {
        next();
    }
});

module.exports=mongoose.model("OTP",OTPSchema)