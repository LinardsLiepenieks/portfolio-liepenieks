'use client';

import { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ExperienceItem from '@/components/experience/ExperienceItem';
import { useHorizontalScrollContainer } from '@/hooks/scroll-container/useHorizontalScroll';
import { ExperienceComponentProps } from '@/types/ExperienceItemType';

interface ExperienceGalleryProps {
  experienceItems: ExperienceComponentProps[];
  onSelectExperience: (title: string) => void; // accepts a string
}

export default function ExperienceGallery({
  experienceItems,
  onSelectExperience,
}: ExperienceGalleryProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);

  // Horizontal scroll hook
  const { currentItem, containerRef, itemRefs, scrollToItem } =
    useHorizontalScrollContainer({
      totalItems: experienceItems.length,
      updateActiveItem: (index: number) => {
        setVisibleIndex(index);
        onSelectExperience(experienceItems[index].title); // 🔥 Trigger animation
      },
    });

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrev = () => scrollToItem(currentItem - 1);
  const handleNext = () => scrollToItem(currentItem + 1);

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden ">
      {/* Scrollable row */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto  overflow-y-hidden scrollbar-hidden"
      >
        {experienceItems.map((experience, index) => {
          const isVisible = index === visibleIndex;

          return (
            <div
              key={experience.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="flex-shrink-0 w-[100vw] flex items-center justify-center"
            >
              <div
                className={`w-full h-full transition-all duration-700 ease-out transform justify-center flex ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-5'
                }`}
              >
                <ExperienceItem
                  id={experience.id}
                  key={experience.id}
                  title={experience.title}
                  position={experience.position}
                  period={experience.period}
                  description={experience.description}
                  logoUrl={experience.logoUrl}
                  recommendationUrl={experience.recommendationUrl}
                  linkTitle={experience.linkTitle}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={currentItem === 0}
          className={`p-2 rounded-full  ${
            currentItem === 0
              ? 'text-neutral-600 cursor-not-allowed'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer '
          }`}
        >
          <IoChevronBack size={20} />
        </button>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2">
          {experienceItems.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToItem(index)}
              className={`h-1 transition-all duration-300 ease-out rounded-full ${
                currentItem === index
                  ? 'w-8 bg-white'
                  : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to experience ${index + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentItem === experienceItems.length - 1}
          className={`p-2 rounded-full ${
            currentItem === experienceItems.length - 1
              ? 'text-neutral-600 cursor-not-allowed'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer'
          }`}
        >
          <IoChevronForward size={20} />
        </button>
      </div>
    </div>
  );
}
