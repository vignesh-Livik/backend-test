const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, html }) => {
    const response = await sgMail.send({
        to,
        from: process.env.MAIL,
        subject,
        html,
    });
};

module.exports = sendMail;