"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [, setFloatAnim] = useState(0);
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatAnim((prev) => prev + 1);
    }, 50);

    const generateStars = () => {
      const newStars = Array(50)
        .fill(0)
        .map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
        }));
      setStars(newStars);
    };

    generateStars();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-4 overflow-hidden relative">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
            animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
          }}
        />
      ))}

      <div className="text-center space-y-8 max-w-md mx-auto z-10 relative">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-blue-500 opacity-20 blur-xl animate-pulse"></div>
            <Image
              src="/404_Not_Found.png"
              alt="Learniverse Logo"
              width={120}
              height={120}
              priority
              className="relative animate-spin-slow"
              style={{
                animation: 'spin-slow 20s linear infinite',
              }}
            />
          </div>

          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-600 animate-pulse">
            404
          </h1>

          <h2 className="mt-6 text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
            Oops! This page has traveled to another learning universe !!
          </h2>

          <div className="mt-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 animate-pulse"></div>
            <p className="relative mt-2 text-blue-100 bg-slate-900/60 backdrop-blur-sm p-4 rounded-lg border border-blue-800/50">
              It seems like you&apos;ve ventured too far into our universe.
              <br />
              The page looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
        </div>

        <div className="space-y-3 flex flex-col md:flex-row md:space-y-0 md:space-x-3 items-center justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full md:w-auto font-medium border border-blue-400/30 hover:border-blue-300 bg-slate-900/70 hover:bg-slate-800/90 text-blue-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go back to the previous page
          </Button>

          <Button
            asChild
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-medium shadow-lg shadow-blue-700/30 transition-all duration-300 hover:scale-105"
          >
            <Link href="/home">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2"
                />
              </svg>
              Back to home
            </Link>
          </Button>
        </div>

        <style jsx global>{`
          @keyframes twinkle {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="pt-8 text-blue-300/70 text-sm">
          © {new Date().getFullYear()} Learniverse. All rights reserved.
        </div>
      </div>
    </div>
  );
}