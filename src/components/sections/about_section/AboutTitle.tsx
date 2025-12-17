import React, { useState, useEffect, useRef } from 'react';

interface AboutTitleProps {
  title: string;
  displayText?: string;
  className?: string;
  titleClassName?: string;
  displayTextClassName?: string;
  lineClassName?: string;
  minLineWidth?: string;
  typeSpeed?: number;
  removeSpeed?: number;
  transitionDuration?: string;
}

const AboutTitle = ({
  title,
  displayText = '',
  className = '',
  titleClassName = '',
  displayTextClassName = '',
  lineClassName = '',
  minLineWidth = 'min-w-40',
  typeSpeed = 30,
  removeSpeed = 20,
  transitionDuration = 'duration-300',
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
  }, [displayText, typeSpeed, removeSpeed]);

  return (
    <div
      className={`mt-16 mx-4 sm:mx-8 lg:mt-20 lg:pb-16 xl:mt-22 lg:mx-16 xl:-mb-12 ${className} `}
    >
      <div className="flex items-start gap-1 mt-8 flex-col lg:flex-row lg:gap-4 xl:mb-8 xl:mt-4 xl:mx-12 ">
        <h2
          className={`text-pf-lg font-medium font-metropolis text-white lg:text-pf-2xl xl:text-pf-2xl ${titleClassName} mr-8`}
        >
          {title}
        </h2>
        <div className="relative w-full sm:w-auto pr-4 xl:pr-0">
          {/* Text container with pseudo-element line and smooth transitions */}
          <div
            className={`relative    sm:min-w-120 transition-all duration-300  `}
          >
            {/* Invisible text to set container width */}
            <span
              className={`whitespace-nowrap text-white font-extralight text-pf-xl font-metropolis  tracking-wide lg:text-pf-2xl xl:text-pf-2xl ${displayTextClassName} `}
              aria-hidden="true"
            >
              {currentText || '\u00A0'}
            </span>
            <span className="bg-neutral-100 h-px absolute w-full left-0 bottom-0 transition-all"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTitle;
