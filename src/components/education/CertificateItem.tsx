'use client';

import React, { useRef, useState, useMemo } from 'react';
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
  const itemRef = useRef<HTMLDivElement>(null);
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);

  const handleClick = () => {
    // Trigger the animation back to default
    setIsAnimatingBack(true);

    // Reset after animation completes
    setTimeout(() => {
      setIsAnimatingBack(false);
    }, 300); // Match the animation duration

    onClick?.();
    onSelect?.();
  };

  const providerInitial = provider?.charAt(0)?.toUpperCase() || '?';

  // Memoize the modal props to prevent re-creation
  const modalProps = useMemo(
    () => ({
      propagationAllowed: false,
      image: certificateUrl,
      linkTitle: `${name} Certificate`,
    }),
    [certificateUrl, name]
  );

  // Memoize the certificate content to prevent re-renders
  const certificateContent = useMemo(
    () => (
      <div
        ref={itemRef}
        className={`group  font-metropolis  my-6 cursor-pointer inline-block focus:outline-none ${className}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`View ${name} certificate from ${provider}, ${year}`}
      >
        <style jsx>{`
          @keyframes scaleBack {
            0% {
              transform: scale(1.08);
              transition: none;
            }
            100% {
              transform: scale(1);
              transition: none;
            }
          }

          @keyframes rotateBack {
            0% {
              transform: rotate(-8deg);
              transition: none;
            }
            100% {
              transform: rotate(0deg);
              transition: none;
            }
          }

          @keyframes colorBack {
            0% {
              color: rgb(245, 245, 245);
              transition: none;
            }
            100% {
              color: rgb(229, 229, 229);
              transition: none;
            }
          }

          @keyframes bgBack {
            0% {
              background-color: rgb(82, 82, 91);
              transition: none;
            }
            100% {
              background-color: rgb(64, 64, 70);
              transition: none;
            }
          }

          /* Webkit prefixes for older browsers */
          @-webkit-keyframes scaleBack {
            0% {
              -webkit-transform: scale(1.08);
              transform: scale(1.08);
              -webkit-transition: none;
              transition: none;
            }
            100% {
              -webkit-transform: scale(1);
              transform: scale(1);
              -webkit-transition: none;
              transition: none;
            }
          }

          @-webkit-keyframes rotateBack {
            0% {
              -webkit-transform: rotate(-8deg);
              transform: rotate(-8deg);
              -webkit-transition: none;
              transition: none;
            }
            100% {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
              -webkit-transition: none;
              transition: none;
            }
          }

          @-webkit-keyframes colorBack {
            0% {
              color: rgb(245, 245, 245);
              -webkit-transition: none;
              transition: none;
            }
            100% {
              color: rgb(229, 229, 229);
              -webkit-transition: none;
              transition: none;
            }
          }

          @-webkit-keyframes bgBack {
            0% {
              background-color: rgb(82, 82, 91);
              -webkit-transition: none;
              transition: none;
            }
            100% {
              background-color: rgb(64, 64, 70);
              -webkit-transition: none;
              transition: none;
            }
          }

          .animate-scale-back {
            -webkit-animation: scaleBack 0.3s ease-out forwards;
            animation: scaleBack 0.3s ease-out forwards;
            transition: none !important;
          }

          .animate-rotate-back {
            -webkit-animation: rotateBack 0.3s ease-out forwards;
            animation: rotateBack 0.3s ease-out forwards;
            transition: none !important;
          }

          .animate-color-back {
            -webkit-animation: colorBack 0.3s ease-out forwards;
            animation: colorBack 0.3s ease-out forwards;
            transition: none !important;
          }

          .animate-bg-back {
            -webkit-animation: bgBack 0.3s ease-out forwards;
            animation: bgBack 0.3s ease-out forwards;
            transition: none !important;
          }

          /* Remove focus outline */
          .certificate-item:focus {
            outline: none !important;
          }

          /* Optional: Add a custom focus indicator if you want */
          .certificate-item:focus-visible {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
            border-radius: 8px;
          }
        `}</style>

        <div
          className={`flex gap-6  pr-4 transform transition-transform duration-300 ease-out scale-100 ${
            isAnimatingBack ? 'animate-scale-back' : 'group-hover:scale-108'
          }`}
        >
          {/* Logo Container - ASPECT RATIO PRESERVED */}
          <div className="flex-shrink-0">
            <div
              className={`w-30 h-30 relative overflow-hidden rounded-lg flex items-center justify-center border border-solid border-neutral-700 transform transition-transform duration-300 ease-out rotate-0 ${
                isAnimatingBack
                  ? 'animate-rotate-back'
                  : 'group-hover:-rotate-[8deg]'
              }`}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${provider} logo`}
                  fill
                  className="object-contain" // Maintains aspect ratio and fits within container
                  sizes="120px"
                  unoptimized // Since it's from Vercel Blob storage
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 border border-gray-700 flex items-center justify-center text-white text-xs font-bold"
                  aria-label={`${provider} logo placeholder`}
                >
                  {providerInitial}
                </div>
              )}
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-grow min-w-0 flex flex-col justify-center gap-1">
            {/* Certificate Name */}
            <h3
              className={`text-pf-lg italic font-medium transition-colors duration-300 ease-out text-neutral-200 ${
                isAnimatingBack
                  ? 'animate-color-back'
                  : 'group-hover:text-neutral-100'
              }`}
            >
              {name}
            </h3>

            {/* Provider and Year Row */}
            <div className="flex items-center gap-3 relative text-neutral-200">
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ease-out  ${
                  isAnimatingBack
                    ? 'animate-color-back'
                    : 'group-hover:text-neutral-100'
                }`}
              >
                {provider}
              </p>
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ease-out  ${
                  isAnimatingBack
                    ? 'animate-color-back'
                    : 'group-hover:text-neutral-100'
                }`}
              >
                {year}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    [
      className,
      handleClick,
      name,
      provider,
      year,
      logoUrl,
      certificateUrl,
      providerInitial,
      isAnimatingBack,
    ]
  );

  return <A4Modal {...modalProps}>{certificateContent}</A4Modal>;
};

export default CertificateItem;
