import { Suspense } from 'react';
import { PublicHeader } from '@/components/layout/public-header';
import { ToastProvider } from '@/components/ui/toast-provider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

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
