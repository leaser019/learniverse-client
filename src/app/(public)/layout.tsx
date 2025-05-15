'use client';
import Navbar from '@/components/layout/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.replace('/login');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sms pb-5">
        <Navbar />
      </header>
      <main className="container mt-10 mx-auto px-14 sm:px-16 lg:px-18 pt-20 pb-12">
        {children}
      </main>
    </div>
  );
}
