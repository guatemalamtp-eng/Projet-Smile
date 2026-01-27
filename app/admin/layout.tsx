'use client';

import { usePathname } from 'next/navigation';
import AdminProtectedWrapper from './layout-protected-wrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Si on est sur la page de login, rendre directement sans protection
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Sinon, rendre le wrapper protégé
  return <AdminProtectedWrapper>{children}</AdminProtectedWrapper>;
}
