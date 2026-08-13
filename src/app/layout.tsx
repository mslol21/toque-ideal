import type { Metadata } from 'next';
import './globals.css';
import { ShowroomProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Toque Ideal - Artigos de Decoração & Showroom Digital',
  description: 'Há mais de 10 anos criando peças decorativas em vidro e artigos de decoração de alto padrão que transformam ambientes.',
  keywords: ['Toque Ideal', 'Artigos de Decoração', 'Decoração em Vidro', 'Home Decor', 'Vidro Lapidado', 'ABCasa Fair'],
  authors: [{ name: 'Toque Ideal' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Toque Ideal Digital Showroom - Artigos de Decoração',
    description: 'Peças decorativas em vidro que transformam ambientes.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="light bg-slate-50 text-slate-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <ShowroomProvider>
          {children}
        </ShowroomProvider>
      </body>
    </html>
  );
}
