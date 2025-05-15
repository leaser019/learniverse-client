'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push(`/home`);
    } else {
      router.push(`/login`);
    }
  }, [router]);
  return <div className="bg-gray-50"></div>;
};

export default Home;
