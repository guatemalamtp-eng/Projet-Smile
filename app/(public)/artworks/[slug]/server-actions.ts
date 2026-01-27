'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createMessage } from '@/lib/messages';
import { redirectWithToast } from '@/lib/toast';

const LIKE_COOKIE_PREFIX = 'liked_';

export async function likeArtwork(artworkId: string, slug: string) {
  const cookieStore = cookies();
  const likeCookie = `${LIKE_COOKIE_PREFIX}${artworkId}`;

  // Vérifier si l'utilisateur a déjà liké
  if (cookieStore.get(likeCookie)) {
    redirectWithToast(
      `/artworks/${slug}`,
      'Vous avez déjà aimé cette œuvre',
      'info',
    );
    return;
  }

  await prisma.artwork.update({
    where: { id: artworkId },
    data: { likesCount: { increment: 1 } },
  });

  // Marquer comme liké dans un cookie (expire dans 1 an)
  cookieStore.set(likeCookie, 'true', {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  });

  redirectWithToast(
    `/artworks/${slug}`,
    'Merci pour votre like ! ❤️',
    'success',
  );
}

export async function sendMessageForArtwork(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim() || undefined;
  const content = String(formData.get('content') ?? '').trim();
  const artworkId = String(formData.get('artworkId') ?? '').trim() || undefined;

  if (!email || !content) {
    redirectWithToast(
      artworkId ? `/artworks/${artworkId}` : '/gallery',
      'Veuillez remplir tous les champs requis',
      'error',
    );
    return;
  }

  try {
    await createMessage({
      email,
      name,
      content,
      artworkId,
    });

    redirectWithToast(
      artworkId ? `/artworks/${artworkId}` : '/gallery',
      'Message envoyé avec succès ! L’artiste vous répondra bientôt.',
      'success',
    );
  } catch (error) {
    redirectWithToast(
      artworkId ? `/artworks/${artworkId}` : '/gallery',
      'Erreur lors de l’envoi du message. Veuillez réessayer.',
      'error',
    );
  }
}

