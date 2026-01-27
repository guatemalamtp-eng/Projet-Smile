import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="text-center">
        <h1 className="text-6xl font-semibold tracking-tight text-white">
          404
        </h1>
        <p className="mt-4 text-sm text-neutral-400">
          La page que vous recherchez n'existe pas.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-medium text-neutral-200 hover:bg-white/5 transition"
          >
            Voir la galerie
          </Link>
        </div>
      </div>
    </div>
  );
}
