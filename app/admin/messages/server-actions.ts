'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirectWithToast } from '@/lib/toast';

export async function deleteMessage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const id = String(formData.get('id') ?? '').trim();

  try {
    await prisma.message.delete({
      where: { id },
    });

    redirectWithToast(
      '/admin/messages',
      'Message supprimé avec succès',
      'success',
    );
  } catch (error) {
    redirectWithToast(
      '/admin/messages',
      'Erreur lors de la suppression. Veuillez réessayer.',
      'error',
    );
  }
}
