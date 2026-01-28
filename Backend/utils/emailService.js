const transporter = require("../config/emailConfig");

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_ID,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
