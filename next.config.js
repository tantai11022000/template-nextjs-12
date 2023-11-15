/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : null,
  // assetPrefix: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : null,
  i18n,
}

module.exports = nextConfig
