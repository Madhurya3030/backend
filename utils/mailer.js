require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  try {
    const url = `https://homecare-backend-ke7r.onrender.com/api/auth/verify?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`
    };

    console.log(`Sending email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw error;
  }
}

module.exports = sendVerificationEmail;

