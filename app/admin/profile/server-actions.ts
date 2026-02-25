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
  const isPublic = formData.get('isPublic') === 'on';

  const existing = await prisma.creatorProfile.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    await prisma.creatorProfile.update({
      where: { userId: user.id },
      data: { bio, avatarUrl, isPublic },
    });
  } else {
    await prisma.creatorProfile.create({
      data: {
        userId: user.id,
        bio,
        avatarUrl,
        isPublic,
      },
    });
  }

  redirectWithToast('/admin/profile', 'Profil mis à jour.', 'success');
}
