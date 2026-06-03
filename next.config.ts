import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The repo has multiple lockfiles; pin the workspace root to this app.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
