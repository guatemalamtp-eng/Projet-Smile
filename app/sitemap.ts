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

  const creators = await prisma.user.findMany({
    where: { creatorProfile: { isPublic: true } },
    select: { id: true },
  });
  const creatorUrls = creators.map((c) => ({
    url: `${baseUrl}/artistes/${c.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/artistes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/projet-sur-commande`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...artworkUrls,
    ...creatorUrls,
  ];
  } catch (error) {
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/artistes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
      { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
      { url: `${baseUrl}/projet-sur-commande`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ];
  }
}
