'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirectWithToast } from '@/lib/toast';

export async function updateCreatorProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirectWithToast('/admin/login', 'Non autorisé', 'error');
    return;
  }

  const bio = String(formData.get('bio') ?? '').trim() || null;
  const avatarUrl = String(formData.get('avatarUrl') ?? '').trim() || null;
  const videoUrl = String(formData.get('videoUrl') ?? '').trim() || null;
  const galleryRaw = String(formData.get('galleryUrls') ?? '').trim();
  const galleryUrls = galleryRaw
    ? galleryRaw.split(/\r?\n/).map((u) => u.trim()).filter(Boolean)
    : [];
  const isPublic = formData.get('isPublic') === 'on';

  const existing = await prisma.creatorProfile.findUnique({
    where: { userId: user.id },
  });

  const data = { bio, avatarUrl, videoUrl, galleryUrls, isPublic };

  if (existing) {
    await prisma.creatorProfile.update({
      where: { userId: user.id },
      data,
    });
  } else {
    await prisma.creatorProfile.create({
      data: { userId: user.id, ...data },
    });
  }

  redirectWithToast('/admin/profile', 'Profil mis à jour.', 'success');
}
