/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse'],  // ✅ Fixes pdf-parse bundling
};

module.exports = nextConfig;