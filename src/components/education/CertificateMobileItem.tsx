'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { CertificateComponentProps } from '@/types/CertificateItemType';

type CertificateMobileItemProps = CertificateComponentProps;

const CertificateMobileItem = ({
  name,
  provider,
  year,
  logoUrl,
  certificateUrls, // Changed from certificateUrl to certificateUrls to match desktop
  className = '',
  onClick,
  onSelect,
  onDeselect,
}: CertificateMobileItemProps) => {
  const handleClick = () => {
    // Call the original props callbacks for compatibility
    onClick?.();
    onSelect?.();
  };

  // Extract URLs from certificateUrls array (same pattern as desktop)
  const documentUrls = useMemo(
    () => certificateUrls?.map((cert) => cert.url).filter(Boolean) || [],
    [certificateUrls]
  );

  // Memoize the modal props to prevent re-creation (same pattern as desktop)
  const modalProps = useMemo(
    () => ({
      propagationAllowed: false,
      image: documentUrls,
      linkTitle: `${name} Certificate`,
    }),
    [documentUrls, name]
  );

  const providerInitial = provider?.charAt(0)?.toUpperCase() || '?';

  const certificateContent = useMemo(
    () => (
      <div
        className={`
          font-metropolis
          flex-shrink-0
          flex 
          flex-col 
          items-center 
          text-neutral-100 
          cursor-pointer 
          select-none 
          relative 
          overflow-hidden
          w-full 
          transition-all 
          duration-[300ms] 
          hover:bg-neutral-800/20
          rounded-lg
          ${className}
        `}
        onClick={handleClick}
      >
        {/* Main Content Row */}
        <div className="flex items-center gap-3 w-full justify-start">
          {/* Logo/Avatar */}
          <div className="relative w-20 h-20 flex-shrink-0 p-1">
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
                relative
                ${
                  logoUrl
                    ? 'bg-none'
                    : 'bg-gradient-to-br from-blue-500 to-purple-500 border border-gray-700'
                }
              `}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${provider} logo`}
                  fill
                  className="w-full h-full object-contain"
                  unoptimized // Since it's from Vercel Blob storage
                />
              ) : (
                <span className="text-white font-bold text-base">
                  {providerInitial}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="text-base text-neutral-300 font-semibold">
              {name}
            </div>
            <div className="text-sm font-medium text-neutral-400">
              {provider} • {year}
            </div>
          </div>
        </div>
      </div>
    ),
    [className, handleClick, name, provider, year, logoUrl, providerInitial]
  );

  return <A4Modal {...modalProps}>{certificateContent}</A4Modal>;
};

export default CertificateMobileItem;
