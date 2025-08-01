'use client';

import { useRef, useEffect, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ExperienceItem from '@/components/experience/ExperienceItem';

interface ExperienceItemType {
  id: number;
  // Add other properties as needed
}

interface ExperienceGalleryProps {
  experienceItems: ExperienceItemType[];
}

export default function ExperienceGallery({
  experienceItems,
}: ExperienceGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrollingProgrammatically = useRef(false);

  const scrollToItem = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    if (index < 0 || index >= experienceItems.length) return;

    // Set flag to prevent intersection observer from interfering
    isScrollingProgrammatically.current = true;

    const targetItem = container.querySelector(
      `[data-index="${index}"]`
    ) as HTMLElement;
    if (targetItem) {
      targetItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setCurrentIndex(index);

      // Reset flag after scroll animation completes
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 800); // Slightly longer than scroll animation
    }
  };

  const scrollToNextItem = (clickedIndex: number) => {
    scrollToItem(clickedIndex + 1);
  };

  const scrollToPrevItem = () => {
    scrollToItem(currentIndex - 1);
  };

  const scrollToNextItemNav = () => {
    scrollToItem(currentIndex + 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observer for experience items (50% threshold for better tracking)
    const itemObserverOptions = {
      root: container,
      threshold: [0.1, 0.5, 0.9], // Multiple thresholds for better detection
    };

    // Observer for right lines (10% threshold)
    const lineObserverOptions = {
      root: container,
      threshold: 0.1,
    };

    // Track intersection ratios for each item
    const intersectionRatios = new Map<number, number>();

    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const itemIndex = parseInt(
          entry.target.getAttribute('data-index') || '0'
        );

        // Update intersection ratio
        intersectionRatios.set(itemIndex, entry.intersectionRatio);

        if (entry.isIntersecting) {
          setVisibleItems((prev) => new Set(prev).add(itemIndex));
        } else {
          setVisibleItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemIndex);
            return newSet;
          });
        }
      });

      // Find the item with the highest intersection ratio
      let maxRatio = 0;
      let bestIndex = 0;

      intersectionRatios.forEach((ratio, index) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestIndex = index;
        }
      });

      // Update current index if we have a clear winner with decent visibility
      // Only update if we're not currently scrolling programmatically
      if (maxRatio > 0.3 && !isScrollingProgrammatically.current) {
        setCurrentIndex(bestIndex);
      }
    }, itemObserverOptions);

    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const lineIndex = parseInt(
          entry.target.getAttribute('data-line-index') || '0'
        );

        if (entry.isIntersecting) {
          setVisibleLines((prev) => new Set(prev).add(lineIndex));
        }
      });
    }, lineObserverOptions);

    // Observe all experience items
    const items = container.querySelectorAll('[data-index]');
    items.forEach((item) => itemObserver.observe(item));

    // Observe all right lines
    const lines = container.querySelectorAll('[data-line-index]');
    lines.forEach((line) => lineObserver.observe(line));

    return () => {
      itemObserver.disconnect();
      lineObserver.disconnect();
    };
  }, [experienceItems]);

  return (
    <div className="flex-1 relative flex flex-col">
      <div
        ref={containerRef}
        className="h-full overflow-x-auto overflow-y-hidden w-full flex items-center max-h-full snap-x snap-proximity"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {experienceItems.map((item, index) => {
          const isVisible = visibleItems.has(index);
          const isLineVisible = visibleLines.has(index);

          return (
            <div
              key={item.id}
              data-index={index}
              className="flex-shrink-0 items-center justify-center flex w-full h-full snap-center"
            >
              {/* Left line - invisible if first item */}
              <div
                className={`flex flex-1 h-px ${
                  index === 0 ? 'bg-transparent' : 'bg-white'
                }`}
              ></div>
              <div className="bg-neutral-800 h-full">
                <div
                  className={`h-full transition-all duration-700 ease-out transform bg-neutral-850 border border-gray-600 p-4 border-dotted   ${
                    isVisible
                      ? 'translate-y-0 opacity-100 translate-x-0'
                      : '-translate-y-5 opacity-0 translate-x-10'
                  }`}
                >
                  <ExperienceItem />
                </div>
              </div>

              {/* Right line with year indicator - invisible if last item */}
              <div
                data-line-index={index}
                className={`flex flex-1 h-px relative  ${
                  index === experienceItems.length - 1
                    ? 'opacity-0'
                    : 'opacity-100'
                } `}
              >
                {/* Animated line that grows from 0 to full width */}
                <div
                  className={`h-full transition-all duration-1000 ease-out delay-100 ${
                    index === experienceItems.length - 1
                      ? 'w-full'
                      : `bg-white ${isLineVisible ? 'w-full' : 'w-0'}`
                  }`}
                />

                {/* Year indicator positioned at the end of the line */}
                <div
                  className={`absolute right-0 top-0 transform -translate-y-1/2 transition-all duration-500 ease-out`}
                >
                  <span
                    className="text-neutral-300 text-pf-lg font-metropolis bg-neutral-900 px-2 hover:underline hover:cursor-pointer"
                    onClick={() => scrollToNextItem(index)}
                  >
                    {2024 - index}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center py-6 gap-4">
        {/* Previous button */}
        <button
          onClick={scrollToPrevItem}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full transition-all duration-200  ${
            currentIndex === 0
              ? 'text-neutral-600 cursor-not-allowed'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer'
          }`}
        >
          <IoChevronBack size={20} />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {experienceItems.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToItem(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-neutral-600 hover:bg-neutral-400 hover:cursor-pointer'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={scrollToNextItemNav}
          disabled={currentIndex === experienceItems.length - 1}
          className={`p-2 rounded-full transition-all duration-200  ${
            currentIndex === experienceItems.length - 1
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
