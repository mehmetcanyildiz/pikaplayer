/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'], // Allow images from all domains - you might want to restrict this in production
  },
  output: 'standalone',
}
