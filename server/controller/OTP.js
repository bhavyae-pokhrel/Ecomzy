const User = require("../models/User");
const OtpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

exports.sendOTP = async (req, res) => {
  console.log("sendOTP() called");
  console.log("Request body:", req.body);

  try {
    const { email } = req.body;
    console.log("Email received:", email);

    if (!email) {
      console.log("Email missing in request body");
      return res.status(400).json({
        success: false,
        message: "Please Enter Email",
      });
    }

    console.log("Checking if user exists...");
    const checkUserPresent = await User.findOne({ email });
    console.log("User exists result:", !!checkUserPresent);

    if (checkUserPresent) {
      console.log("User already registered, stopping request");
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }

    console.log("Generating OTP...");
    const otp = OtpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated:", otp);

    console.log("Saving OTP document...");
    const otpBody = await OTP.create({ email, otp });
    console.log("OTP document created:", otpBody._id);

    console.log("Calling mailSender...");
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email",
        emailTemplate(otp),
      );
      console.log(
        "mailSender success:",
        mailResponse?.response || mailResponse,
      );
    } catch (mailError) {
      console.log("mailSender failed with error:", mailError.message);
      await OTP.deleteOne({ _id: otpBody._id });
      console.log("Deleted OTP document after mail failure");
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: mailError.message,
      });
    }

    console.log("Returning success response");
    return res.status(200).json({
      success: true,
      otp,
      message: "OTP Generated Successfully",
    });
  } catch (error) {
    console.log("sendOTP catch block reached");
    console.error("OTP controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
};
