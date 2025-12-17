// components/project/ProjectTechnology.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// Technology interface
export interface Technology {
  id: string | number;
  technology_name: string;
  technology_url?: string | null;
  technology_image?: string | null;
}

interface ProjectTechnologyProps {
  technology: Technology;
}

const ProjectTechnology = ({ technology }: ProjectTechnologyProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    // Reset timer on mouse movement
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (showTooltip) {
      setIsVisible(false);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  };

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setShowTooltip(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    // Don't immediately hide, allow for transition
    setTimeout(() => {
      setIsVisible(false);
    }, 50); // Small delay to ensure state change happens after render

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {technology.technology_url ? (
        <Image
          src={technology.technology_url}
          alt={technology.technology_name}
          width={80}
          height={80}
          className="w-8 h-8 sm:h-16 sm:w-16 2xl:w-20 2xl:h-20 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-20 h-20 bg-neutral-800 flex items-center justify-center rounded-md">
          <span className="text-2xl font-semibold text-neutral-400">
            {technology.technology_name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      {/* Tooltip with opacity transition */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`fixed bg-neutral-800 text-neutral-200 text-xs px-2 py-1 
                     rounded whitespace-nowrap z-50 pointer-events-none
                     transition-opacity duration-300 ease-in-out
                     ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${mousePos.x + 10}px`,
            top: `${mousePos.y + 10}px`,
          }}
        >
          {technology.technology_name}
        </div>
      )}
    </div>
  );
};

export default ProjectTechnology;
