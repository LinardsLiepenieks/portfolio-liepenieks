'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { ExperienceComponentProps } from '@/types/ExperienceItemType';

type ExperienceMobileItemProps = ExperienceComponentProps;

const ExperienceMobileItem = ({
  title,
  position,
  period,
  description,
  logoUrl,
  recommendationUrl,
  linkTitle = 'Recommendation letter',
  className = '',
  onClick,
  onSelect,
  onDeselect,
}: ExperienceMobileItemProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggle = (): void => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    // Call the appropriate callback based on the new state
    if (newExpandedState) {
      onSelect?.();
    } else {
      onDeselect?.();
    }

    // Call the general onClick handler
    onClick?.();
  };

  return (
    <div
      className={`
        font-metropolis
        flex-shrink-0
        flex 
        flex-col 
        items-center 
        gap-2 
        text-neutral-100 
        cursor-pointer 
        select-none 
        relative 
        overflow-hidden
        w-full 
        transition-all 
        duration-[300ms] 
        ${isExpanded ? 'pb-5' : ''}
        ${className}
      `}
      onClick={handleToggle}
    >
      {/* Title */}
      <div className="text-pf-lg font-medium text-neutral-100 w-full -mb-2">
        {position}
      </div>

      {/* Main Content Row */}
      <div className="flex items-center gap-3 w-full justify-start">
        {/* Logo/Avatar */}
        <div className="relative w-20 h-20 flex-shrink-0">
          {logoUrl && (
            <>
              {/* Corner borders for logos */}
              <div className="absolute top-0 left-0 w-5 h-5 border-l border-t border-gray-700 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-r border-t border-gray-700 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-l border-b border-gray-700 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-r border-b border-gray-700 rounded-br-lg"></div>
            </>
          )}

          <div
            className={`
              w-full h-full
              flex 
              items-center 
              justify-center
              rounded-lg
              overflow-hidden
              transition-all
              duration-[300ms]
              ${isExpanded ? 'p-2.5' : 'p-3'}
              ${
                logoUrl
                  ? 'bg-none'
                  : 'bg-gradient-to-br from-red-500 to-orange-500 border border-gray-700'
              }
            `}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${title} logo`}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                unoptimized // Since it's from Vercel Blob storage
              />
            ) : (
              <span className="text-white font-bold text-base">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="">
          <div className="text-base text-neutral-300 font-medium">{period}</div>
        </div>

        {/* Chevron */}
        <div className="ml-auto pr-4">
          <div
            className={`
              text-lg 
              text-gray-400 
              ml-auto 
              items-center
              justify-center
              transition-transform 
              duration-[300ms] 
              ${isExpanded ? 'rotate-90' : ''}
            `}
          >
            ❯
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        className={`
          w-full
          border-t 
          border-gray-500 
          text-pf-sm 
          leading-relaxed
          overflow-hidden
          transition-all 
          duration-[600ms] 
          h-full
          
          ${
            isExpanded
              ? 'opacity-100 max-h-[800px] mt-3 pt-3 mb-0 translate-y-0'
              : 'opacity-0 max-h-0 mt-0 pt-0 mb-0 -translate-y-2.5'
          }
        `}
      >
        <div className="mb-3">{description}</div>

        {/* Recommendation Link - only show if URL exists */}
        {recommendationUrl && (
          <A4Modal
            image={recommendationUrl}
            linkTitle={linkTitle}
            defaultButtonText={linkTitle}
          >
            <button className="border border-neutral-500 px-4 py-2 border-solid text-white hover:cursor-pointer text-sm italic font-semibold !tracking-wide rounded transition-colors relative group  inline-block">
              {linkTitle}
            </button>
          </A4Modal>
        )}
      </div>
    </div>
  );
};

export default ExperienceMobileItem;
