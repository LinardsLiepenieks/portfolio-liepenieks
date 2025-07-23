'use client';

import React, { useRef, useCallback, MouseEvent, ReactNode } from 'react';

interface HoverFollowCardProps {
  children: ReactNode;
  maxMove?: number;
  returnSpeed?: number;
  moveSpeed?: number;
  sensitivity?: number;
  className?: string;
  as?: React.ElementType;
  display?: 'inline' | 'inline-block' | 'block';
}

const HoverFollowCard: React.FC<HoverFollowCardProps> = ({
  children,
  maxMove = 4,
  returnSpeed = 0.8,
  moveSpeed = 0.5,
  sensitivity = 0.04,
  className = '',
  as: Component = 'div',
  display = 'inline-block',
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const isHovering = useRef(false);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    if (cardRef.current) {
      cardRef.current.style.transition = `transform ${moveSpeed}s ease-out`;
    }
  }, [moveSpeed]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!cardRef.current || !isHovering.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // Calculate cursor position relative to card center
      const deltaX = e.clientX - cardCenterX;
      const deltaY = e.clientY - cardCenterY;

      // Calculate movement towards the cursor
      const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX * sensitivity));
      const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY * sensitivity));

      // Apply transform with transition for smooth following
      card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    },
    [maxMove, sensitivity]
  );

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    if (!cardRef.current) return;

    const card = cardRef.current;
    card.style.transition = `transform ${returnSpeed}s ease-out`;
    card.style.transform = 'translate(0px, 0px)';
  }, [returnSpeed]);

  return (
    <Component
      ref={cardRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display,
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {children}
    </Component>
  );
};

export default HoverFollowCard;
