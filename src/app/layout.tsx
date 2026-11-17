import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heston — Oportunidades e Networking",
  description:
    "Plataforma de oportunidades educacionais e profissionais (empregos, estágios, cursos, intercâmbios e eventos).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
