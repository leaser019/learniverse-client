"use client"

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <header className="pt-4 px-4 flex flex-col">
        <div className="flex items-center text-center justify-center space-x-2 mb-4">
          <Image
            src="/LearniverseLogo.png"
            alt="Learniverse Logo"
            width={40}
            height={40}
            priority
          />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Learniverse
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="pt-9 mb-2 text-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
        <div className="flex justify-center space-x-4 mb-2">
          <Link href="/terms" className="hover:text-blue-500 transition-colors">
            Term
          </Link>
          <Link href="/privacy" className="hover:text-blue-500 transition-colors">
            Privacy
          </Link>
          <Link href="/help" className="hover:text-blue-500 transition-colors">
            Help
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Learniverse. All rights reserved.</p>
      </footer>
      <Toaster position="top-right" richColors />
    </div>
  );
}