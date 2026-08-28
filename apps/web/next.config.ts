import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Anything the browser asks for under /api is passed through to the Python
  // API. So from the frontend you call `/api/health`, not `http://localhost:8000/health`.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
