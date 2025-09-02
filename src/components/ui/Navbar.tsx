'use client';
import NavbarLink from './links/NavbarLink';

interface NavbarProps {
  routes?: string[];
  onNavigate?: (sectionIndex: number) => void; // Add callback for scroll navigation
}

interface NavItem {
  path: string;
  label: string;
}

const Navbar: React.FC<NavbarProps> = ({ routes = [], onNavigate }) => {
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
    <nav className="fixed top-0  left-0 right-0 z-50 bg-neutral-900/50 backdrop-blur-sm shadow-sm">
      <div className="flex sm:justify-end items-center px-9 py-6 justify-center pt-7">
        <div className="flex space-x-6">
          {navItems.map((item, index) => (
            <NavbarLink
              key={item.path}
              href={item.path}
              label={item.label}
              onClick={(e) => handleNavigation(item.path, index, e)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
