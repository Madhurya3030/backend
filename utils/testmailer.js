require('dotenv').config();
const sendVerificationEmail = require('./utils/mailer');

const testEmail = 'your-email@example.com';  // <-- change to your real email
const testToken = 'dummy-verification-token';

sendVerificationEmail(testEmail, testToken)
  .then(() => {
    console.log('✅ Test email sent successfully!');
  })
  .catch((err) => {
    console.error('❌ Failed to send test email:', err);
  });
