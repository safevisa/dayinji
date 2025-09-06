module.exports = {
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
  },
  localePath: './public/locales',
  fallbackLng: 'zh-TW',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
