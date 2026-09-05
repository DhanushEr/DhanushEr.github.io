import type { Metadata } from 'next';
import { Archivo, Public_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dhanush M — Applied AI & Computer Vision',
  description:
    'Data Scientist and ML engineer building production LLM and computer-vision systems: automated site inspection, multi-agent document extraction, and multilingual voice-to-structured-data.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ground font-body text-ink antialiased">{children}</body>
    </html>
  );
}
