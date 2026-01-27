import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smile - Artiste peintre',
  description: "Site officiel de l’artiste peintre Smile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}

