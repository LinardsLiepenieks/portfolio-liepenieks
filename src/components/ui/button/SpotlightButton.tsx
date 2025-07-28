import React from 'react';

interface SpotlightButtonProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  icon: IconComponent,
  text,
  size = 'lg',
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  // Size variants
  const sizeClasses = {
    sm: {
      container: 'w-24 h-24',
      iconSize: 48,
    },
    md: {
      container: 'w-32 h-32',
      iconSize: 64,
    },
    lg: {
      container: 'w-48 h-48',
      iconSize: 116,
    },
  };

  const currentSize = sizeClasses[size];
  return (
    <button
      className={`group relative flex flex-col items-center ${
        size === 'sm' ? 'justify-center' : 'justify-center'
      } ${
        currentSize.container
      } overflow-hidden rounded-full border-2 border-transparent cursor-pointer ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* White circular background that grows from center */}
      <div className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center z-0"></div>

      {/* Icon with color inversion on hover - perfectly centered for sm */}
      <div className="relative z-10">
        <IconComponent
          size={currentSize.iconSize}
          className="text-white group-hover:text-black transition-colors duration-150"
        />
      </div>

      {/* Text with color inversion - only shown for md and lg */}
      {size !== 'sm' && (
        <span className="relative z-10 text-white group-hover:text-black text-pg-base font-semibold transition-colors duration-150 mt-2">
          {text}
        </span>
      )}
    </button>
  );
};

export default SpotlightButton;
