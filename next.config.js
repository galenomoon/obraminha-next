/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_GOOGLE_GEOLOCATION_API_KEY: process.env.REACT_APP_GOOGLE_GEOLOCATION_API_KEY,
    REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  },  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obraminha-assets.s3.amazonaws.com',
        port: '',
        pathname: '/*',
      },
    ],
  },
}

module.exports = nextConfig
