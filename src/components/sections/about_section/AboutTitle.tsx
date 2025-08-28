import React, { useState, useEffect, useRef } from 'react';

interface AboutTitleProps {
  /** Main title text */
  title: string;
  /** Dynamic text that appears below the line */
  displayText?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Custom styling for the title */
  titleClassName?: string;
  /** Custom styling for the display text */
  displayTextClassName?: string;
  /** Custom styling for the line */
  lineClassName?: string;
  /** Width of the line */
  lineWidth?: string;
  /** Speed of character removal (ms) */
  removeSpeed?: number;
  /** Speed of character typing (ms) */
  typeSpeed?: number;
}

const AboutTitle = ({
  title,
  displayText = '',
  className = '',
  titleClassName = '',
  displayTextClassName = '',
  lineClassName = '',
  lineWidth = 'w-64 md:w-80',
  removeSpeed = 20,
  typeSpeed = 30,
}: AboutTitleProps) => {
  const [animatedText, setAnimatedText] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const currentInterval = useRef<NodeJS.Timeout | null>(null);
  const previousDisplayText = useRef<string>('');

  // Clear any running interval
  const clearCurrentInterval = (): void => {
    if (currentInterval.current) {
      clearInterval(currentInterval.current);
      currentInterval.current = null;
    }
  };

  // Animation function
  const animateText = (oldText: string, newText: string): void => {
    if (oldText === newText) return;

    setIsAnimating(true);
    clearCurrentInterval();

    // If starting from empty, just type the new text
    if (oldText === '') {
      let typeIndex = 0;
      const typeInterval = setInterval(() => {
        setAnimatedText(newText.slice(0, typeIndex + 1));
        typeIndex++;

        if (typeIndex >= newText.length) {
          clearInterval(typeInterval);
          currentInterval.current = null;
          setIsAnimating(false);
          previousDisplayText.current = newText;
        }
      }, typeSpeed);

      currentInterval.current = typeInterval;
      return;
    }

    // If going to empty, just remove characters
    if (newText === '') {
      let currentIndex = oldText.length;
      const removeInterval = setInterval(() => {
        setAnimatedText(oldText.slice(0, currentIndex - 1));
        currentIndex--;

        if (currentIndex <= 0) {
          clearInterval(removeInterval);
          currentInterval.current = null;
          setIsAnimating(false);
          previousDisplayText.current = newText;
        }
      }, removeSpeed);

      currentInterval.current = removeInterval;
      return;
    }

    // Normal case: remove old text, then type new text
    let currentIndex = oldText.length;
    const removeInterval = setInterval(() => {
      setAnimatedText(oldText.slice(0, currentIndex - 1));
      currentIndex--;

      if (currentIndex <= 0) {
        clearInterval(removeInterval);

        let typeIndex = 0;
        const typeInterval = setInterval(() => {
          setAnimatedText(newText.slice(0, typeIndex + 1));
          typeIndex++;

          if (typeIndex >= newText.length) {
            clearInterval(typeInterval);
            currentInterval.current = null;
            setIsAnimating(false);
            previousDisplayText.current = newText;
          }
        }, typeSpeed);

        currentInterval.current = typeInterval;
      }
    }, removeSpeed);

    currentInterval.current = removeInterval;
  };

  // Handle displayText changes
  useEffect(() => {
    // Always animate when displayText changes, unless it's the very first mount with empty text
    if (previousDisplayText.current === '' && displayText === '') {
      // Initial mount with no text - do nothing
      return;
    }

    // Animate from previous text to new text (including from empty)
    if (displayText !== previousDisplayText.current && !isAnimating) {
      animateText(previousDisplayText.current, displayText);
    }
  }, [displayText, removeSpeed, typeSpeed, isAnimating]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      clearCurrentInterval();
    };
  }, []);

  return (
    <div className={`mt-16 mx-4 sm:mx-8 lg:mt-24 lg:mx-16 ${className}`}>
      <div className="flex items-start gap-1 mt-8 flex-col lg:flex-row lg:gap-4 xl:mb-8 xl:mt-4 xl:mx-12">
        <h2
          className={`text-pf-lg font-medium font-metropolis text-white lg:text-pf-2xl xl:text-pf-3xl ${titleClassName}`}
        >
          {title}
        </h2>
        <div
          className={`h-px bg-white ${lineWidth} relative mt-10 lg:-bottom-5 xl:-bottom-11 ${lineClassName}`}
        >
          <span
            className={`absolute -bottom-2 left-0 text-white text-pf-xl font-metropolis font-semibold tracking-wide lg:text-pf-xl xl:text-pf-2xl ${displayTextClassName}`}
          >
            {animatedText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutTitle;
