// mailSender.js — HTTPS API version (works on Render free tier)
// Uses Resend (https://resend.com) instead of raw SMTP, since Render's
// free tier blocks outbound SMTP ports 25/465/587. HTTPS (443) is never blocked.

const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  console.log('mailSender() started');
  console.log('mailSender target email:', email);

  try {
    const { data, error } = await resend.emails.send({
      from: `Ecomzy <${process.env.MAIL_FROM}>`, // e.g. onboarding@resend.dev for testing, or your verified domain
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      console.log('Resend API error:', error);
      throw new Error(error.message || 'Failed to send email via Resend');
    }

    console.log('Mail sent successfully, id:', data.id);
    return data;
  } catch (error) {
    console.log('mailSender catch block reached');
    console.log('MAIL ERROR message:', error.message);
    throw error;
  }
};

module.exports = mailSender;
