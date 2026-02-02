import Link from 'next/link';

type PublicHeaderProps = {
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
  activeLink,
  showRegisterLink = false,
  showClientLoginLink = false,
}: PublicHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className={`text-lg font-semibold tracking-tight ${linkClass(activeLink === 'home')}`}
        >
          SMILE
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className={linkClass(activeLink === 'home')}>
            Accueil
          </Link>
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
        </nav>
      </div>
    </header>
  );
}
