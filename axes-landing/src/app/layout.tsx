import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AXES - No digas lo que sabes hacer. Demuéstralo.",
  description: "La plataforma AI-first donde tu trabajo habla por ti. Construye tu reputación profesional basada en evidencia real, no en palabras. Conecta con empresas y desarrolladores que valoran el talento auténtico.",
  keywords: ["portfolio", "desarrollo", "programación", "talento", "AI", "validación", "proyectos", "skills"],
  authors: [{ name: "AXES Team" }],
  creator: "AXES",
  publisher: "AXES",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://axes.dev",
    siteName: "AXES",
    title: "AXES - No digas lo que sabes hacer. Demuéstralo.",
    description: "La plataforma AI-first donde tu trabajo habla por ti. Construye tu reputación profesional basada en evidencia real.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AXES - Plataforma de validación de talento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AXES - No digas lo que sabes hacer. Demuéstralo.",
    description: "La plataforma AI-first donde tu trabajo habla por ti.",
    images: ["/og-image.jpg"],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
