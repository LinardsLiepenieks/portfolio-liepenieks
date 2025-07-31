'use client';

import { useState } from 'react';
import A4Modal from '../modals/A4Modal';

interface ExperienceItemProps {
  year?: string;
  photo?: string;
  description?: string;
  workTitle?: string;
  recommendationImage?: string | null;
}

const ExperienceItem = ({
  year = '2023',
  description = 'Description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquam dignissim hendrerit. Pellentesque vitae lacinia lacus, ac feugiat velit. Aenean commodo, turpis id lacinia feugiat, ligula mi sollicitudin in, lobortis mauris mauris ut ipsum. Etiam vitae ex sem. Phasellus a suscipit lacus. Aliquam sagittis, justo vitae porttitor tincidunt, neque tellus venenatis nibh, consectetur aliquet nisl risus a augue. Donec vulputate enim vel urna pellentesque vestibulum.',
  workTitle = 'Work Title',
  recommendationImage = '/a4test.png',
}: ExperienceItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRecommendationClick = () => {
    setIsModalOpen(true);
    console.log('HERE');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="text-white max-w-5xl font-metropolis h-full flex flex-col">
        {/* Top row - Year */}
        <div className="text-lg mb-4 text-pf-xl flex-shrink-0">{year}</div>

        {/* Middle section - Photo and Description */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          {/* Photo and Description Row */}
          <div className="flex flex-1 min-h-0 gap-2">
            <div className="aspect-[4/3] flex-[1.4]  flex items-center justify-center border border-dotted border-gray-300">
              <div>Photo</div>
            </div>
            {/* Right side - Description */}
            <div className="flex-1 overflow-y-auto ">
              <p className="text-pf-base text-medium text-gray-300 ">
                {description}
              </p>
            </div>
          </div>

          {/* Bottom section - Work Title and Button */}
          <div className="flex flex-col items-start flex-shrink-0  p-2">
            <h3 className="text-pf-xl font-light mb-px">{workTitle}</h3>
            <button
              onClick={handleRecommendationClick}
              className="text-white hover:cursor-pointer text-sm italic font-semibold !tracking-wide rounded transition-colors relative group after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 after:ease-out hover:after:w-full"
            >
              Recommendation letter
            </button>
          </div>
        </div>
      </div>

      {/* A4 Modal */}
      <A4Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        image={recommendationImage}
      />
    </>
  );
};

export default ExperienceItem;
