import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/toast-provider';
import AdminProtectedContent from './layout-protected';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  // Page de login : pas de protection, avec toasts pour les messages d'erreur
  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <ToastProvider />
      </>
    );
  }

  // Toutes les autres routes admin : vérifier l'auth (ADMIN ou CREATOR)
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'CREATOR')) {
    redirect('/admin/login');
  }

  return <AdminProtectedContent user={user}>{children}</AdminProtectedContent>;
}
