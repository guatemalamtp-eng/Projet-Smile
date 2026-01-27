'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirectWithToast } from '@/lib/toast';

export async function createArtwork(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  const technique = String(formData.get('technique') ?? '').trim() || null;
  const status = String(formData.get('status') ?? 'AVAILABLE');
  const widthCmRaw = String(formData.get('widthCm') ?? '').trim();
  const heightCmRaw = String(formData.get('heightCm') ?? '').trim();

  if (!title || !slug || !imageUrl) {
    redirectWithToast(
      '/admin/artworks/new',
      'Veuillez remplir tous les champs requis (titre, slug, image)',
      'error',
    );
    return;
  }

  // Vérifier si le slug existe déjà
  const existing = await prisma.artwork.findUnique({
    where: { slug },
  });

  if (existing) {
    redirectWithToast(
      '/admin/artworks/new',
      'Ce slug existe déjà. Veuillez en choisir un autre.',
      'error',
    );
    return;
  }

  const widthCm = widthCmRaw ? parseInt(widthCmRaw, 10) : null;
  const heightCm = heightCmRaw ? parseInt(heightCmRaw, 10) : null;

  try {
    await prisma.artwork.create({
      data: {
        title,
        slug,
        imageUrl,
        description,
        technique,
        status: status === 'SOLD' ? 'SOLD' : 'AVAILABLE',
        widthCm: widthCm ?? undefined,
        heightCm: heightCm ?? undefined,
        artistId: user.id,
      },
    });

    redirectWithToast(
      '/admin/artworks',
      'Œuvre créée avec succès !',
      'success',
    );
  } catch (error) {
    redirectWithToast(
      '/admin/artworks/new',
      'Erreur lors de la création de l’œuvre. Veuillez réessayer.',
      'error',
    );
  }
}

