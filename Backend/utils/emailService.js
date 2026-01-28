const transporter = require("../config/emailConfig.js");
console.log("mail:", process.env.EMAIL_ID,)
const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_ID,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
