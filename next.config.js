/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : null,
  assetPrefix: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : null,
  async rewrites(){
    return [
      {
        source: `/_next/:path*`,
        destination: `${process.env.NEXT_PUBLIC_SUB_URL}/_next/:path*`
      },
      {
        source: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL : '/',
        destination: process.env.NEXT_PUBLIC_SUB_URL ? process.env.NEXT_PUBLIC_SUB_URL + '/' : '/' + `campaign-budgets`
      }
    ]
  }
}

module.exports = nextConfig
