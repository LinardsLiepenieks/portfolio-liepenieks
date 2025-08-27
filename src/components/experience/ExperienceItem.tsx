'use client';

import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { ExperienceComponentProps } from '@/types/ExperienceItemType';

type ExperienceItemProps = ExperienceComponentProps;

const ExperienceItem = ({
  title,
  position,
  period,
  description,
  logoUrl,
  recommendationUrl,
  linkTitle = 'Recommendation letter',
  className = '',
}: ExperienceItemProps) => {
  return (
    <div className="text-neutral-100 max-w-6xl font-metropolis flex flex-col justify-center h-full border-dashed border-neutral-500 px-8 py-2 border max-h-80 lg:max-h-120 xl:max-h-140 aspect-18/9">
      {/* Top row - Year */}
      <div className="mb-2 text-pf-xl lg:text-pf-2xl flex-shrink-0 flex items-baseline gap-2">
        <h3>{position}</h3>
        <span className="text-pf-base lg:text-pf-lg font-regular text-neutral-200">
          {period}
        </span>
      </div>

      {/* Middle section - Photo/Image and Description */}
      <div className="flex min-h-0 gap-2 flex-1 mb-1">
        {/* Image container */}
        <div className="flex-shrink-0 aspect-square flex items-center justify-center border border-dotted border-gray-500 lg:mx-16 relative p-4 self-stretch">
          <div className="w-full h-full relative">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`Experience ${title} image`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded drop-shadow-[2px_0px_16px_rgba(255,255,255,0.1)]"
              />
            ) : (
              <div className="text-gray-300">No image</div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 overflow-y-auto scrollbar-darker py-0 my-0">
          <p className="text-pf-base text-medium text-gray-200 py-0 px-1">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom section - Work Title and Button */}
      <div className="flex flex-col items-start flex-shrink-0 p-2 lg:ml-13 mt-2">
        {recommendationUrl && linkTitle && (
          <A4Modal
            image={recommendationUrl}
            linkTitle={linkTitle}
            defaultButtonText={linkTitle}
          />
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
