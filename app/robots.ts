import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/sitemap.xml`,
  };
}
