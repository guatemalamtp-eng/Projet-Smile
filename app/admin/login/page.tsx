import { loginAdmin } from './server-actions';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <main className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-950/80 px-6 py-8 shadow-xl">
        <h1 className="text-lg font-semibold tracking-tight">
          Connexion administrateur
        </h1>
        <p className="mt-1 text-xs text-neutral-400">
          Réservé à l'artiste.
        </p>

        <form action={loginAdmin} className="mt-6 space-y-4">
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
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-200 transition"
          >
            Se connecter
          </button>
        </form>
      </main>
    </div>
  );
}
