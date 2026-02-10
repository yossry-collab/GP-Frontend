/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'img-prod-cms-rt-microsoft-com.akamaized.net' },
      { protocol: 'https', hostname: 'us.norton.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
