import nodemailer from 'nodemailer';
import { ContactMessage } from '@/types/message';

const TARGET_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'Yonogames2026@gmail.com';

export async function sendContactEmailNotification(message: ContactMessage): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'Yonogames2026@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';

  // Format date
  const formattedDate = new Date(message.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7FBF8; margin: 0; padding: 24px; color: #172331; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E4ECE7; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #087F5B; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
          .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
          .content { padding: 24px; }
          .field { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #5D6B78; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 600; color: #172331; background: #F8FAF9; padding: 10px 14px; border-radius: 10px; border: 1px solid #EEF3F0; }
          .message-box { background: #F8FAF9; padding: 16px; border-radius: 12px; border: 1px solid #E4ECE7; font-size: 14px; line-height: 1.6; color: #2D3748; white-space: pre-wrap; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; background: #EEF8F2; color: #087F5B; }
          .footer { padding: 18px 24px; background: #F8FAF9; border-top: 1px solid #EEF3F0; text-align: center; font-size: 12px; color: #5D6B78; }
          .reply-btn { display: inline-block; background: #087F5B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Inquiry - Real Yono Games</h1>
            <p>Received on ${formattedDate}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Sender Name</div>
              <div class="value">${message.name}</div>
            </div>
            <div class="field">
              <div class="label">Sender Email</div>
              <div class="value"><a href="mailto:${message.email}" style="color: #087F5B; text-decoration: none;">${message.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Category / Topic</div>
              <div><span class="badge">${message.category}</span></div>
            </div>
            <div class="field">
              <div class="label">User Message</div>
              <div class="message-box">${message.message}</div>
            </div>
            <div style="text-align: center;">
              <a href="mailto:${message.email}?subject=Re: Inquiry on Real Yono Games (${message.category})" class="reply-btn">
                ✉️ Reply to ${message.name}
              </a>
            </div>
          </div>
          <div class="footer">
            This message was submitted via the official contact form on <strong>realyonogame.com</strong> and saved in your Admin Dashboard.
          </div>
        </div>
      </body>
    </html>
  `;

  // If SMTP password configured, send via nodemailer
  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Real Yono Games Contact" <${smtpUser}>`,
        to: TARGET_EMAIL,
        replyTo: message.email,
        subject: `[Contact Form] ${message.category} from ${message.name}`,
        text: `New Inquiry from ${message.name} (${message.email})\nCategory: ${message.category}\n\nMessage:\n${message.message}\n\nDate: ${formattedDate}`,
        html: emailHtml,
      });

      console.log(`[Email] Notification email successfully sent to ${TARGET_EMAIL}`);
      return true;
    } catch (error) {
      console.error('[Email] Failed to send email via SMTP transporter:', error);
    }
  } else {
    console.log(`[Email] SMTP_PASS / GMAIL_APP_PASSWORD not configured. Message stored in Admin Dashboard for: ${TARGET_EMAIL}`);
  }

  return false;
}
