'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function updateArtwork(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
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

  const widthCm = widthCmRaw ? parseInt(widthCmRaw, 10) : null;
  const heightCm = heightCmRaw ? parseInt(heightCmRaw, 10) : null;

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

  redirect('/admin/artworks');
}

export async function deleteArtwork(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const id = String(formData.get('id') ?? '').trim();

  await prisma.artwork.delete({
    where: { id },
  });

  redirect('/admin/artworks');
}

