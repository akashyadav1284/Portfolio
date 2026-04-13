import type { Metadata } from 'next';
import { Inter, Space_Mono, Orbitron } from 'next/font/google';
import CustomCursor from '@/components/CustomCursor';
import './globals.css';
import SceneBackground from '@/components/SceneBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Akash Yadav | Full Stack Developer',
  description: 'AkashVerse-code and connect',
  keywords: ['Akash Yadav', 'Portfolio', 'Full Stack Developer', 'MERN', 'AI', 'Web3', 'Cyberpunk', '3D Website'],
  authors: [{ name: 'Akash Yadav' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${orbitron.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="antialiased text-slate-200 selection:bg-cyan-500/30 font-inter bg-slate-950 font-sans cursor-none" suppressHydrationWarning>
        <SceneBackground />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
