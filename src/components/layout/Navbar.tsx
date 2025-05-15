"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { UserData } from '@/types/Users';
import { motion } from 'framer-motion';
import {
  BrainIcon,
  FlaskConicalIcon,
  HomeIcon,
  LogOut,
  Menu,
  RocketIcon,
  Settings,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const userData: UserData = JSON.parse(localStorage.getItem('userData') || '{}');

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Explore', path: '/explore', icon: RocketIcon },
    { name: 'Study', path: '/my-space', icon: BrainIcon },
    { name: 'Connect', path: '/community', icon: UsersIcon },
    { name: 'Lab', path: '/lab', icon: FlaskConicalIcon },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full transition-all duration-300',
        scrolled ? 'py-2' : 'py-4'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <motion.div
        className={cn(
          'mx-auto w-[95%] max-w-7xl flex items-center justify-between rounded-2xl transition-all duration-300',
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        )}
        animate={{
          padding: scrolled ? '0.5rem' : '1rem',
        }}
      >
        <motion.div className="flex-1 flex items-center gap-2 px-6 py-3">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Learniverse
          </span>
        </motion.div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-md transition-all my-1',
                        pathname === item.path
                          ? 'text-blue-500 hover:text-blue-700 bg-blue-50'
                          : 'bg-transparent text-gray-600',
                        'hover:bg-blue-100 hover:text-blue-600',
                        'focus:outline-none focus:ring-2 focus:ring-blue-100'
                      )}
                    >
                      <motion.div whileHover={{ scale: 1.2 }}>
                        <item.icon
                          className={cn(
                            'w-6 h-6',
                            'hover:text-blue-600',
                            pathname === item.path ? 'text-blue-500' : 'text-gray-600'
                          )}
                        />
                      </motion.div>
                      <span className="text-md">{item.name}</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex-1 flex items-center justify-end px-6 py-3">
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{userData?.username}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{userData?.username}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      {isOpen && (
        <motion.div
          className="fixed inset-x-0 top-20 mx-4 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 rounded-xl"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{userData?.username}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userData?.username}</p>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar