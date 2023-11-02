/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : null,
  assetPrefix: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : null,
}

module.exports = nextConfig
