const path = require('path');

module.exports = {
    i18n: {
      locales: ['en', 'jp', 'vi'], 
      defaultLocale: 'en'
    },
    localePath: path.resolve('./src/locales')
}