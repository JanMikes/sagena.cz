export default ({ env }) => ({
  'sortable-entries': {
    enabled: true,
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'cs',
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'localhost'),
        port: parseInt(env('SMTP_PORT', '1025'), 10),
        secure: env('SMTP_PORT', '1025') === '465',
        auth: env('SMTP_USER')
          ? {
              user: env('SMTP_USER'),
              pass: env('SMTP_PASS'),
            }
          : undefined,
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@sagena.cz'),
      },
    },
  },
});
