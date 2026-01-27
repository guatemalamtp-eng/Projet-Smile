import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app';

  try {
    // Récupérer toutes les œuvres publiques
    const artworks = await prisma.artwork.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

  const artworkUrls = artworks.map((artwork) => ({
    url: `${baseUrl}/artworks/${artwork.slug}`,
    lastModified: artwork.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...artworkUrls,
  ];
  } catch (error) {
    // En cas d'erreur (ex: DB non disponible), retourner au moins les pages principales
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
