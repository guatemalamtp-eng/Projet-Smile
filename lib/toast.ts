import { redirect } from 'next/navigation';

export function redirectWithToast(
  path: string,
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
) {
  const params = new URLSearchParams();
  params.set('toast', message);
  params.set('toastType', type);
  redirect(`${path}?${params.toString()}`);
}
