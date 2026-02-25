'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { redirectWithToast } from '@/lib/toast';

export async function submitProjectRequest(formData: FormData) {
  const creatorId = String(formData.get('creatorId') ?? '').trim();
  const serviceId = String(formData.get('serviceId') ?? '').trim() || undefined;
  const clientName = String(formData.get('clientName') ?? '').trim();
  const clientEmail = String(formData.get('clientEmail') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const budget = String(formData.get('budget') ?? '').trim() || undefined;

  if (!creatorId) {
    redirectWithToast(
      '/projet-sur-commande',
      'Veuillez choisir un créateur.',
      'error',
    );
    return;
  }

  if (!clientName || !clientEmail || !message) {
    redirectWithToast(
      '/projet-sur-commande',
      'Veuillez remplir tous les champs obligatoires.',
      'error',
    );
    return;
  }

  const creator = await prisma.user.findFirst({
    where: { id: creatorId, role: 'CREATOR' },
  });

  if (!creator) {
    redirectWithToast(
      '/projet-sur-commande',
      'Créateur introuvable.',
      'error',
    );
    return;
  }

  if (serviceId) {
    const service = await prisma.service.findFirst({
      where: { id: serviceId, creatorId },
    });
    if (!service) {
      redirectWithToast(
        '/projet-sur-commande',
        'Service introuvable pour ce créateur.',
        'error',
      );
      return;
    }
  }

  await prisma.projectRequest.create({
    data: {
      creatorId,
      serviceId: serviceId || null,
      clientName,
      clientEmail,
      message,
      budget: budget || null,
    },
  });

  redirectWithToast(
    '/projet-sur-commande',
    'Votre demande a bien été envoyée. Nous vous recontacterons rapidement.',
    'success',
  );
}
