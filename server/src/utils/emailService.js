const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  const { data, error } = await resend.emails.send({
    from: "FundTrust <onboarding@resend.dev>",
    to,
    subject,
    text,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #ea580c; margin-bottom: 16px;">FundTrust</h2>
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; color: #374151;">
          ${text.replace(/\n/g, "<br/>")}
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
          This email was sent by FundTrust. Please do not reply.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Email failed:", error);
    throw new Error(error.message);
  }

  console.log("✅ Email sent to:", to, "| id:", data.id);
};

module.exports = sendEmail;