import React from 'react';

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
}

const AboutTitle = ({
  title,
  displayText = '',
  className = '',
  titleClassName = '',
  displayTextClassName = '',
  lineClassName = '',
  lineWidth = 'w-64 md:w-80',
}: AboutTitleProps) => {
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
            {displayText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutTitle;
