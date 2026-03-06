const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return true;
  }

  try {
    await getTransporter().sendMail({
      from: `"Collab Notes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Collab Notes Verification Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#4f46e5;text-align:center">Collab Notes</h2>
          <p style="color:#374151;text-align:center">Your verification code is:</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;text-align:center;margin:16px 0">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1f2937">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;text-align:center">This code expires in 5 minutes.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
};

module.exports = { generateOTP, sendOTP };
