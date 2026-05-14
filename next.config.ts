import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  experimental: {
    // מאפשר העלאת תמונות דחוסות (data URLs) עד 8MB ב־Server Actions
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
