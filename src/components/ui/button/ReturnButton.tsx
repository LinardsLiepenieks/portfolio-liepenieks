import React from 'react';
import AdaptiveIcon from '../utility/AdaptiveIcon';

interface ReturnButtonProps {
  icon: {
    type: 'react-icons';
    component: React.ComponentType<any>;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({
  icon,
  size = 'md',
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  // Size variants for container
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    xxl: 'w-24 h-24',
    xxxl: 'w-28 h-28',
  };

  // Icon size mapping - direct 1:1 match with AdaptiveIcon sizes
  const iconSizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    xxl: 'xxl',
    xxxl: 'xxxl',
  } as const;

  return (
    <button
      className={`group relative flex items-center justify-center ${sizeClasses[size]} overflow-hidden rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 hover:cursor-pointer flex-shrink-0 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center">
        <AdaptiveIcon
          type={icon.type}
          component={icon.component}
          size={iconSizeMap[size]}
          className="text-white transition-colors duration-150"
        />
      </div>
    </button>
  );
};

export default ReturnButton;
