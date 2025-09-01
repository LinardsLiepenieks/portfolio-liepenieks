'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { EducationComponentProps } from '@/types/EducationItemType';

export default function EducationItem({
  id,
  name,
  nameShort,
  degree,
  specialty,
  period,
  descriptionShort,
  logoUrl,
  attachmentName,
  educationUrls,
  className,
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

  // Extract URLs and attachment names for A4Modal
  const documentUrls =
    educationUrls?.map((doc) => doc.url).filter(Boolean) || [];

  return (
    <div
      className={`font-metropolis group inline-block max-w-[1600px] w-full transition-all duration-300 ${
        className || ''
      }`}
    >
      {/* Main clickable area */}
      <div
        className="cursor-pointer lg:cursor-auto select-none"
        onClick={handleToggle}
      >
        <div className="flex gap-6">
          <div className="flex-shrink-0 flex items-center overflow-visible">
            <div className="w-60 h-60 relative overflow-visible rounded-lg flex items-center justify-center group-hover:drop-shadow-2xl transition-all duration-300">
              {logoUrl ? (
                <div className="w-full h-full relative group-hover:drop-shadow-lg transition-all duration-400 scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100">
                  <Image
                    src={logoUrl}
                    alt={`${name} logo`}
                    fill
                    className="object-cover"
                  />
                  {/* Shine overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-800 z-10 pointer-events-none"
                    style={{
                      mask: `url(${logoUrl})`,
                      WebkitMask: `url(${logoUrl})`,
                      maskSize: 'cover',
                      WebkitMaskSize: 'cover',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  >
                    <div className="absolute opacity-50 inset-0 bg-gradient-to-r from-white/10 via-white/40 to-white/10 transform -skew-x-24 -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease" />
                  </div>
                  {/* Animated radial glow effect - contained within bounds */}
                  <div className="absolute inset-1 bg-gradient-radial from-blue-500/20 via-blue-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                </div>
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs relative overflow-hidden group-hover:drop-shadow-lg transition-all duration-300">
                  {nameShort || name?.charAt(0) || 'EDU'}
                  {/* Shine overlay for fallback */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-200 ease-out" />
                  </div>
                  {/* Animated radial glow for fallback - contained within bounds */}
                  <div className="absolute inset-1 bg-gradient-radial from-neutral-500/20 via-neutral-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-grow min-w-0 flex flex-col justify-center gap-2">
            {/* Institution Name */}
            <h3 className="text-pf-xl italic font-medium text-neutral-200 group-hover:text-white transition-colors duration-300">
              {name}
            </h3>

            {/* Degree, Specialty and Time Row */}
            <div className="flex justify-center relative px-2 transform-gpu flex-col -mt-1 gap-1">
              <p className="text-pf-sm font-semibold text-neutral-300 group-hover:text-neutral-100 transition-colors duration-300">
                {degree}
                {specialty && (
                  <span className="text-neutral-300 ml-2 group-hover:text-neutral-200 transition-colors duration-300">
                    • {specialty}
                  </span>
                )}
              </p>
              <p className="text-pf-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors duration-300">
                {period}
              </p>
            </div>

            {/* Description - always visible on lg+ screens, expandable below lg */}
            {descriptionShort && (
              <div className="px-2 -mt-1.5 lg:block hidden ">
                <p className="text-pf-sm text-neutral-300 group-hover:text-neutral-200 transition-colors duration-200 font-medium">
                  {descriptionShort}
                </p>
              </div>
            )}

            {/* A4Modal Button - Large screens only */}
            {documentUrls.length > 0 && (
              <div className="px-2 mt-1 hidden lg:block">
                <A4Modal
                  image={documentUrls}
                  linkTitle={`${name} ${attachmentName}`}
                  propagationAllowed={false}
                  defaultButtonText={`View ${attachmentName}`}
                  defaultButtonClassName="border border-neutral-500 px-3 py-1.5 border-solid text-neutral-200 hover:text-white hover:border-neutral-400 hover:cursor-pointer text-sm italic font-semibold tracking-wide rounded transition-all duration-300 relative group/btn"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chevron below main content - hidden on lg+ screens */}
        <div className="w-full flex justify-center mt-3 lg:hidden">
          <div
            className={`
              flex 
              items-center 
              justify-center 
              transition-all 
              duration-300 
              text-neutral-400
              group-hover:text-white
              cursor-pointer
              ${isExpanded ? 'rotate-180' : ''}
            `}
            onClick={handleToggle}
          >
            <svg
              width="20"
              height="20"
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
      </div>

      {/* Expandable Description Section - hidden on lg+ screens */}
      <div
        className={`
          w-full
          overflow-hidden
          transition-all 
          duration-500
          ease-in-out
          lg:hidden
          ${
            isExpanded
              ? 'opacity-100 max-h-[400px] mt-4 translate-y-0'
              : 'opacity-0 max-h-0 mt-0 -translate-y-2'
          }
        `}
      >
        <div className="border-t border-neutral-600 pt-4 pl-6">
          {/* Full Description */}
          {descriptionShort && (
            <div className="mb-4">
              <p className="text-pf-sm text-neutral-100 font-medium leading-6">
                {descriptionShort}
              </p>
            </div>
          )}

          {/* A4Modal Button - Mobile/Small screens */}
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
    </div>
  );
}
