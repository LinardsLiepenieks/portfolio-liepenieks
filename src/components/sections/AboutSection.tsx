'use client';
import React, { useState } from 'react';
import { Briefcase, GraduationCap, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AboutSection = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const router = useRouter();

  const buttons = [
    { icon: Briefcase, name: 'Experience', id: 'experience' },
    { icon: GraduationCap, name: 'Education', id: 'education' },
    { icon: Lightbulb, name: 'Projects', id: 'projects' },
  ];

  const clearCurrentInterval = () => {
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(null);
    }
  };

  const animateText = (text: string, isEntering: boolean) => {
    // Clear any existing interval first
    clearCurrentInterval();

    if (isEntering) {
      // Clear display text immediately and start typing
      setDisplayText('');
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        if (currentIndex >= text.length) {
          clearInterval(typeInterval);
          setCurrentInterval(null);
        }
      }, 30);
      setCurrentInterval(typeInterval);
    } else {
      // Remove letter by letter
      let currentIndex = text.length;
      const removeInterval = setInterval(() => {
        setDisplayText(text.slice(0, currentIndex - 1));
        currentIndex--;
        if (currentIndex <= 0) {
          clearInterval(removeInterval);
          setCurrentInterval(null);
          setDisplayText('');
        }
      }, 20);
      setCurrentInterval(removeInterval);
    }
  };

  const handleMouseEnter = (button: {
    icon: any;
    name: string;
    id: string;
  }) => {
    setHoveredButton(button.id);
    animateText(button.name, true);
  };

  const handleMouseLeave = () => {
    if (hoveredButton && displayText) {
      const currentButton = buttons.find((b) => b.id === hoveredButton);
      if (currentButton) {
        animateText(currentButton.name, false);
      }
    }
    setHoveredButton(null);
  };
  const handleButtonClick = (buttonId: string) => {
    router.push(`/${buttonId}?returnTo=1`);
  };

  return (
    <section className="relative h-screen bg-neutral-800 overflow-hidden font-metropolis justify-center flex">
      <div className="h-full flex flex-col px-8 md:px-20 w-full">
        {/* Title Section - Fixed position from top */}
        <div className="mt-40 mb-32   -top-4 left-0">
          <div className="flex items-end gap-2">
            <h2 className="text-pf-xl font-extralight font-metropolis text-white tracking-wide">
              About:
            </h2>
            <div className="h-px bg-white w-32 md:w-70 relative -top-1">
              {/* Animated text above the line */}
              <span className="absolute -top-12 left-0 text-white text-pf-2xl font-bold tracking-wide">
                {displayText}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Section - Always centered vertically */}
        <div className="flex items-center pt-4 relative justify-center w-full">
          <div className="flex gap-12 md:gap-32 ">
            {buttons.map((button) => {
              const IconComponent = button.icon;
              return (
                <button
                  key={button.id}
                  className="group relative flex flex-col items-center justify-center w-48 h-48 overflow-hidden rounded-full border-2 border-transparent cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(button)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleButtonClick(button.id)}
                >
                  {/* White circular background that grows from center */}
                  <div className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center z-0"></div>

                  {/* Icon with color inversion on hover */}
                  <div className="relative z-10 mb-2">
                    <IconComponent
                      size={116}
                      className="text-white group-hover:text-black transition-colors duration-150"
                    />
                  </div>

                  {/* Name with color inversion - always visible */}
                  <span className="relative z-10 text-white group-hover:text-black text-pg-base font-semibold transition-colors duration-150">
                    {button.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
