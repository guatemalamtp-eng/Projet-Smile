import Link from 'next/link';
import { handleAdminLogout } from '@/app/admin/logout-action';
import { handleClientLogout } from '@/app/client/logout-action';

type PublicHeaderProps = {
  /** Utilisateur connecté (optionnel) — si présent, on affiche Mon espace / Espace admin + Se déconnecter */
  user?: { email: string; role: 'ADMIN' | 'CLIENT' };
  /** Lien actif pour le style (optionnel) */
  activeLink?: 'home' | 'gallery' | 'artist' | 'login';
  /** Afficher "Créer un compte" (page connexion client) */
  showRegisterLink?: boolean;
  /** Afficher "Connexion visiteur" vers /login (page connexion admin) */
  showClientLoginLink?: boolean;
};

const linkClass = (active: boolean) =>
  active
    ? 'text-white font-medium'
    : 'text-neutral-300 hover:text-white transition';

export function PublicHeader({
  user,
  activeLink,
  showRegisterLink = false,
  showClientLoginLink = false,
}: PublicHeaderProps) {
  const isLoggedIn = !!user;

  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className={`text-lg font-semibold tracking-tight ${linkClass(activeLink === 'home')}`}
        >
          Accueil
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/gallery"
            className={linkClass(activeLink === 'gallery')}
          >
            Galerie
          </Link>
          <Link
            href="/#about"
            className={linkClass(activeLink === 'artist')}
          >
            L&apos;artiste
          </Link>
          {isLoggedIn ? (
            <>
              {user.role === 'CLIENT' && (
                <Link
                  href="/client/dashboard"
                  className="text-neutral-300 hover:text-white transition"
                >
                  Mon espace
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="text-neutral-300 hover:text-white transition"
                >
                  Espace admin
                </Link>
              )}
              <form action={user.role === 'ADMIN' ? handleAdminLogout : handleClientLogout} className="inline">
                <button
                  type="submit"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Se déconnecter
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={linkClass(activeLink === 'login')}
              >
                Connexion
              </Link>
              {showRegisterLink && (
                <Link
                  href="/register"
                  className="text-neutral-400 hover:text-white transition"
                >
                  Créer un compte
                </Link>
              )}
              {showClientLoginLink && (
                <Link
                  href="/login"
                  className="text-neutral-400 hover:text-white transition text-xs"
                >
                  Connexion visiteur
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
