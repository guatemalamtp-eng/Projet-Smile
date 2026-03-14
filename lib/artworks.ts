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

export async function getPublicArtworks(artistId?: string) {
  return prisma.artwork.findMany({
    where: artistId ? { artistId } : undefined,
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
      artistId: true,
      artist: {
        select: { id: true, name: true },
      },
    },
  });
}

/** Pour habiller le site : quelques œuvres en rotation (fond, bannières) */
export async function getArtworksForBackground(limit = 6) {
  const artworks = await prisma.artwork.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { id: 'asc' },
    select: { id: true, imageUrl: true, title: true, slug: true, artist: { select: { name: true } } },
  });
  if (artworks.length === 0) return [];
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % Math.max(1, artworks.length);
  const rotated = [...artworks.slice(dayIndex), ...artworks.slice(0, dayIndex)];
  return rotated.slice(0, limit);
}

export async function getArtworkBySlug(slug: string) {
  return prisma.artwork.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      galleryUrls: true,
      description: true,
      status: true,
      widthCm: true,
      heightCm: true,
      technique: true,
      likesCount: true,
      createdAt: true,
      artistId: true,
      artist: {
        select: { id: true, name: true },
      },
    },
  });
}

