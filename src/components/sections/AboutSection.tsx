'use client';
import React, { useState } from 'react';
import { MdWork, MdSchool, MdLightbulb } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import SpotlightButton from '../ui/button/SpotlightButton';

const AboutSection = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const router = useRouter();

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

  const handleMouseEnter = (name: string, id: string) => {
    setHoveredButton(id);
    animateText(name, true);
  };

  const handleMouseLeave = (name: string) => {
    if (hoveredButton && displayText) {
      animateText(name, false);
    }
    setHoveredButton(null);
  };

  const handleButtonClick = (buttonId: string) => {
    router.push(`/${buttonId}?returnTo=1`);
  };

  return (
    <section className="relative h-screen bg-neutral-900 overflow-hidden font-metropolis justify-center flex">
      <div className="h-full flex flex-col px-8 md:px-20 w-full">
        {/* Title Section - Fixed position from top */}
        <div className="mt-40 mb-32 -top-4 left-0">
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
          <div className="flex gap-12 md:gap-32">
            <SpotlightButton
              icon={{
                type: 'react-icons',
                component: MdWork,
              }}
              text="Experience"
              size="xxxl"
              onMouseEnter={() => handleMouseEnter('Experience', 'experience')}
              onMouseLeave={() => handleMouseLeave('Experience')}
              onClick={() => handleButtonClick('experience')}
            />

            <SpotlightButton
              icon={{
                type: 'react-icons',
                component: MdSchool,
              }}
              text="Education"
              size="xxxl"
              onMouseEnter={() => handleMouseEnter('Education', 'education')}
              onMouseLeave={() => handleMouseLeave('Education')}
              onClick={() => handleButtonClick('education')}
            />

            <SpotlightButton
              icon={{
                type: 'react-icons',
                component: MdLightbulb,
              }}
              text="Projects"
              size="xxxl"
              onMouseEnter={() => handleMouseEnter('Projects', 'projects')}
              onMouseLeave={() => handleMouseLeave('Projects')}
              onClick={() => handleButtonClick('projects')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
