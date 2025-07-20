'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  routes?: string[];
  onNavigate?: (sectionIndex: number) => void; // Add callback for scroll navigation
}

interface NavItem {
  path: string;
  label: string;
}

const Navbar: React.FC<NavbarProps> = ({ routes = [], onNavigate }) => {
  const pathname = usePathname();

  // Default navigation items if routes not provided
  const defaultNavItems: NavItem[] = [
    { path: '/', label: 'Start' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  // Convert routes array to navigation items or use defaults
  const navItems: NavItem[] =
    routes.length > 0
      ? routes.map((route, index) => {
          const labels = ['Start', 'About', 'Contact'];
          return {
            path: route,
            label: labels[index] || `Page ${index + 1}`,
          };
        })
      : defaultNavItems;

  const handleNavigation = (
    path: string,
    index: number,
    event: React.MouseEvent
  ): void => {
    // Prevent default link behavior for smooth scroll navigation
    event.preventDefault();

    // If onNavigate callback is provided, use scroll navigation
    if (onNavigate) {
      onNavigate(index);
    } else {
      // Fallback to regular navigation if no callback provided
      window.location.href = path;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-red-800 shadow-sm">
      <div className="flex justify-end items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item, index) => (
            <a
              key={item.path}
              href={item.path} // SEO-friendly href attribute
              onClick={(e) => handleNavigation(item.path, index, e)}
              className={`
                relative px-4 py-2 text-white font-medium text-lg
                transition-all duration-200 ease-in-out
                hover:text-red-100 cursor-pointer
                ${
                  pathname === item.path
                    ? 'border-b-2 border-white'
                    : 'border-b-2 border-transparent hover:border-red-200'
                }
              `}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
