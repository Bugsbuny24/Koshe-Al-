import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://koschei.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/x42-panel', '/api/', '/dashboard', '/mentor', '/builder', '/create', '/settings'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
