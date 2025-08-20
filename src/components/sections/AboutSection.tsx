'use client';
import React, { useState } from 'react';
import { MdWork, MdSchool, MdLightbulb } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import SpotlightButton from '../ui/button/SpotlightButton';
import { useHorizontalScrollContainer } from '@/hooks/scroll-container/useHorizontalScroll';

const AboutSection = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
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

  // Horizontal scroll hook
  const { currentItem, containerRef, itemRefs, scrollToItem } =
    useHorizontalScrollContainer({
      totalItems: buttons.length,
      updateActiveItem: (index) => {
        // Sync the text animation with scroll
        handleInteractionStart(buttons[index].name, buttons[index].id);
      },
    });

  const clearCurrentInterval = () => {
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(null);
    }
  };

  const animateText = (text: string, isEntering: boolean) => {
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
  const isMobileDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const handleInteractionStart = (name: string, id: string) => {
    setHoveredButton(id);
    animateText(name, true);
  };

  const handleInteractionEnd = (name: string) => {
    if (hoveredButton && displayText) {
      animateText(name, false);
    }
    setHoveredButton(null);
  };

  const handleTouchEnd = (name: string) => {
    if (hoveredButton && displayText) {
      animateText(name, false);
    }
    setHoveredButton(null);
  };

  const handleButtonClick = (buttonId: string, index: number) => {
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

  const handleIndicatorClick = (index: number) => {
    scrollToItem(index);
  };

  return (
    <section className="flex flex-col w-full">
      {/* Title Section */}
      <div className="mt-16 mx-8 lg:mt-32 lg:mx-16">
        <div className="flex items-start gap-1 mt-8 flex-col lg:flex-row lg:gap-4 xl:mb-8 xl:mt-4 xl:mx-12">
          <h2 className="text-pf-lg font-medium font-metropolis text-white lg:text-pf-2xl xl:text-pf-3xl">
            About:
          </h2>
          <div className="h-px bg-white w-64 md:w-70 relative mt-10 lg:-bottom-5 xl:-bottom-11">
            <span className="absolute -bottom-2 left-0 text-white text-pf-xl font-metropolis font-semibold tracking-wide lg:text-pf-xl xl:text-pf-2xl">
              {displayText}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-4"
      >
        <div className="flex w-max md:w-full md:justify-center md:gap-4 mt-16 lg:gap-32">
          {buttons.map((button, index) => (
            <div
              key={button.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="w-screen md:w-auto flex justify-center items-center snap-center snap-always md:[scroll-snap-align:none]"
            >
              <div
                onTouchStart={() =>
                  handleInteractionStart(button.name, button.id)
                }
                onTouchEnd={() => handleTouchEnd(button.name)}
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
      <div className="md:hidden flex justify-center items-center gap-2 mt-8 pb-4">
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
