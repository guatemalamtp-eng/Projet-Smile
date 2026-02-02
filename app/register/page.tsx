import { registerClient } from './server-actions';
import { PublicHeader } from '@/components/layout/public-header';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <PublicHeader activeLink="login" showRegisterLink />
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <main className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950/80 px-6 py-8 shadow-xl">
          <h1 className="text-lg font-semibold tracking-tight">
            Créer un compte
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Accédez à votre espace visiteur.
          </p>

          <form action={registerClient} className="mt-6 space-y-4">
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="text-neutral-300">
                Nom (optionnel)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label htmlFor="email" className="text-neutral-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label htmlFor="password" className="text-neutral-300">
                Mot de passe (min. 6 caractères)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
            >
              Créer mon compte
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-neutral-500">
            Déjà un compte ?{' '}
            <a href="/login" className="text-neutral-300 hover:text-white">
              Se connecter
            </a>
          </p>
        </main>
      </div>
    </div>
  );
}
