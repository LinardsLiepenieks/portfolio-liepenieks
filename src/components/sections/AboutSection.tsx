'use client';

import React, { useState, useEffect } from 'react';
import { MdWork, MdSchool, MdLightbulb } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import SpotlightButton from '../ui/button/SpotlightButton';
import AboutTitle from './about_section/AboutTitle';
import { useHorizontalScrollContainer } from '@/hooks/scroll-container/useHorizontalScroll';

const AboutSection = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();

  // Button data for easier management
  const buttons = [
    {
      id: 'experience',
      name: 'Experience',
      icon: MdWork,
    },
    {
      id: 'education',
      name: 'Education',
      icon: MdSchool,
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: MdLightbulb,
    },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Horizontal scroll hook
  const { currentItem, containerRef, itemRefs, scrollToItem } =
    useHorizontalScrollContainer({
      totalItems: buttons.length,
      updateActiveItem: (index: number) => {
        // On mobile, sync the text with scroll view
        if (isMobile) {
          setDisplayText(buttons[index].name);
        }
      },
    });

  // Detect if device is mobile/touch device
  const isMobileDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Handle desktop hover interactions
  const handleInteractionStart = (name: string, id: string): void => {
    if (!isMobile) {
      setHoveredButton(id);
      setDisplayText(name);
    }
  };

  const handleInteractionEnd = (): void => {
    if (!isMobile && hoveredButton) {
      setDisplayText('');
      setHoveredButton(null);
    }
  };

  // Handle mobile touch interactions (only for visual feedback)
  const handleTouchStart = (name: string, id: string): void => {
    if (isMobile) {
      setHoveredButton(id);
    }
  };

  const handleTouchEnd = (): void => {
    if (isMobile) {
      setHoveredButton(null);
    }
  };

  const handleButtonClick = (buttonId: string, index: number): void => {
    // Scroll to the button if not already active
    if (currentItem !== index) {
      scrollToItem(index);
    }

    if (isMobileDevice()) {
      // Add delay on mobile to let animation finish
      setTimeout(() => {
        router.push(`/${buttonId}?returnTo=1`);
      }, 550);
    } else {
      // Navigate immediately on desktop
      router.push(`/${buttonId}?returnTo=1`);
    }
  };

  const handleIndicatorClick = (index: number): void => {
    scrollToItem(index);
  };

  // Initialize with first item on mobile
  useEffect(() => {
    if (isMobile && !displayText && buttons.length > 0) {
      setDisplayText(buttons[currentItem].name);
    }
  }, [isMobile, currentItem, displayText, buttons]);

  return (
    <section className="bg-neutral-900 h-screen">
      <div className="flex flex-col w-full h-full bg-neutral-900 font-metropolis max-w-page mx-auto">
        {/* Title Section - Now with built-in animation */}
        <AboutTitle
          title="About:"
          displayText={displayText}
          removeSpeed={20}
          typeSpeed={30}
          minLineWidth="min-w-40"
        />

        {/* Horizontal Scroll Gallery */}
        <div
          ref={containerRef}
          className="w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden  "
        >
          <div className="flex w-max md:w-full md:justify-center md:gap-4 mt-16  lg:gap-24 md:mt-28 lg:mt-24 xl:gap-32 2xl:gap-40">
            {buttons.map((button, index) => (
              <div
                key={button.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="w-screen md:w-auto flex justify-center items-center snap-center snap-always md:[scroll-snap-align:none]"
              >
                <div
                  onTouchStart={() => handleTouchStart(button.name, button.id)}
                  onTouchEnd={handleTouchEnd}
                  className="touch-none"
                >
                  <SpotlightButton
                    icon={{
                      type: 'react-icons',
                      component: button.icon,
                    }}
                    text={button.name}
                    size="xxxxl"
                    onMouseEnter={() =>
                      handleInteractionStart(button.name, button.id)
                    }
                    onMouseLeave={handleInteractionEnd}
                    onClick={() => handleButtonClick(button.id, index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators - Only show on mobile */}
        <div className="md:hidden flex justify-center items-center gap-2 mt-5 pb-4">
          {buttons.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`h-1 transition-all duration-300 ease-out ${
                currentItem === index
                  ? 'w-8 bg-white'
                  : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to ${buttons[index].name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
