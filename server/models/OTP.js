const mongoose = require('mongoose');

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    },
    otp: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("OTP", OTPSchema);