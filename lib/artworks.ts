import { prisma } from './prisma';

/** Œuvre mise en avant du jour (rotation automatique : change chaque jour) */
export async function getFeaturedArtworkOfTheDay() {
  const artworks = await prisma.artwork.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      artist: { select: { id: true, name: true } },
    },
  });
  if (artworks.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % artworks.length;
  return artworks[dayIndex];
}

export async function getPublicArtworks() {
  return prisma.artwork.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      status: true,
      widthCm: true,
      heightCm: true,
      technique: true,
      likesCount: true,
    },
  });
}

export async function getArtworkBySlug(slug: string) {
  return prisma.artwork.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      description: true,
      status: true,
      widthCm: true,
      heightCm: true,
      technique: true,
      likesCount: true,
      createdAt: true,
    },
  });
}

