'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { redirectWithToast } from '@/lib/toast';

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirectWithToast('/admin/login', 'Veuillez remplir tous les champs', 'error');
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    redirectWithToast(
      '/admin/login',
      'Email ou mot de passe incorrect',
      'error',
    );
    return;
  }

  // Vérifier que c'est un admin
  if (user.role !== 'ADMIN') {
    redirectWithToast(
      '/admin/login',
      'Accès réservé aux administrateurs',
      'error',
    );
    return;
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    redirectWithToast(
      '/admin/login',
      'Email ou mot de passe incorrect',
      'error',
    );
    return;
  }

  await createSession(user.id);

  redirect('/admin/dashboard');
}
