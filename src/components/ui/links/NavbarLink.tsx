'use client';
import { usePathname } from 'next/navigation';

interface NavbarLinkProps {
  href: string;
  label: string;
  onClick?: (event: React.MouseEvent) => void;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ href, label, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        relative px-4 py-1 text-white font-metropolis font-medium text-pf-sm tracking-wider
        transition-all duration-200 ease-in-out
        hover:text-white/90 cursor-pointer group
      `}
    >
      {label}
      {/* Single underline that changes behavior based on active state */}
      <span
        className={`
          absolute bottom-0 h-px bg-white transition-all duration-300 ease-out
          ${
            isActive
              ? 'left-2 right-2 w-[calc(100%-1rem)]' // Active state - full width, no animation
              : 'left-1/2 w-0 group-hover:w-[calc(100%-1rem)] group-hover:left-2' // Hover state - animated from center
          }
        `}
      ></span>
    </a>
  );
};

export default NavbarLink;
