'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
          <div className="text-center">
            <h1 className="text-6xl font-semibold tracking-tight">
              Erreur
            </h1>
            <p className="mt-4 text-sm text-neutral-400">
              Une erreur critique s'est produite.
            </p>
            <button
              onClick={reset}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
