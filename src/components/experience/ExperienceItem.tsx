'use client';

import { useState } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRecommendationClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <div className="text-neutral-100 max-w-6xl font-metropolis flex flex-col justify-center max-h-full border-dashed border-neutral-500 px-8 py-2 border">
        {/* Top row - Year */}

        <div className="text-lg mb-2 text-pf-2xl flex-shrink-0 flex items-baseline gap-2">
          <h3>{position}</h3>
          <span className="text-pf-lg font-regular text-neutral-200">
            {period}
          </span>
        </div>

        {/* Middle section - Photo/Image and Description */}
        <div className="flex min-h-0 gap-2 max-h-96 h-full mb-1">
          {/* Image container */}
          <div className="w-90 aspect-square flex items-center justify-center border border-dotted border-gray-500 flex-shrink-0 mx-16  relative p-4">
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
          <div className="flex-1 overflow-y-auto scrollbar-darker max-h-full py-0 my-0">
            <p className="text-pf-base text-medium text-gray-200 py-0 px-1">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom section - Work Title and Button */}
        <div className="flex flex-col items-start flex-shrink-0 p-2 ml-13 mt-2">
          {linkTitle && (
            <button
              onClick={handleRecommendationClick}
              className=" hover:cursor-pointer text-pf-base italic font-semibold !tracking-wide rounded transition-colors relative group after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 after:ease-out hover:after:w-full"
            >
              {linkTitle}
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {recommendationUrl && (
        <A4Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          image={recommendationUrl}
        />
      )}
    </>
  );
};

export default ExperienceItem;
