import { prisma } from './prisma';

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

