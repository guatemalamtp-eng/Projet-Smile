import { prisma } from './prisma';

export async function createMessage(params: {
  email: string;
  name?: string;
  content: string;
  artworkId?: string;
}) {
  return prisma.message.create({
    data: {
      email: params.email,
      name: params.name,
      content: params.content,
      artworkId: params.artworkId,
    },
  });
}

