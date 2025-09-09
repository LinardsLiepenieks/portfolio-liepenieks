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
  certificateUrls,
  className = '',
  onClick,
  onSelect,
  onDeselect,
}: CertificateItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);

  const handleClick = () => {
    setIsAnimatingBack(true);
    setTimeout(() => {
      setIsAnimatingBack(false);
    }, 300);

    onClick?.();
    onSelect?.();
  };

  const providerInitial = provider?.charAt(0)?.toUpperCase() || '?';

  const modalProps = useMemo(
    () => ({
      propagationAllowed: false,
      image: certificateUrls?.map((cert) => cert.url).filter(Boolean) || [],
      linkTitle: `${name} Certificate`,
    }),
    [certificateUrls, name]
  );

  const certificateContent = useMemo(
    () => (
      <div
        ref={itemRef}
        className={`group font-metropolis my-4 cursor-pointer inline-block focus:outline-none ${className}`}
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
          /* Anti-blur and anti-snap keyframes using scale3d and translate3d */
          @keyframes scaleBackSmooth {
            0% {
              transform: scale3d(1.08, 1.08, 1) translate3d(0, 0, 0);
            }
            100% {
              transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
            }
          }

          @keyframes rotateBackSmooth {
            0% {
              transform: rotate(-8deg) translate3d(0, 0, 0);
            }
            100% {
              transform: rotate(0deg) translate3d(0, 0, 0);
            }
          }

          @keyframes colorBackSmooth {
            0% {
              color: rgb(245, 245, 245);
            }
            100% {
              color: rgb(229, 229, 229);
            }
          }

          /* Webkit prefixes for older browsers */
          @-webkit-keyframes scaleBackSmooth {
            0% {
              -webkit-transform: scale3d(1.08, 1.08, 1) translate3d(0, 0, 0);
              transform: scale3d(1.08, 1.08, 1) translate3d(0, 0, 0);
            }
            100% {
              -webkit-transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
              transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
            }
          }

          @-webkit-keyframes rotateBackSmooth {
            0% {
              -webkit-transform: rotate(-8deg) translate3d(0, 0, 0);
              transform: rotate(-8deg) translate3d(0, 0, 0);
            }
            100% {
              -webkit-transform: rotate(0deg) translate3d(0, 0, 0);
              transform: rotate(0deg) translate3d(0, 0, 0);
            }
          }

          /* Anti-blur animation classes */
          .animate-scale-back-smooth {
            -webkit-animation: scaleBackSmooth 0.3s ease-out forwards;
            animation: scaleBackSmooth 0.3s ease-out forwards;
            transition: none !important;
          }

          .animate-rotate-back-smooth {
            -webkit-animation: rotateBackSmooth 0.3s ease-out forwards;
            animation: rotateBackSmooth 0.3s ease-out forwards;
            transition: none !important;
          }

          .animate-color-back-smooth {
            -webkit-animation: colorBackSmooth 0.3s ease-out forwards;
            animation: colorBackSmooth 0.3s ease-out forwards;
            transition: none !important;
          }

          /* Base anti-blur classes */
          .certificate-container {
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            will-change: transform;
            transform-origin: center center;
          }

          .logo-container {
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            will-change: transform;
            transform-origin: center center;
          }

          .text-container {
            transform: translateZ(0);
            backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: geometricPrecision;
            position: relative;
            z-index: 1;
          }

          /* Hover states using scale3d - applied via group-hover */
          .group:hover .certificate-container:not(.animate-scale-back-smooth) {
            transform: scale3d(1.08, 1.08, 1) translate3d(0, 0, 0);
          }

          .group:hover .logo-container:not(.animate-rotate-back-smooth) {
            transform: rotate(-8deg) translate3d(0, 0, 0);
          }

          /* Focus styles */
          .certificate-item:focus {
            outline: none !important;
          }

          .certificate-item:focus-visible {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
            border-radius: 8px;
          }

          /* High DPI optimizations */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .text-container {
              -webkit-font-smoothing: subpixel-antialiased;
            }
          }
        `}</style>

        <div
          className={`certificate-container flex gap-6 pr-4 transition-transform duration-300 ease-out ${
            isAnimatingBack ? 'animate-scale-back-smooth' : ''
          }`}
        >
          {/* Logo Container with anti-blur fixes */}
          <div className="flex-shrink-0">
            <div
              className={`logo-container w-30 h-30 relative overflow-hidden rounded-lg flex items-center justify-center transition-transform duration-300 ease-out ${
                isAnimatingBack ? 'animate-rotate-back-smooth' : ''
              }`}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${provider} logo`}
                  fill
                  className="object-contain"
                  sizes="120px"
                  quality={95}
                  priority={false}
                  style={{
                    imageRendering: 'auto',
                  }}
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 border border-gray-700 flex items-center justify-center text-white text-xs font-bold text-container"
                  aria-label={`${provider} logo placeholder`}
                >
                  {providerInitial}
                </div>
              )}
            </div>
          </div>

          {/* Content Container with anti-blur text */}
          <div className="flex-grow min-w-0 flex flex-col justify-center gap-1 lg:gap-0">
            {/* Certificate Name */}
            <h3
              className={`text-container text-pf-lg xl:text-pf-xl italic font-medium transition-colors duration-300 ease-out text-neutral-200 ${
                isAnimatingBack
                  ? 'animate-color-back-smooth'
                  : 'group-hover:text-neutral-100'
              }`}
            >
              {name}
            </h3>

            {/* Provider and Year Row */}
            <div className="text-container flex items-center gap-2 relative text-neutral-200">
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ease-out xl:text-pf-base ${
                  isAnimatingBack
                    ? 'animate-color-back-smooth'
                    : 'group-hover:text-neutral-100'
                }`}
              >
                {provider}
              </p>
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ease-out xl:text-pf-base ${
                  isAnimatingBack
                    ? 'animate-color-back-smooth'
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
      certificateUrls,
      providerInitial,
      isAnimatingBack,
    ]
  );

  return <A4Modal {...modalProps}>{certificateContent}</A4Modal>;
};

export default CertificateItem;
