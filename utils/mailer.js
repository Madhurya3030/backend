require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter with Gmail and debug options
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Verify the transporter setup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

/**
 * Sends a verification email to the given user email with the token.
 * @param {string} email - User's email address
 * @param {string} token - Email verification token
 */
async function sendVerificationEmail(email, token) {
  try {
    const url = `https://homecare-backend-ke7r.onrender.com/api/auth/verify?token=${token}`;
    
    const mailOptions = {
  from: `"HomeCare Support" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Verify Your HomeCare Account',
  html: `
    <div style="font-family: Arial, sans-serif; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #4CAF50;">Welcome to HomeCare</h2>
      <p>We're excited to have you on board! Please verify your email address by clicking the button below:</p>
      <a href="${url}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
        Verify My Email
      </a>
      <p>If the button doesn't work, you can also copy and paste this URL into your browser:</p>
      <p style="word-break: break-all;"><a href="${url}">${url}</a></p>
      <hr/>
      <p style="font-size: 12px; color: gray;">This email was sent by HomeCare. If you didn’t request this, please ignore.</p>
    </div>
  `
};




    console.log(`📨 Sending email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
}

module.exports = sendVerificationEmail;
