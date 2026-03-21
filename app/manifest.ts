import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Koschei',
    short_name: 'Koschei',
    description: 'Geleceğin eğitimi burada. AI destekli mentor, kod üretici, ses ve görsel araçlarıyla öğrenmeyi yeniden keşfet.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#060608',
    theme_color: '#3D7BFF',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
