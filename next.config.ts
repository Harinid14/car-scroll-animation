import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/car-scroll-animation",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;