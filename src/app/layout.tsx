import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADNAEPC - Church Management System",
  description: "Système de gestion de l'église ADNA EPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
