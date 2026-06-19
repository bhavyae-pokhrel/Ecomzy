const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
  console.log('mailSender() started');
  console.log('mailSender target email:', email);

  try {
    const host = process.env.MAIL_HOST || 'smtp.gmail.com';
    const user = process.env.MAIL_USER;
    const rawPass = process.env.MAIL_PASS || '';
    const normalizedPass = rawPass.replace(/\s+/g, '');

    console.log('ENV CHECK:', {
      host,
      user,
      passLength: normalizedPass.length,
      passExists: !!normalizedPass,
    });

    if (normalizedPass.length !== 16) {
      console.log('WARNING: Gmail app password length is not 16 characters. Current length:', normalizedPass.length);
    }

    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user,
        pass: normalizedPass,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      debug: true,
      logger: true,
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
      from: `"Ecomzy" <${user}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log('Mail send result:', info.response);
    return info;
  } catch (error) {
    console.log('mailSender catch block reached');
    console.log('MAIL ERROR message:', error.message);
    console.log('MAIL ERROR code:', error.code);
    console.log('MAIL ERROR command:', error.command);
    console.log('MAIL ERROR full object:', error);
    throw error;
  }
};

module.exports = mailSender;
