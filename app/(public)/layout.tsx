import Link from 'next/link';
import { Suspense } from 'react';
import { ToastProvider } from '@/components/ui/toast-provider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SMILE
          </Link>
          <nav className="flex items-center gap-4 text-sm text-neutral-300">
            <Link href="/gallery" className="hover:text-white transition">
              Galerie
            </Link>
            <Link href="/#about" className="hover:text-white transition">
              L'artiste
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Connexion
            </Link>
          </nav>
        </div>
      </header>

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
