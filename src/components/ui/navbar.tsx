'use client';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';
import { Button } from './button';

export function NavbarDemo({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems: { name: string; link: string }[] = [
    // {
    //   name: 'Features',
    //   link: '/#features',
    // },
    // {
    //   name: 'Examples',
    //   link: '/dashboard',
    // },
    // {
    //   name: 'About',
    //   link: '/#about',
    // },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initial for avatar
  const getUserInitial = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  const handleLogin = () => {
    navigate('/sign-in');
  };

  // Render avatar skeleton during loading
  const renderAuthUI = () => {
    if (isLoading) {
      return (
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-gray-300"></div>
        </div>
      );
    }

    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-medium hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-colors duration-150"
            >
              {getUserInitial()}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md z-50 bg-white shadow-lg border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:cursor-pointer transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`block w-full text-left px-4 py-2 text-sm hover:cursor-pointer relative transition-colors ${
                      isLoggingOut
                        ? 'text-gray-400 bg-gray-50'
                        : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="opacity-50">Logging out...</span>
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 border-2 border-t-transparent border-red-400 rounded-full animate-spin"></span>
                      </>
                    ) : (
                      'Log out'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <NavbarButton variant="secondary" onClick={handleLogin}>
          Login
        </NavbarButton>
      </div>
    );
  };

  // Render auth UI for mobile menu
  const renderMobileAuthUI = () => {
    if (isLoading) {
      return (
        <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
      );
    }

    if (isLoggedIn) {
      return (
        <>
          <NavbarButton
            onClick={() => {
              navigate('/dashboard');
              setIsMobileMenuOpen(false);
            }}
            variant="primary"
            className="w-full"
          >
            Dashboard
          </NavbarButton>
          <NavbarButton
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            disabled={isLoggingOut}
            variant="secondary"
            className={`w-full relative ${isLoggingOut ? 'opacity-70' : ''}`}
          >
            {isLoggingOut ? (
              <>
                <span>Logging out...</span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></span>
              </>
            ) : (
              'Log out'
            )}
          </NavbarButton>
        </>
      );
    }

    return (
      <>
        <NavbarButton
          onClick={() => {
            navigate('/sign-in');
            setIsMobileMenuOpen(false);
          }}
          variant="primary"
          className="w-full"
        >
          Login
        </NavbarButton>
      </>
    );
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="">
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">{renderAuthUI()}</div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-gray-800 hover:text-blue-600 transition-colors"
              >
                <span className="block font-medium">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {renderMobileAuthUI()}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <div className="pt-20">{children}</div>
    </div>
  );
}
