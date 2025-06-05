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
      from: `"HomeCare Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #ddd;">
          <h2>Email Verification</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px;
          text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>Or open this link manually: <br/><a href="${url}">${url}</a></p>
        </div>
      `,
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
