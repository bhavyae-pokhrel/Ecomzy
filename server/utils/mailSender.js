const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
  console.log('mailSender() started');
  console.log('mailSender target email:', email);

  try {
    console.log('ENV CHECK:', {
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      passExists: !!process.env.MAIL_PASS,
    });

    const normalizedPass = (process.env.MAIL_PASS || '').replace(/\s+/g, '');
    console.log('Normalized password length:', normalizedPass.length);

    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: normalizedPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
      },
    });
    console.log('Transporter created');

    console.log('Running transporter.verify()...');
    await transporter.verify();
    console.log('Transporter verified successfully');

    console.log('Sending mail...');
    const info = await transporter.sendMail({
      from: `"Ecomzy" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log('Mail send result:', info.response);
    return info;
  } catch (error) {
    console.log('mailSender catch block reached');
    console.log('MAIL ERROR message:', error.message);
    console.log('MAIL ERROR full object:', error);
    throw error;
  }
};

module.exports = mailSender;
