'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirectWithToast } from '@/lib/toast';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'service';
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let base = slug;
  let counter = 0;
  while (true) {
    const candidate = counter === 0 ? base : `${base}-${counter}`;
    const existing = await prisma.service.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
}

export async function createService(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirectWithToast('/admin/login', 'Non autorisé', 'error');
    return;
  }

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  if (!name) {
    redirectWithToast('/admin/services', 'Le nom est obligatoire.', 'error');
    return;
  }

  const slug = await ensureUniqueSlug(slugify(name));
  await prisma.service.create({
    data: { name, slug, description, creatorId: user.id },
  });
  redirectWithToast('/admin/services', 'Service créé.', 'success');
}

export async function updateService(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirectWithToast('/admin/login', 'Non autorisé', 'error');
    return;
  }

  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || null;
  if (!id || !name) {
    redirectWithToast('/admin/services', 'Données invalides.', 'error');
    return;
  }

  const existing = await prisma.service.findFirst({
    where: { id, creatorId: user.id },
  });
  if (!existing) {
    redirectWithToast('/admin/services', 'Service introuvable.', 'error');
    return;
  }

  const slug = await ensureUniqueSlug(slugify(name), id);
  await prisma.service.update({
    where: { id },
    data: { name, slug, description },
  });
  redirectWithToast('/admin/services', 'Service mis à jour.', 'success');
}

export async function deleteService(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'CREATOR') {
    redirectWithToast('/admin/login', 'Non autorisé', 'error');
    return;
  }

  const id = String(formData.get('id') ?? '');
  const existing = await prisma.service.findFirst({
    where: { id, creatorId: user.id },
  });
  if (!existing) {
    redirectWithToast('/admin/services', 'Service introuvable.', 'error');
    return;
  }

  await prisma.service.delete({ where: { id } });
  redirectWithToast('/admin/services', 'Service supprimé.', 'success');
}
