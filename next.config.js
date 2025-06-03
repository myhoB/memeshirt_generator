/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];

    // Add a fallback for the canvas module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    // Ensure images are handled properly
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/i,
      type: 'asset/resource'
    });

    return config;
  },
  // Ensure images are optimized
  images: {
    domains: ['localhost'],
    unoptimized: true
  }
};

module.exports = nextConfig; 