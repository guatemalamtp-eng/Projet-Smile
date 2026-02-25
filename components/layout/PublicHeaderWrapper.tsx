'use client';

import { usePathname } from 'next/navigation';
import { PublicHeader } from './public-header';

type User = { email: string; role: 'ADMIN' | 'CLIENT' | 'CREATOR' };

type Props = {
  user?: User;
  showRegisterLink?: boolean;
  showClientLoginLink?: boolean;
};

function getActiveLink(pathname: string): 'home' | 'gallery' | 'artist' | 'artistes' | 'services' | 'login' | undefined {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/gallery')) return 'gallery';
  if (pathname.startsWith('/artistes')) return 'artistes';
  if (pathname.startsWith('/services')) return 'services';
  if (pathname === '/login' || pathname === '/register') return 'login';
  return undefined;
}

export function PublicHeaderWrapper({
  user,
  showRegisterLink = false,
  showClientLoginLink = false,
}: Props) {
  const pathname = usePathname() ?? '';
  const activeLink = getActiveLink(pathname);
  const showRegister = showRegisterLink || pathname === '/register';
  const showClient = showClientLoginLink || pathname === '/login';

  return (
    <PublicHeader
      user={user}
      activeLink={activeLink}
      showRegisterLink={showRegister}
      showClientLoginLink={showClient}
    />
  );
}
