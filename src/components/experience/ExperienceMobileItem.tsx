'use client';

import React, { useState } from 'react';

interface ExperienceMobileItemProps {
  /** Company or project name */
  title: string;
  /** Job title or role */
  position: string;
  /** Time period (e.g., "2023-2024", "Jan 2023 - Present") */
  period: string;
  /** Detailed description of the role/experience */
  description: string;
  /** Avatar letter or image URL */
  avatar?: string;
  /** Avatar background color classes */
  avatarBg?: string;
  /** Custom className for the container */
  className?: string;
  /** Click handler for additional actions */
  onClick?: () => void;
  /** Called when item is expanded/selected */
  onSelect?: () => void;
  /** Called when item is collapsed/deselected */
  onDeselect?: () => void;
}

const ExperienceMobileItem = ({
  title,
  position,
  period,
  description,
  avatar,
  avatarBg = 'bg-gradient-to-br from-red-500 to-orange-500',
  className = '',
  onClick,
  onSelect,
  onDeselect,
}: ExperienceMobileItemProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggle = (): void => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    // Call the appropriate callback based on the new state
    if (newExpandedState) {
      onSelect?.();
    } else {
      onDeselect?.();
    }

    // Call the general onClick handler
    onClick?.();
  };

  // Get first letter of title for avatar if no avatar provided
  const avatarContent = avatar?.startsWith('http') ? (
    <img
      src={avatar}
      alt={`${title} logo`}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-white font-bold text-base">
      {avatar || title.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <div
      className={`
        border-none 
        font-metropolis
        flex-shrink-0
        flex 
        flex-col 
        items-center 
        gap-2 
        text-neutral-100 
        cursor-pointer 
        select-none 
        relative 
        overflow-hidden
        w-full 
        transition-all 
        duration-[300ms] 
        ${isExpanded ? 'pb-5' : ''}
        ${className}
      `}
      onClick={handleToggle}
    >
      {/* Title */}
      <div className="text-pf-lg font-medium text-neutral-100  w-full -mb-2">
        {title}
      </div>

      {/* Main Content Row */}
      <div className="flex items-center gap-3 w-full w-full justify-start">
        {/* Avatar */}
        <div
          className={`
          w-16 h-16  
          ${avatarBg}
          flex-shrink-0 
          flex 
          items-center 
          justify-center
        `}
        >
          {avatarContent}
        </div>

        {/* Info */}
        <div className="">
          <div className="text-pf-sm font-medium">{position}</div>
          <div className="text-xs  text-neutral-300 font-medium">{period}</div>
        </div>

        {/* Chevron */}
        <div className="ml-auto pr-4">
          <div
            className={`
          text-lg 
          text-gray-400 
          ml-auto 
          items-center
          justify-center
          transition-transform 
          duration-[300ms] 
          ${isExpanded ? 'rotate-90' : ''}
        `}
          >
            ❯
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        className={`
        w-full
        border-t 
        border-gray-500 
        text-pf-sm 
        leading-relaxed
        overflow-hidden
        transition-all 
        duration-[600ms] 
        ease-[cubic-bezier(0.4,0,0.1,0.8)]
        ${
          isExpanded
            ? 'opacity-100 max-h-[200px] mt-3 pt-3 mb-0 translate-y-0'
            : 'opacity-0 max-h-0 mt-0 pt-0 mb-0 -translate-y-2.5'
        }
      `}
      >
        {description}
      </div>
    </div>
  );
};

export default ExperienceMobileItem;
