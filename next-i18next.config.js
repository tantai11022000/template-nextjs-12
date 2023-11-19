const path = require('path');

module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'jp', 'vi'], 
      defaultLanguage: "en",
      otherLanguages: ["en", "jp"],
      fallbackLng: ["en"],
    },
    localePath: path.resolve('./src/locales')
}