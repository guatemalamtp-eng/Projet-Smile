import { Suspense } from 'react';
import { ToastProvider } from '@/components/ui/toast-provider';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ToastProvider />
      </Suspense>
    </>
  );
}
