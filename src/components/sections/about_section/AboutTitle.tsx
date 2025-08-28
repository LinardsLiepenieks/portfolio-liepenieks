import React, { useState, useEffect, useRef } from 'react';

interface AboutTitleProps {
  title: string;
  displayText?: string;
  className?: string;
  titleClassName?: string;
  displayTextClassName?: string;
  lineClassName?: string;
  lineWidth?: string;
  typeSpeed?: number;
  removeSpeed?: number;
}

const AboutTitle = ({
  title,
  displayText = '',
  className = '',
  titleClassName = '',
  displayTextClassName = '',
  lineClassName = '',
  lineWidth = 'w-64 md:w-80',
  typeSpeed = 30,
  removeSpeed = 20,
}: AboutTitleProps) => {
  const [currentText, setCurrentText] = useState('');
  const currentTextRef = useRef('');

  // Keep ref in sync with state
  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // If displayText is empty/null, animate removal
    if (!displayText && currentTextRef.current) {
      let index = currentTextRef.current.length - 1;

      interval = setInterval(() => {
        if (index >= 0) {
          setCurrentText(currentTextRef.current.substring(0, index));
          index--;
        } else {
          clearInterval(interval);
        }
      }, removeSpeed);
    }
    // If displayText exists, animate typing
    else if (displayText) {
      let index = 0;
      setCurrentText('');

      interval = setInterval(() => {
        if (index < displayText.length) {
          setCurrentText(displayText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, typeSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [displayText, typeSpeed, removeSpeed]); // Removed currentText from dependencies

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
            {currentText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutTitle;
