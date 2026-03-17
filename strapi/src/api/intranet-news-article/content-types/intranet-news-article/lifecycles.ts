import { sagenaEmailTemplate, sendStrapiEmail } from '../../../../utils/email';

export default {
  async afterCreate(event: any) {
    const { result } = event;
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

    // Get all confirmed users
    const users = await strapi.db.query('plugin::users-permissions.user').findMany({
      where: { confirmed: true },
      select: ['email'],
    });

    const emails = users.map((u: any) => u.email).filter(Boolean);
    if (emails.length === 0) return;

    const articleUrl = `${siteUrl}/cs/intranet/aktuality/${result.slug}`;

    const html = sagenaEmailTemplate({
      title: 'Nová aktualita na intranetu',
      bodyHtml: `<p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b; line-height: 1.6;">Na intranetu Sagena byla publikována nová aktualita:</p>
        <p style="margin: 0 0 24px 0; font-size: 20px; color: #18181b; font-weight: 600;">${result.title}</p>
        <a href="${articleUrl}" style="display: inline-block; background-color: #005086; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">Zobrazit aktualitu</a>`,
    });

    try {
      await sendStrapiEmail(strapi, {
        to: process.env.EMAIL_FROM || 'noreply@sagena.cz',
        bcc: emails.join(','),
        subject: `Nová aktualita: ${result.title}`,
        html,
      });
    } catch (error) {
      strapi.log.error('Failed to send news article notification:', error);
    }
  },
};
