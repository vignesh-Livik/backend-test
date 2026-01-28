const nodemailer = require("nodemailer");
// createTransport is a function used to reusable transport instance (for multiple mail connection)
// transporter is an object which is a connection between a gmail service and message we send .
console.log("mail:", process.env.EMAIL_ID, "pass", process.env.GOOGLE_APP_PASSWORD)
const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },

});



module.exports = transporter;
