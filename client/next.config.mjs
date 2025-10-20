/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-inventorymanagement.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Suppress specific warnings in development
      config.ignoreWarnings = [
        /defaultProps will be removed from function components/,
        /Support for defaultProps will be removed/,
      ];
    }
    return config;
  },
};

export default nextConfig;
