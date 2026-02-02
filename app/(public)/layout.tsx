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

      <footer className="border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 text-center text-xs text-neutral-500 sm:flex-row sm:gap-4">
          <span>© {new Date().getFullYear()} Smile – Tous droits réservés.</span>
          <a
            href="/admin/login"
            className="text-neutral-600 hover:text-neutral-400 transition"
          >
            Espace admin
          </a>
        </div>
      </footer>

      <Suspense fallback={null}>
        <ToastProvider />
      </Suspense>
    </div>
  );
}
