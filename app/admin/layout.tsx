import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminProtectedContent from './layout-protected';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  // Page de login : pas de protection, pas de layout admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Toutes les autres routes admin : vérifier l'auth
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return <AdminProtectedContent user={user}>{children}</AdminProtectedContent>;
}
