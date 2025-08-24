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
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
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
        // On mobile, sync the text animation with scroll view
        if (isMobile) {
          handleViewChange(buttons[index].name);
        }
      },
    });

  const clearCurrentInterval = (): void => {
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(null);
    }
  };

  const animateText = (text: string, isEntering: boolean): void => {
    clearCurrentInterval();

    if (isEntering) {
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

  // Detect if device is mobile/touch device
  const isMobileDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Handle view change (for mobile scroll-based text updates)
  const handleViewChange = (name: string): void => {
    if (displayText !== name) {
      if (displayText) {
        // Clear current text first, then show new text
        animateText(displayText, false);
        setTimeout(() => {
          animateText(name, true);
        }, displayText.length * 20 + 50); // Wait for clear animation to finish
      } else {
        animateText(name, true);
      }
    }
  };

  // Handle desktop hover interactions
  const handleInteractionStart = (name: string, id: string): void => {
    if (!isMobile) {
      setHoveredButton(id);
      animateText(name, true);
    }
  };

  const handleInteractionEnd = (name: string): void => {
    if (!isMobile && hoveredButton && displayText) {
      animateText(name, false);
      setHoveredButton(null);
    }
  };

  // Handle mobile touch interactions (only for navigation, not text animation)
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
      animateText(buttons[currentItem].name, true);
    }
  }, [isMobile, currentItem]);

  return (
    <section className="flex flex-col w-full h-full bg-neutral-900 font-metropolis">
      {/* Title Section - Now using the extracted component */}
      <AboutTitle title="About:" displayText={displayText} />

      {/* Horizontal Scroll Gallery */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max md:w-full md:justify-center md:gap-4 mt-12 lg:gap-32">
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
                  size="xxxl"
                  onMouseEnter={() =>
                    handleInteractionStart(button.name, button.id)
                  }
                  onMouseLeave={() => handleInteractionEnd(button.name)}
                  onClick={() => handleButtonClick(button.id, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicators - Only show on mobile */}
      <div className="md:hidden flex justify-center items-center gap-2 mt-4 pb-4">
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
    </section>
  );
};

export default AboutSection;
