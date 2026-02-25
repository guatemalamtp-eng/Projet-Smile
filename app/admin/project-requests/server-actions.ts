'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirectWithToast } from '@/lib/toast';

const VALID_STATUSES = ['NEW', 'IN_PROGRESS', 'ACCEPTED', 'REFUSED'] as const;

export async function updateProjectRequestStatus(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'CREATOR')) {
    redirectWithToast('/admin/login', 'Non autorisé', 'error');
    return;
  }

  const id = String(formData.get('id') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim();

  if (!id || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    redirectWithToast('/admin/project-requests', 'Données invalides.', 'error');
    return;
  }

  const request = await prisma.projectRequest.findUnique({
    where: { id },
  });
  if (!request) {
    redirectWithToast('/admin/project-requests', 'Demande introuvable.', 'error');
    return;
  }

  if (user.role === 'CREATOR' && request.creatorId !== user.id) {
    redirectWithToast('/admin/project-requests', 'Non autorisé.', 'error');
    return;
  }

  await prisma.projectRequest.update({
    where: { id },
    data: { status: status as typeof VALID_STATUSES[number] },
  });

  redirectWithToast('/admin/project-requests', 'Statut mis à jour.', 'success');
}
