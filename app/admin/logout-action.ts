'use server';

import { redirect } from 'next/navigation';
import { destroySession } from '@/lib/auth';

export async function handleAdminLogout() {
  await destroySession();
  redirect('/admin/login');
}
