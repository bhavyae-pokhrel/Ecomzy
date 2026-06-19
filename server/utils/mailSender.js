const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // ADD THIS 👇
    console.log("ENV CHECK:", {
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      passExists: !!process.env.MAIL_PASS,
    });

    const normalizedPass = (process.env.MAIL_PASS || "").replace(/\s+/g, "");

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: normalizedPass,
      },
    });

    // ADD THIS 👇
    await transporter.verify();
    console.log("Transporter verified ✅");

    let info = await transporter.sendMail({
      from: `"Ecomzy" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("information--->", info.response);
    return info;
  } catch (error) {
    console.log("MAIL ERROR:", error.message); // ADD THIS 👇
    console.log("FULL ERROR:", error);
    throw error;
  }
};

module.exports = mailSender;
