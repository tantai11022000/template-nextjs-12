const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'jp'],
    /**
     * Turn off automatic locale detection based on header (Accept-Language) or domain
     */
    localeDetection: false
  },
  /**
   * updates to your translation JSON files without having
   * to restart your development server
   */
  reloadOnPrerender: true,
  // react: { useSuspense: false } //this line
  /**
   * Preload the translations
   */
  ns: ['common'],
  localePath: path.resolve('./src/locales')
};