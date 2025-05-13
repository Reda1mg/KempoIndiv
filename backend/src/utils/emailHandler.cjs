const nodemailer = require('nodemailer');

const email = 'kempo6497@gmail.com';
const pass = 'mddt rbmq ssps tiws';

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: pass,
    },
  });

  await transporter.sendMail({
    from: email,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
