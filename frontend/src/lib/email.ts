import nodemailer from 'nodemailer';

export function createTransporter() {
  const smtpPort = parseInt(process.env.SMTP_PORT || '1025', 10);
  const smtpEncryption = process.env.SMTP_ENCRYPTION?.toLowerCase();
  const isSecure = smtpEncryption === 'ssl' || smtpEncryption === 'tls' || smtpPort === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: smtpPort,
    secure: isSecure,
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });
}

export function sagenaEmailTemplate({ title, subtitle, bodyHtml }: {
  title: string;
  subtitle?: string;
  bodyHtml: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #005086 0%, #004069 100%); padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${title}</h1>
              ${subtitle ? `<p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">${subtitle}</p>` : ''}
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 13px; color: #71717a; text-align: center;">
                Tato zpráva byla automaticky vygenerována systémem <strong style="color: #005086;">Sagena</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendEmail({ to, subject, html, bcc }: {
  to: string | string[];
  subject: string;
  html: string;
  bcc?: string | string[];
}): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@sagena.cz',
    to,
    subject,
    html,
    ...(bcc && { bcc }),
  });
}
