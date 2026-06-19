const User = require("../models/User");
const OtpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Email",
      });
    }

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const otp = OtpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpBody = await OTP.create({ email, otp });
    console.log("OTP document created:", otpBody._id);

    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email",
        emailTemplate(otp),
      );
      console.log("Mail response:", mailResponse.response);
    } catch (mailError) {
      await OTP.deleteOne({ _id: otpBody._id });
      console.error("OTP mail error:", mailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: mailError.message,
      });
    }

    return res.status(200).json({
      success: true,
      otp,
      message: "OTP Generated Successfully",
    });
  } catch (error) {
    console.error("OTP controller error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
};