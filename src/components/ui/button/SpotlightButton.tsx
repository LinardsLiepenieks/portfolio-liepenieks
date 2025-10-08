import React from 'react';

interface IconProps {
  className?: string;
  size?: string | number;
}

interface SpotlightButtonProps {
  icon: {
    type: 'react-icons';
    component: React.ComponentType<IconProps>;
  };
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl' | 'xxxxxl';
  hideText?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  icon,
  text,
  size = 'lg',
  hideText = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  // Size variants for container with responsive sizing
  const sizeClasses = {
    sm: 'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20',
    md: 'w-16 h-16 md:w-20 md:h-20',
    lg: 'w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48',
    xl: 'w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64',
    xxl: 'w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64',
    xxxl: 'w-52 h-52 md:w-60 md:h-60 lg:w-72 lg:h-72',
    xxxxl: 'w-56 h-56 md:w-60 md:h-60 xl:w-80 xl:h-80',
    xxxxxl: 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96',
  };

  // Responsive icon sizes using text size classes
  const iconSizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-6xl lg:text-7xl',
    xxl: 'text-6xl md:text-7xl lg:text-8xl',
    xxxl: 'text-7xl md:text-8xl lg:text-9xl ',
    xxxxl: 'text-8xl xl:text-9xl',
    xxxxxl: 'text-9xl',
  };

  // Responsive text sizes
  const textSizeClasses = {
    sm: 'text-xs md:text-sm',
    md: 'text-sm md:text-base',
    lg: 'text-base md:text-lg',
    xl: 'text-lg md:text-xl',
    xxl: 'text-xl md:text-2xl',
    xxxl: 'text-2xl md:text-3xl',
    xxxxl: 'text-2xl xl:text-3xl',
    xxxxxl: 'text-4xl md:text-5xl',
  };

  // Determine if text should be shown
  const shouldShowText = !hideText && size !== 'sm';

  const IconComponent = icon.component;

  return (
    <button
      className={`group relative flex flex-col items-center justify-center ${sizeClasses[size]} overflow-hidden rounded-full border-2 border-transparent cursor-pointer flex-shrink-0 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* White circular background that grows from center */}
      <div className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 group-active:scale-100 group-focus:scale-100 transition-transform duration-300 ease-out origin-center z-0"></div>

      {/* Icon with color inversion and responsive sizing */}
      <div
        className={`relative z-10 flex items-center justify-center ${iconSizeClasses[size]} `}
      >
        <IconComponent className="text-neutral-100 group-hover:text-neutral-900 group-active:text-neutral-900 group-focus:text-neutral-900 transition-colors duration-150" />
      </div>

      {/* Text with color inversion and responsive sizing */}
      {shouldShowText && (
        <span
          className={`mt-2 xl:mt-4 relative z-10 text-neutral-100 group-hover:text-neutral-900 group-active:text-neutral-900 group-focus:text-neutral-900 ${textSizeClasses[size]} font-semibold tracking-wide transition-colors duration-150 text-center`}
        >
          {text}
        </span>
      )}
    </button>
  );
};

export default SpotlightButton;
