const path = require('path');

module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'jp', 'vi'], 
    },
    localePath: path.resolve('./src/locales')
}