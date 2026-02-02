'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { redirectWithToast } from '@/lib/toast';

export async function registerClient(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const name = String(formData.get('name') ?? '').trim() || undefined;

  if (!email || !password) {
    redirectWithToast('/register', 'Veuillez remplir l’email et le mot de passe.', 'error');
    return;
  }

  if (password.length < 6) {
    redirectWithToast('/register', 'Le mot de passe doit contenir au moins 6 caractères.', 'error');
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    redirectWithToast('/register', 'Un compte existe déjà avec cet email.', 'error');
    return;
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name: name || email.split('@')[0],
      role: 'CLIENT',
    },
  });

  redirectWithToast('/login', 'Compte créé. Connectez-vous.', 'success');
}
