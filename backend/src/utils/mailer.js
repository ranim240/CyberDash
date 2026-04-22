import nodemailer from 'nodemailer';

// ── Singleton transporter — created once, reused for all emails ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a password reset email to the user.
 * @param {string} to      — recipient email address
 * @param {string} username — recipient username for personalization
 * @param {string} resetLink — full URL to the frontend reset page
 */
export const sendResetEmail = async (to, username, resetLink) => {
  const mailOptions = {
    from: `"CyberDash Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request — CyberDash',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #060910; color: #e2e8f0; padding: 40px 32px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #00d4ff; font-size: 28px; letter-spacing: 3px; margin: 0;">CYBERDASH</h1>
          <p style="color: #64748b; font-size: 12px; letter-spacing: 2px; margin-top: 4px;">CYBERSECURITY TRAINING PLATFORM</p>
        </div>
        
        <p style="margin-bottom: 16px;">Hello <strong style="color: #00d4ff;">${username}</strong>,</p>
        <p style="margin-bottom: 24px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password. This link will expire in <strong>15 minutes</strong>.
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" 
             style="background: linear-gradient(135deg, #00d4ff 0%, #0099bb 100%); color: #060910; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; display: inline-block;">
            RESET PASSWORD
          </a>
        </div>
        
        <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e3a5f;">
          If you did not request this reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
