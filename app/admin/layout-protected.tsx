import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/toast-provider';
import { handleAdminLogout } from './logout-action';

export const dynamic = 'force-dynamic';

export default async function AdminProtectedContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="hidden w-60 border-right border-white/10 bg-neutral-950/80 px-4 py-6 md:block">
        <div className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Admin
        </div>
        <nav className="space-y-2 text-sm">
          <Link
            href="/admin/dashboard"
            className="block rounded-md px-3 py-2 text-neutral-300 hover:bg-white/10"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/artworks"
            className="block rounded-md px-3 py-2 text-neutral-300 hover:bg-white/10"
          >
            Œuvres
          </Link>
          <Link
            href="/admin/messages"
            className="block rounded-md px-3 py-2 text-neutral-300 hover:bg-white/10"
          >
            Messages
          </Link>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="text-sm text-neutral-400">
            Connecté en tant que {user.email}
          </span>
          <form action={handleAdminLogout}>
            <button
              type="submit"
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10 transition"
            >
              Se déconnecter
            </button>
          </form>
        </header>
        <main className="px-4 py-6">{children}</main>
      </div>

      <Suspense fallback={null}>
        <ToastProvider />
      </Suspense>
    </div>
  );
}
