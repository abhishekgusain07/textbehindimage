"use client";
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
} from "@/components/ui/resizable-navbar";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useAuthActions } from "@convex-dev/auth/react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";

export function NavbarDemo({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const { theme, toggleTheme } = useDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    {
      name: "Features",
      link: "/#features",
    },
    {
      name: "Examples",
      link: "/dashboard",
    },
    {
      name: "About",
      link: "/#about",
    },
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initial for avatar
  const getUserInitial = () => {
    if (!user || !user.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
    }
  };

  const handleLogin = () => {
    navigate("/sign-in");
  };

  // Working theme toggle component
  const ThemeToggle = ({ className = "" }: { className?: string }) => {
    return (
      <Button
        onClick={() => {
          const newTheme = theme === 'light' ? 'dark' : 'light';
          
          // Direct DOM manipulation for immediate effect
          document.documentElement.setAttribute('data-theme', newTheme);
          document.body.style.background = newTheme === 'dark' ? '#0f172a' : '#ffffff';
          document.body.style.color = newTheme === 'dark' ? '#f1f5f9' : '#1f2937';
          localStorage.setItem('theme', newTheme);
          
          toggleTheme();
        }}
        className={`p-2 rounded-lg border transition-colors hover:bg-gray-100 z-50 dark:hover:bg-gray-700 ${className}`}
        style={{
          background: theme === 'light' ? '#ffffff' : '#1f2937',
          color: theme === 'light' ? '#1f2937' : '#f1f5f9',
          borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
          minWidth: '40px',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </Button>
    );
  };

  // Render avatar skeleton during loading
  const renderAuthUI = () => {
    if (isLoading) {
      return (
        <div className="h-10 w-10 rounded-full animate-pulse flex items-center justify-center" style={{ background: 'var(--bg-accent)' }}>
          <div className="h-5 w-5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}></div>
        </div>
      );
    }

    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium cursor-pointer hover:opacity-90 transition-opacity"
            >
              {getUserInitial()}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md z-50" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)', border: `1px solid var(--border-primary)` }}>
                <div className="py-1">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="block w-full text-left px-4 py-2 text-sm hover:cursor-pointer transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full text-left px-4 py-2 text-sm hover:cursor-pointer relative transition-colors"
                    style={{
                      color: isLoggingOut ? 'var(--text-tertiary)' : 'var(--text-red)',
                      background: isLoggingOut ? 'var(--bg-accent)' : 'transparent'
                    }}
                    onMouseEnter={(e) => !isLoggingOut && (e.currentTarget.style.background = 'var(--bg-accent)')}
                    onMouseLeave={(e) => !isLoggingOut && (e.currentTarget.style.background = 'transparent')}
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="opacity-50">Logging out...</span>
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-red)' }}></span>
                      </>
                    ) : (
                      "Log out"
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
        <ThemeToggle />
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
        <div className="w-full h-10 rounded-md animate-pulse" style={{ background: 'var(--bg-accent)' }}></div>
      );
    }

    if (isLoggedIn) {
      return (
        <>
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</span>
            <ThemeToggle />
          </div>
          <NavbarButton
            onClick={() => {
              navigate("/dashboard");
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
            className={`w-full relative ${isLoggingOut ? "opacity-70" : ""}`}
          >
            {isLoggingOut ? (
              <>
                <span>Logging out...</span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></span>
              </>
            ) : (
              "Log out"
            )}
          </NavbarButton>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</span>
          <ThemeToggle />
        </div>
        <NavbarButton
          onClick={() => {
            navigate("/sign-in");
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
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
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
