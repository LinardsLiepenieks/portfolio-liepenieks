'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { EducationComponentProps } from '@/types/EducationItemType';

export default function EducationMobileItem({
  id,
  name,
  nameShort,
  degree,
  specialty,
  period,
  attachmentName,
  descriptionShort,
  logoUrl,
  educationUrls, // Changed from diplomaUrl to match desktop version
  className = '',
  onClick,
  onSelect,
  onDeselect,
}: EducationComponentProps) {
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

  // Extract URLs and attachment names for A4Modal (same as desktop version)
  const documentUrls =
    educationUrls?.map((doc) => doc.url).filter(Boolean) || [];

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
        {/* Empty banner area - add your content here */}
      </div>

      {/* Main Content Row */}
      <div className="flex items-center gap-3 w-full justify-start">
        {/* Logo/Avatar */}
        <div className="relative w-24 h-24 flex-shrink-0">
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
                alt={`${name} logo`}
                fill
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <span className="text-white font-bold text-base">
                {name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="">
          <div className="text-base text-neutral-100 font-medium">
            <h3 className="text-pf-lg font-medium -mb-1.5 sm:hidden">
              {nameShort}
            </h3>
            <h3 className="text-pf-lg font-medium -mb-1.5 hidden sm:block">
              {name}
            </h3>
            <span className="text-pf-sm text-neutral-200">{period}</span>
          </div>
        </div>
      </div>

      {/* Wide Drawer Icon */}
      <div className="w-full flex justify-center mt-2">
        <div
          className={`
            flex 
            items-center 
            justify-center 
            transition-transform 
            duration-[300ms] 
            text-gray-400
            ${isExpanded ? 'rotate-180' : ''}
          `}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-current"
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Expandable Description */}
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
              ? 'opacity-100 max-h-[400px] mt-3 pt-3 mb-0 translate-y-0'
              : 'opacity-0 max-h-0 mt-0 pt-0 mb-0 -translate-y-2.5'
          }
        `}
      >
        <div className="mb-3 text-neutral-100">
          <h4 className="font-semibold text-pf-base -mb-0.5">{degree}</h4>
          <h5 className="text-pf-sm font-semibold mb-2">{specialty}</h5>
          <p className="text-pf-sm text-neutral-300 font-medium leading-6">
            {descriptionShort}
          </p>
        </div>

        {/* A4Modal Button - Mobile version */}
        {documentUrls.length > 0 && (
          <A4Modal
            image={documentUrls}
            linkTitle={`${name} ${attachmentName}`}
            propagationAllowed={false}
            defaultButtonText={`View ${attachmentName}`}
            defaultButtonClassName="border border-neutral-500 px-4 py-2 border-solid text-neutral-200 hover:text-white hover:border-neutral-400 hover:cursor-pointer text-sm italic font-semibold tracking-wide rounded transition-all duration-300 relative group/btn"
          />
        )}
      </div>
    </div>
  );
}
