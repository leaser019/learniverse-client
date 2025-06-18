import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { UserData } from '@/types/Users';
import {
  BrainIcon,
  FlaskConicalIcon,
  HomeIcon,
  LogOut,
  Menu,
  RocketIcon,
  Settings,
  User,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
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

  const handleLogOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData') || '{}'));
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMobileNav = (path: string) => {
    setIsOpen(false);
    window.location.href = path;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full transition-all duration-300',
        scrolled ? 'py-2' : 'py-4'
      )}
    >
      <div
        className={cn(
          'mx-auto w-[95%] max-w-7xl flex items-center justify-between rounded-2xl transition-all duration-300',
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        )}
        style={{
          padding: scrolled ? '0.5rem' : '1rem',
        }}
      >
        <div className="flex-1 flex items-center gap-2 px-6 py-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent tracking-tight drop-shadow">
            Learniverse
          </span>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all my-1',
                        pathname.startsWith(item.path)
                          ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md scale-105'
                          : 'bg-transparent text-gray-600',
                        'hover:bg-blue-100 hover:text-blue-600',
                        'focus:outline-none focus:ring-2 focus:ring-blue-100'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-6 h-6',
                          pathname.startsWith(item.path) ? 'text-white' : 'text-gray-600'
                        )}
                      />
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
                  <AvatarImage src={userData?.avatar || 'https://github.com/shadcn.png'} />
                  <AvatarFallback>{userData?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{userData?.username || 'User'}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Link href="/user" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>User</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <Link href="/login" className="flex items-center w-full" />
                <DropdownMenuItem className="text-red-600" onClick={handleLogOut}>
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full p-2 hover:bg-blue-100 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 top-20 mx-4 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl animate-fadeIn z-[60]">
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMobileNav(item.path)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all',
                  pathname.startsWith(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow'
                    : 'hover:bg-blue-50 text-gray-700'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar>
                  <AvatarImage src={userData?.avatar || 'https://github.com/shadcn.png'} />
                  <AvatarFallback>{userData?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userData?.username || 'User'}</p>
                  <p className="text-sm text-gray-500">{userData?.email || ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center gap-2 px-4 py-2 mt-2 rounded-lg text-red-600 hover:bg-red-50 transition-all font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
