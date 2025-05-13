const { sendEmail } = require('./src/utils/emailHandler.cjs');

sendEmail('mreda.elalaoui1@gmail.com', 'Test Email', 'This is a test')
  .then(() => console.log('✅ Email sent'))
  .catch(err => console.error('❌ Failed to send email:', err));
