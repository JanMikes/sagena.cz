export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'changeThisSecretKey'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'changeThisSalt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'changeThisTransferSalt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
