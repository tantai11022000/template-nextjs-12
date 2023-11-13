
/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: false,
  assetPrefix: '/amazon',
  basePath: '/amazon',
  i18n,
}

module.exports = nextConfig
