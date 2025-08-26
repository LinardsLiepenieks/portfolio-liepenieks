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
        relative px-4  lg:px-3 lg:py-1.5 lg:mb-1.5 text-white font-metropolis font-semibold text-pf-sm lg:text-pf-sm
        transition-all duration-200 ease-in-out
        hover:text-white/90 cursor-pointer group
      `}
    >
      <div className="relative px-1 lg:px-0.5">
        {label}
        {/* Single underline that changes behavior based on active state */}
        <span
          className={`
          absolute bottom-0 h-px bg-white transition-all duration-300 ease-out 
          ${
            isActive
              ? 'left-0  w-full ' // Active state - full width
              : 'left-1/2 w-0 group-hover:w-full group-hover:left-0' // Hover state - animated from center
          }
        `}
        ></span>
      </div>
    </a>
  );
};

export default NavbarLink;
