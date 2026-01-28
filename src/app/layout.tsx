import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plaide — Assistant IA pour Avocats",
  description: "Analysez vos dossiers juridiques en 5 minutes au lieu de 5 heures. PDF, audio, images — tout est analysé automatiquement.",
  keywords: ["avocat", "IA", "juridique", "analyse", "dossier", "legaltech"],
  authors: [{ name: "Plaide" }],
  openGraph: {
    title: "Plaide — Assistant IA pour Avocats",
    description: "Analysez vos dossiers juridiques en 5 minutes au lieu de 5 heures.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="font-body antialiased bg-gradient-dark min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}
