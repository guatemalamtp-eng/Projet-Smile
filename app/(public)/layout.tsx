import { unstable_noStore } from 'next/cache';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { PublicHeader } from '@/components/layout/public-header';
import { ToastProvider } from '@/components/ui/toast-provider';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  unstable_noStore();
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader user={user ?? undefined} />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Smile – Tous droits réservés.
      </footer>

      <Suspense fallback={null}>
        <ToastProvider />
      </Suspense>
    </div>
  );
}
