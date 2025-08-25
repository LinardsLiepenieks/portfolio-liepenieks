import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdd5sokbvhobtp5v.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**', // allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
