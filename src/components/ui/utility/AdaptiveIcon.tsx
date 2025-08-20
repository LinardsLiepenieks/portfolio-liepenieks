import React from 'react';

interface IconProps {
  className?: string;
  size?: string | number;
}

interface AdaptiveIconProps {
  type: 'react-icons';
  component: React.ComponentType<IconProps>;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  className?: string;
}

const AdaptiveIcon: React.FC<AdaptiveIconProps> = ({
  component: IconComponent,
  size,
  className = '',
}) => {
  // Size mapping for different icon libraries
  const sizeMap = {
    xs: 18,
    sm: 24, // 18 × 1.333 ≈ 24
    md: 32, // 24 × 1.333 ≈ 32
    lg: 43, // 32 × 1.333 ≈ 43
    xl: 57, // 43 × 1.333 ≈ 57
    xxl: 76, // 57 × 1.333 ≈ 76
    xxxl: 101, // 76 × 1.333 ≈ 101
  };

  const iconSize = sizeMap[size];

  // Base icon props
  const baseProps = {
    className,
  };

  // React Icons use 'size' prop
  return <IconComponent size={iconSize} {...baseProps} />;
};

export default AdaptiveIcon;
