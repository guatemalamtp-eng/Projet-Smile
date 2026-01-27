import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col-reverse items-center gap-10 px-4 py-16 md:flex-row md:py-24">
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            Art abstrait contemporain
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            La lumière dans
            <span className="bg-gradient-to-r from-sky-400 to-rose-400 bg-clip-text text-transparent">
              {' '}
              la matière
            </span>
          </h1>
          <p className="text-sm leading-relaxed text-neutral-300">
            Smile explore la frontière entre rêve et réalité à travers des
            toiles vibrantes. Chaque œuvre est une invitation à suspendre le
            temps et à se laisser traverser par la couleur.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
            >
              Découvrir la galerie
            </Link>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-medium text-neutral-200 hover:bg-white/5 transition"
            >
              En savoir plus
            </a>
          </div>
        </div>

        <div className="relative h-[320px] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-[0_0_80px_rgba(56,189,248,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,#22d3ee33,transparent),radial-gradient(circle_at_100%_100%,#f472b633,transparent)]" />
          <div className="relative flex h-full items-center justify-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-200">
              Une toile, une histoire
            </span>
          </div>
        </div>
      </div>

      <section
        id="about"
        className="mx-auto max-w-4xl px-4 pb-16 pt-4 md:pb-24"
      >
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
          L’artiste
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300">
          Smile est un·e artiste peintre basé·e à […]. À travers une pratique
          mêlant gestes spontanés et compositions minutieuses, il·elle explore
          les résonances intérieures de la couleur, de la lumière et de la
          texture.
        </p>
      </section>
    </div>
  );
}

