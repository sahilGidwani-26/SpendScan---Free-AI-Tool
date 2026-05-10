const nodemailer = require("nodemailer");

/**
 * Send transactional email via Resend (preferred) or SMTP fallback.
 * Free tier: Resend allows 100 emails/day.
 */

async function sendAuditEmail({ to, companyName, totalMonthlySavings, shareUrl, highSavings }) {
  const subject = highSavings
    ? `Your AI Spend Audit — $${totalMonthlySavings}/mo in potential savings`
    : `Your AI Spend Audit is ready`;

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Your AI Spend Audit</h1>
      ${companyName ? `<p style="color: #666; margin-bottom: 24px;">For ${companyName}</p>` : ""}
      
      <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <p style="font-size: 14px; color: #666; margin: 0 0 8px;">Potential monthly savings</p>
        <p style="font-size: 36px; font-weight: 700; color: #16a34a; margin: 0;">$${totalMonthlySavings.toLocaleString()}</p>
        <p style="font-size: 14px; color: #666; margin: 4px 0 0;">$${(totalMonthlySavings * 12).toLocaleString()} annually</p>
      </div>

      <p>View your full audit breakdown:</p>
      <a href="${shareUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View Audit Report →</a>
      
      ${highSavings ? `
      <div style="margin-top: 32px; padding: 20px; border: 2px solid #16a34a; border-radius: 8px;">
        <h3 style="margin: 0 0 8px; font-size: 16px;">You qualify for a Credex consultation</h3>
        <p style="margin: 0; font-size: 14px; color: #444;">With $${totalMonthlySavings}/mo in identified overspend, our team can help you access discounted AI infrastructure credits — often 20-40% below retail. We'll reach out within 2 business days.</p>
      </div>
      ` : ""}

      <p style="margin-top: 32px; font-size: 12px; color: #999;">
        Sent by <a href="https://credex.rocks" style="color: #999;">Credex</a> · 
        <a href="${shareUrl}" style="color: #999;">View report</a>
      </p>
    </div>
  `;

  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = require("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "audit@credex.rocks",
        to,
        subject,
        html: htmlBody,
      });
      return { success: true, provider: "resend" };
    } catch (err) {
      console.error("Resend failed:", err.message);
    }
  }

  // SMTP fallback (Gmail, Mailgun SMTP, etc.)
  if (process.env.SMTP_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || "audit@credex.rocks",
        to,
        subject,
        html: htmlBody,
      });
      return { success: true, provider: "smtp" };
    } catch (err) {
      console.error("SMTP failed:", err.message);
    }
  }

  // Dev mode — log to console
  console.log(`📧 [DEV] Email to ${to}: ${subject}`);
  return { success: true, provider: "console" };
}

module.exports = { sendAuditEmail };
