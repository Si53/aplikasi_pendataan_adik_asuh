/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Menaikkan batas ukuran body Server Action untuk upload dokumen dari HP
  serverActions: {
    bodySizeLimit: '15mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
}

export default nextConfig
