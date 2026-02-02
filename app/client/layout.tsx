import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/toast-provider';
import { handleClientLogout } from './logout-action';

export const dynamic = 'force-dynamic';

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'CLIENT') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/client/dashboard" className="text-lg font-semibold tracking-tight text-white shrink-0">
            Mon Espace
          </Link>
          <nav className="flex items-center gap-4 text-sm text-neutral-300">
            <Link href="/" className="hover:text-white transition">
              Accueil
            </Link>
            <Link href="/gallery" className="hover:text-white transition">
              Galerie
            </Link>
            <Link href="/#about" className="hover:text-white transition">
              L&apos;artiste
            </Link>
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm text-neutral-400">
              {user.name || user.email}
            </span>
            <form action={handleClientLogout}>
              <button
                type="submit"
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10 transition"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Suspense fallback={null}>
        <ToastProvider />
      </Suspense>
    </div>
  );
}
