export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: any }) {
    strapi.contentType('plugin::users-permissions.user').attributes.firstName = {
      type: 'string',
    };
    strapi.contentType('plugin::users-permissions.user').attributes.lastName = {
      type: 'string',
    };
    strapi.contentType('plugin::users-permissions.user').attributes.gdprConsentAt = {
      type: 'datetime',
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    const { sagenaEmailTemplate, sendStrapiEmail } = await import('./utils/email');

    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async beforeUpdate(event: any) {
        const { where } = event.params;
        const userId = where?.id || where?.$and?.[0]?.id;
        if (!userId) return;

        const existing = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { id: userId },
          select: ['confirmed'],
        });

        event.state = { wasConfirmed: existing?.confirmed ?? false };
      },

      async afterUpdate(event: any) {
        const { result, state } = event;
        if (!state || state.wasConfirmed || !result.confirmed) return;

        // User was just confirmed (false -> true)
        const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
        const loginUrl = `${siteUrl}/cs/intranet`;
        const firstName = result.firstName || '';

        const html = sagenaEmailTemplate({
          title: 'Váš účet byl schválen',
          bodyHtml: `<p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b; line-height: 1.6;">Dobrý den${firstName ? `, ${firstName}` : ''},</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b; line-height: 1.6;">Váš účet na intranetu Sagena byl schválen. Nyní se můžete přihlásit.</p>
            <a href="${loginUrl}" style="display: inline-block; background-color: #005086; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">Přihlásit se</a>
            <p style="margin: 24px 0 0 0; font-size: 16px; color: #71717a; line-height: 1.6;">S pozdravem,<br>Tým Sagena</p>`,
        });

        try {
          await sendStrapiEmail(strapi, {
            to: result.email,
            subject: 'Váš účet na intranetu Sagena byl schválen',
            html,
          });
        } catch (error) {
          strapi.log.error('Failed to send user approval email:', error);
        }
      },
    });
  },
};
