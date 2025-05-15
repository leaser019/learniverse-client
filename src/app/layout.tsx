import ReduxProvider from '@/redux/provider';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Learniverse',
  description: 'Learniverse - A platform for creative studying',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50`}
        >
          <ReduxProvider>
            <SandpackProvider>{children}</SandpackProvider>
          </ReduxProvider>
        </body>
      </html>
    </>
  );
}
