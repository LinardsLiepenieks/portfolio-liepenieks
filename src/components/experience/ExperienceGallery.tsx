'use client';

import { useState, useEffect, useRef } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ExperienceItem from '@/components/experience/ExperienceItem';
import { useHorizontalScrollContainer } from '@/hooks/scroll-container/useHorizontalScroll';
import { ExperienceComponentProps } from '@/types/ExperienceItemType';

interface ExperienceGalleryProps {
  experienceItems: (ExperienceComponentProps & { startYear: number })[];
  onSelectExperience: (title: string) => void;
}

export default function ExperienceGallery({
  experienceItems,
  onSelectExperience,
}: ExperienceGalleryProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [animatedLines, setAnimatedLines] = useState<Set<number>>(new Set());
  const previousIndexRef = useRef(0);
  const lastSelectedTitleRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  // Horizontal scroll hook
  const { currentItem, containerRef, itemRefs, scrollToItem } =
    useHorizontalScrollContainer({
      totalItems: experienceItems.length,
      updateActiveItem: (index: number) => {
        // Validate index
        if (index < 0 || index >= experienceItems.length) {
          return;
        }

        const previousIndex = previousIndexRef.current;
        const isScrollingRight = index > previousIndex;
        const currentTitle = experienceItems[index].title;

        setVisibleIndex(index);

        // Only update if initialized and title actually changed
        if (
          isInitializedRef.current &&
          currentTitle !== lastSelectedTitleRef.current
        ) {
          onSelectExperience(currentTitle);
          lastSelectedTitleRef.current = currentTitle;
        } else if (!isInitializedRef.current) {
          onSelectExperience(currentTitle);
          lastSelectedTitleRef.current = currentTitle;
          isInitializedRef.current = true;
        }

        // Animate line of the CURRENT item when it's scrolled into view from the right
        if (isScrollingRight && index < experienceItems.length - 1) {
          setAnimatedLines((prev) => new Set([...prev, index]));
        }

        previousIndexRef.current = index;
      },
    });

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate first item's line on page load
  useEffect(() => {
    if (experienceItems.length > 1) {
      setAnimatedLines((prev) => new Set([...prev, 0]));
    }
  }, [experienceItems.length]);

  // Initialize with first experience on mount (only once)
  useEffect(() => {
    if (experienceItems.length > 0 && !isInitializedRef.current) {
      const firstTitle = experienceItems[0].title;
      onSelectExperience(firstTitle);
      lastSelectedTitleRef.current = firstTitle;
      isInitializedRef.current = true;
    }
  }, [experienceItems, onSelectExperience]);

  const handlePrev = () => scrollToItem(currentItem - 1);
  const handleNext = () => scrollToItem(currentItem + 1);

  const isFirstItem = (index: number) => index === 0;
  const isLastItem = (index: number) => index === experienceItems.length - 1;

  // Get the start year from the next experience item
  const getNextExperienceYear = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    return nextIndex < experienceItems.length
      ? experienceItems[nextIndex].startYear
      : null;
  };

  // Handle year click to scroll to next item
  const handleYearClick = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < experienceItems.length) {
      scrollToItem(nextIndex);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden pb-8">
      {/* Scrollable row */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto overflow-y-hidden scrollbar-hidden h-full"
      >
        {experienceItems.map((experience, index) => {
          const isVisible = index === visibleIndex;
          const shouldAnimateLine = animatedLines.has(index);
          const nextExperienceYear = getNextExperienceYear(index);

          return (
            <div
              key={experience.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="flex-shrink-0 w-[100vw] flex items-center justify-center h-full"
            >
              <div className="w-full justify-center flex h-full">
                {/* Left line - hidden for first item */}
                <div
                  className={`flex flex-1 items-center ${
                    isFirstItem(index) ? 'invisible' : ''
                  }`}
                >
                  <span className="h-px border-neutral-500 w-full border-dashed border anti-blur"></span>
                </div>

                <div
                  className={`anti-blur h-full transition-all duration-700 ease-out justify-center flex items-center ${
                    isVisible ? 'opacity-100 ' : 'opacity-0 '
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

                {/* Right line - hidden for last item, animated only when scrolling right */}
                <div
                  className={`flex flex-1 items-center ${
                    isLastItem(index) ? 'invisible' : ''
                  }`}
                >
                  <div className="w-full flex items-center gap-1">
                    <span
                      className={`anti-blur h-px border-neutral-500 border-dashed border transition-all duration-[800ms] delay-300 ease-out block ${
                        shouldAnimateLine ? 'w-full' : 'w-0'
                      }`}
                    ></span>
                    {nextExperienceYear && (
                      <button
                        onClick={() => handleYearClick(index)}
                        className="group anti-blur text-pf-base font-metropolis text-neutral-300 font-medium hover:text-white hover:cursor-pointer transition-colors duration-200 relative mx-4"
                      >
                        {nextExperienceYear}
                        <span className="absolute bottom-1 left-0 h-0.5 bg-neutral-300 transition-all duration-300 ease-out w-0 group-hover:w-full"></span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          disabled={currentItem === 0}
          className={`anti-blur p-2 rounded-full transition-all duration-200 ease-out hover:scale-105 ${
            currentItem === 0
              ? 'text-neutral-600 cursor-not-allowed hover:scale-100'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer'
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
              className={`anti-blur h-1 rounded-full transition-all duration-300 ease-out ${
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
          className={`anti-blur p-2 rounded-full transition-all duration-200 ease-out hover:scale-105 ${
            currentItem === experienceItems.length - 1
              ? 'text-neutral-600 cursor-not-allowed hover:scale-100'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer'
          }`}
        >
          <IoChevronForward size={20} />
        </button>
      </div>
    </div>
  );
}
