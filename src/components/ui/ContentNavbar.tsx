'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoChevronBack, IoMenu, IoClose, IoArrowBack } from 'react-icons/io5';
import NavbarLink from './links/NavbarLink';
import ReturnButton from './button/ReturnButton';

// Utility function to merge classes (replace with your preferred method)
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ContentNavbarProps {
  className?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  customReturnRoute?: string; // Add custom return route option
}

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
  { name: 'Projects', href: '/projects' },
] as const;

export function ContentNavbar({
  className,
  showBackButton = true,
  onBackClick,
  customReturnRoute,
}: ContentNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Smart back navigation logic
  const handleBackClick = () => {
    if (onBackClick) {
      // Use custom back handler if provided
      onBackClick();
    } else if (customReturnRoute) {
      // Use custom return route if provided
      const urlWithInstant = `${customReturnRoute}?instant=true`;
      router.push(urlWithInstant);
    } else {
      // Smart routing based on URL parameters (similar to your experience page)
      const returnSection = parseInt(searchParams.get('returnTo') || '0');
      const sectionRoutes = ['/', '/about', '/contact'];
      const targetRoute = sectionRoutes[returnSection] || '/';
      const urlWithInstant = `${targetRoute}?instant=true`;
      router.push(urlWithInstant);
    }
  };

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-neutral-900/50 backdrop-blur-sm shadow-sm',
          'flex items-center justify-between px-9 py-6 pt-7 pt-4.5',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Back Button - visible on all screen sizes */}
        {showBackButton && (
          <ReturnButton
            icon={{
              type: 'react-icons',
              component: IoArrowBack,
            }}
            size="sm"
            onClick={handleBackClick}
            className="bg-transparent hover:bg-neutral-800 p-4 hover:cursor-pointer"
          />
        )}

        {/* Desktop Navigation Links - visible on lg+ screens */}
        <div className="flex items-center space-x-6 hidden md:flex">
          {navigationItems.map((item) => (
            <NavbarLink
              key={item.href}
              href={item.href}
              label={item.name}
              onClick={(event) => {
                event.preventDefault();
                handleNavigation(item.href);
              }}
            />
          ))}
        </div>

        {/* Menu Toggle Button - visible on md and below */}
        <button
          onClick={toggleMenu}
          className={cn(
            'flex items-center justify-center w-10 h-10  md:hidden rounded-3xl',
            'text-white transition-colors duration-200 hover:bg-white/10',
            'focus:outline-none'
          )}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className="relative w-6 h-6 hover:cursor-pointer  flex items-center justify-center p-4 ">
            <IoMenu
              className={cn(
                'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300',
                isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
              )}
            />
            <IoClose
              className={cn(
                'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300',
                isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
              )}
            />
          </div>{' '}
        </button>
      </nav>

      {/* Mobile Menu Overlay - only on lg and below */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-neutral-900/50 transition-opacity duration-300 lg:hidden',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu - only on lg and below */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed top-16 left-0 right-0 z-40 bg-neutral-900 border-b border-neutral-700 lg:hidden',
          'transform transition-all duration-300 ease-out shadow-xl',
          isMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <nav className="py-2">
          <ul className="flex flex-col items-start" role="none">
            {navigationItems.map((item, index) => (
              <li key={item.href} role="none">
                <div className="px-4 ">
                  <NavbarLink
                    href={item.href}
                    label={item.name}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigation(item.href);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default ContentNavbar;
