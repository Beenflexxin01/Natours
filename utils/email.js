const nodemailer = require('nodemailer');
// const catchAsync = require('./catchAsync');

const sendEmail = async function (options) {
  // Create  Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,
    // logger: true,
  });
  // Defind the email options
  const mailOptions = {
    from: 'Adenola Omotayo <testuser10@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // Send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
