import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="container w-full overflow-hidden relative">
    
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="grid place-items-center gap-8 mx-auto pb-10 md:pb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className="text-sm py-2 px-4 flex items-center gap-2 animate-pulse-slow rounded-2xl backdrop-blur-sm bg-white/50"
            >
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white">
                NEW
              </Badge>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-500">✨</span>
                <span className="font-medium tracking-wide">
                  LIMITLESS LEARNING JUST LAUNCHED!
                </span>
                <span className="text-blue-500">✨</span>
              </span>
            </Badge>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-screen-md mx-auto text-center text-3xl md:text-5xl font-bold"
          >
            <h1>
              Explore
              <motion.span 
                className="text-transparent px-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text inline-block"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
              >
                Learniverse
              </motion.span>
              today!
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-screen-sm mx-auto text-lg text-gray-600"
          >
            We&apos;re not just a learning tool – we&apos;re a vibrant community
            of passionate learners. Join us today to access exclusive resources
            and dedicated support.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="space-y-4 md:space-y-0 md:space-x-4"
          >
            <Button 
              className="w-5/6 md:w-1/3 font-bold group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
              onClick={() => {
                window.location.href = "https://learniversal.vercel.app/"
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
              <span className="relative z-10 flex items-center">
                Explore now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-5/6 md:w-1/3 font-bold relative overflow-hidden border border-blue-300/30 hover:border-blue-500/50 text-blue-600 group"
            >
              <Link href="https://github.com/learniverse-alpha" target="_blank">
                <span className="absolute inset-0 w-0 bg-blue-100 transition-all duration-300 group-hover:w-full"></span>
                <span className="relative z-10">Our GitHub</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}