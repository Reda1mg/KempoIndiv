// sendEmail.js
const nodemailer = require('nodemailer');
const email = 'kempo6497@gmail.com'
const pass = 'mddt rbmq ssps tiws'

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: pass,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;