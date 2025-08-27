'use client';

import React from 'react';
import Image from 'next/image';
import A4Modal from '../modals/A4Modal';
import { CertificateComponentProps } from '@/types/CertificateItemType';

type CertificateMobileItemProps = CertificateComponentProps;

const CertificateMobileItem = ({
  name,
  provider,
  year,
  logoUrl,
  certificateUrl,
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

  return (
    <A4Modal image={certificateUrl} linkTitle={`${name} Certificate`}>
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
        <div className="flex items-center gap-3 w-full justify-start ">
          {/* Logo/Avatar */}
          <div className="relative w-20 h-20 flex-shrink-0 p-1 ">
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
                  {provider.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="text-base text-neutral-300 font-semibold">
              {name}
            </div>
            <div className="text-sm font-medium text-neutral-400">{year}</div>
          </div>
        </div>
      </div>
    </A4Modal>
  );
};

export default CertificateMobileItem;
