const { Resend } = require("resend");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a verification email
 * @param {string} to - Recipient's email address
 * @param {string} code - 6-digit verification code
*/
const sendEmail = async (to, code) => {
    try {
        const data = await resend.emails.send({
            from: "InsightBoard <no-reply@insightboard.xyz>",
            to,
            subject: "Verify your email address",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to InsightBoard 👋</h2>
                <p>Here's your verification code:</p>
                <p style="font-size: 24px; font-weight: bold;">${code}</p>
                </div>
            `
        });
        return { success: true, data };
    } catch (error) {
        console.log("Error sending email:", error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };