'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirectWithToast } from '@/lib/toast';

export async function updateArtwork(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const id = String(formData.get('id') ?? '').trim();
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
      `/admin/artworks/${id}`,
      'Veuillez remplir tous les champs requis',
      'error',
    );
    return;
  }

  // Vérifier si le slug existe déjà pour une autre œuvre
  const existing = await prisma.artwork.findUnique({
    where: { slug },
  });

  if (existing && existing.id !== id) {
    redirectWithToast(
      `/admin/artworks/${id}`,
      'Ce slug existe déjà. Veuillez en choisir un autre.',
      'error',
    );
    return;
  }

  const widthCm = widthCmRaw ? parseInt(widthCmRaw, 10) : null;
  const heightCm = heightCmRaw ? parseInt(heightCmRaw, 10) : null;

  try {
    await prisma.artwork.update({
      where: { id },
      data: {
        title,
        slug,
        imageUrl,
        description,
        technique,
        status: status === 'SOLD' ? 'SOLD' : 'AVAILABLE',
        widthCm: widthCm ?? undefined,
        heightCm: heightCm ?? undefined,
      },
    });

    redirectWithToast(
      '/admin/artworks',
      'Œuvre modifiée avec succès !',
      'success',
    );
  } catch (error) {
    redirectWithToast(
      `/admin/artworks/${id}`,
      'Erreur lors de la modification. Veuillez réessayer.',
      'error',
    );
  }
}

export async function deleteArtwork(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const id = String(formData.get('id') ?? '').trim();

  try {
    await prisma.artwork.delete({
      where: { id },
    });

    redirectWithToast(
      '/admin/artworks',
      'Œuvre supprimée avec succès',
      'success',
    );
  } catch (error) {
    redirectWithToast(
      '/admin/artworks',
      'Erreur lors de la suppression. Veuillez réessayer.',
      'error',
    );
  }
}

