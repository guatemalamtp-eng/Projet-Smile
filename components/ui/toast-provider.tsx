'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ToastProvider() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = searchParams.get('toast');
  const type = searchParams.get('toastType') || 'info';

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('toast');
        params.delete('toastType');
        const newUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;
        router.replace(newUrl);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast, searchParams, router]);

  if (!toast) return null;

  const bgColor =
    type === 'success'
      ? 'bg-green-500/90'
      : type === 'error'
        ? 'bg-red-500/90'
        : 'bg-blue-500/90';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${bgColor} rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-bottom-2`}
      >
        {toast}
      </div>
    </div>
  );
}
