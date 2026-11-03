/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
    serverComponentsExternalPackages: ["firebase-admin", "googleapis"],
  },
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