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
  bootstrap(/* { strapi } */) {},
};
