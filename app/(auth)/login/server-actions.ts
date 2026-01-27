'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { redirectWithToast } from '@/lib/toast';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirectWithToast('/login', 'Veuillez remplir tous les champs', 'error');
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    redirectWithToast(
      '/login',
      'Email ou mot de passe incorrect',
      'error',
    );
    return;
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    redirectWithToast(
      '/login',
      'Email ou mot de passe incorrect',
      'error',
    );
    return;
  }

  await createSession(user.id);

  redirect('/admin/dashboard');
}

