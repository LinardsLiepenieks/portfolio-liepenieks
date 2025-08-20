import React from 'react';
import AdaptiveIcon from '../utility/AdaptiveIcon';

interface SpotlightButtonProps {
  icon: {
    type: 'react-icons';
    component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
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
  // Size variants for container
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
    xxl: 'w-64 h-64',
    xxxl: 'w-64 h-64',
  };

  // Icon size mapping - direct 1:1 match with AdaptiveIcon sizes
  const iconSizeMap = {
    sm: 'sm', // 24px icons for sm button
    md: 'md', // 32px icons for md button
    lg: 'lg', // 48px icons for lg button
    xl: 'xl', // 64px icons for xl button
    xxl: 'xxl', // 64px icons for xl button
    xxxl: 'xxxl', // 64px icons for xl button
  } as const;

  // Determine if text should be shown
  const shouldShowText = !hideText && size !== 'sm';

  return (
    <button
      className={`group relative flex flex-col items-center justify-center ${sizeClasses[size]} overflow-hidden rounded-full border-2 border-transparent cursor-pointer flex-shrink-0 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* White circular background that grows from center */}
      <div className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center z-0"></div>

      {/* Icon with color inversion on hover - centered */}
      <div className="relative z-10 flex items-center justify-center">
        <AdaptiveIcon
          type={icon.type}
          component={icon.component}
          size={iconSizeMap[size]}
          className="text-white group-hover:text-black transition-colors duration-150"
        />
      </div>

      {/* Text with color inversion - controlled by hideText parameter and size */}
      {shouldShowText && (
        <span className="relative z-10 text-white group-hover:text-black text-pf-base font-semibold transition-colors duration-150 mt-2 text-center">
          {text}
        </span>
      )}
    </button>
  );
};

export default SpotlightButton;
