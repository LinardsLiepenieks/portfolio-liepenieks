'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { CertificateComponentProps } from '@/types/CertificateItemType';

type CertificateItemProps = CertificateComponentProps;

const CertificateItem = ({
  name,
  provider,
  year,
  logoUrl,
  certificateUrl,
  className = '',
  onClick,
  onSelect,
  onDeselect,
}: CertificateItemProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsFocused(true);
    onClick?.();
    onSelect?.();
  };

  // Handle clicks outside to defocus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        if (isFocused) {
          setIsFocused(false);
          onDeselect?.();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused, onDeselect]);

  return (
    <A4Modal
      propagationAllowed={false}
      image={certificateUrl}
      linkTitle={`${name} Certificate`}
    >
      <div
        ref={itemRef}
        className={`mx-auto font-metropolis p-3 my-1 group cursor-pointer inline-block ${
          className || ''
        }`}
        onClick={handleClick}
      >
        <div
          className={`flex gap-6 p-2 transition-all duration-300 ease-out transform ${
            isFocused ? 'scale-108' : 'scale-100 group-hover:scale-108'
          }`}
        >
          <div className="flex-shrink-0">
            <div
              className={`w-30 h-30 rotate-0 relative overflow-hidden rounded-lg flex items-center justify-center border border-solid border-gray-600 transition-transform duration-300 ease-out transform ${
                isFocused ? 'rotate-[-8deg]' : ' group-hover:rotate-[-8deg]'
              }`}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${provider} logo`}
                  fill
                  className="object-cover"
                  unoptimized // Since it's from Vercel Blob storage
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 border border-gray-700 flex items-center justify-center text-white text-xs font-bold">
                  {provider.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-grow min-w-0 flex flex-col justify-center flex flex-col gap-2">
            {/* Certificate Name */}
            <h3
              className={`text-pf-xl italic font-medium transition-colors duration-300 ${
                isFocused
                  ? 'text-neutral-100'
                  : 'text-neutral-200 group-hover:text-neutral-100'
              }`}
            >
              {name}
            </h3>

            {/* Provider and Year Row */}
            <div className="flex items-center gap-4 relative px-2">
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ${
                  isFocused
                    ? 'text-neutral-100'
                    : 'text-neutral-200 group-hover:text-neutral-100'
                }`}
              >
                {provider}
              </p>
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ${
                  isFocused
                    ? 'text-neutral-100'
                    : 'text-neutral-200 group-hover:text-neutral-100'
                }`}
              >
                {year}
              </p>
            </div>
          </div>

          {/* Certificate link indicator */}
          {certificateUrl && (
            <div className="flex-shrink-0 flex items-center">
              <div
                className={`w-6 h-6 rounded-full transition-colors duration-300 flex items-center justify-center ${
                  isFocused
                    ? 'bg-neutral-600'
                    : 'bg-neutral-700 group-hover:bg-neutral-600'
                }`}
              >
                <span className="text-xs text-neutral-300">🏆</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </A4Modal>
  );
};

export default CertificateItem;
