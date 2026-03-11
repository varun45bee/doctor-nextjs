/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pratimaagale.in",
      },
    ],
  },
};

export default nextConfig;