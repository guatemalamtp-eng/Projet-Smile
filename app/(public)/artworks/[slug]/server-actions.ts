'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createMessage } from '@/lib/messages';

export async function likeArtwork(artworkId: string) {
  await prisma.artwork.update({
    where: { id: artworkId },
    data: { likesCount: { increment: 1 } },
  });

  // Pas de redirection : le compteur sera vu au prochain rendu
}

export async function sendMessageForArtwork(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim() || undefined;
  const content = String(formData.get('content') ?? '').trim();
  const artworkId = String(formData.get('artworkId') ?? '').trim() || undefined;

  if (!email || !content) {
    return;
  }

  await createMessage({
    email,
    name,
    content,
    artworkId,
  });

  redirect('/gallery');
}

