const transporter = require("../config/emailConfig.js");
console.log("mail:", process.env.EMAIL_ID,)
const sendMail = async (options) => {
  try {
    const info = await transporter.sendMail({
      // from: process.env.EMAIL_ID,
      ...options
    });
    console.log("✅ Email sent:", {
      messageId: info.messageId,
      to: options.to,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return { success: true, info };
  } catch (error) {
    console.error("❌ Email send error:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });

    return { success: false, error };
  }

};

module.exports = sendMail;
