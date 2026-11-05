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
      {
        protocol: "https",
        hostname: "www.pratimaagale.in",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.giphy.com",
      },
    ],
  },
};

export default nextConfig;