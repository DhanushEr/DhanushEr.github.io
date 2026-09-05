/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — deploys to any static host, no Next server runtime.
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
