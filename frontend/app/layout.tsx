import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LearnFlow — Adaptive Learning Platform',
  description: 'AI-powered adaptive learning with personalized revision planning, performance analytics, and an AI coaching assistant.',
  keywords: 'adaptive learning, AI tutor, revision planner, mock tests, analytics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex h-screen overflow-hidden`}
        style={{ background: 'var(--bg-primary)' }}
        suppressHydrationWarning
      >
        <ClientProviders>
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
          <KeyboardShortcuts />
        </ClientProviders>
      </body>
    </html>
  );
}
