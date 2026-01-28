'use server';

import { redirect } from 'next/navigation';
import { destroySession } from '@/lib/auth';

export async function handleClientLogout() {
  await destroySession();
  redirect('/login');
}
