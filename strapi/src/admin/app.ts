import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Enable Czech locale for admin UI (English always included as fallback)
    locales: ['cs'],

    // Custom translation overrides for Sagena branding
    translations: {
      cs: {
        'Auth.form.welcome.title': 'Vítejte v Sagena CMS',
        'Auth.form.welcome.subtitle': 'Přihlaste se ke správě obsahu',
      },
    },

    // Disable English-only tutorials
    tutorials: false,

    // Disable release notifications
    notifications: { releases: false },
  },

  bootstrap(app: StrapiApp) {},
  register(app: StrapiApp) {},
};
