'use client';

import React, { useRef, useState } from 'react';
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

  return (
    <A4Modal
      propagationAllowed={false}
      image={certificateUrl}
      linkTitle={`${name} Certificate`}
    >
      <div
        ref={itemRef}
        className={`group mx-auto font-metropolis p-3 my-1 cursor-pointer inline-block ${className}`}
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
        `}</style>

        <div
          className={`flex gap-6 p-2 transform transition-transform duration-300 ease-out scale-100 ${
            isAnimatingBack ? 'animate-scale-back' : 'group-hover:scale-108'
          }`}
        >
          {/* Logo Container */}
          <div className="flex-shrink-0">
            <div
              className={`w-30 h-30 relative overflow-hidden rounded-lg flex items-center justify-center border border-solid border-gray-600 transform transition-transform duration-300 ease-out rotate-0 ${
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
                  className="object-cover"
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
          <div className="flex-grow min-w-0 flex flex-col justify-center gap-2">
            {/* Certificate Name */}
            <h3
              className={`text-pf-xl italic font-medium transition-colors duration-300 ease-out text-neutral-200 ${
                isAnimatingBack
                  ? 'animate-color-back'
                  : 'group-hover:text-neutral-100'
              }`}
            >
              {name}
            </h3>

            {/* Provider and Year Row */}
            <div className="flex items-center gap-4 relative px-2">
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ease-out text-neutral-200 ${
                  isAnimatingBack
                    ? 'animate-color-back'
                    : 'group-hover:text-neutral-100'
                }`}
              >
                {provider}
              </p>
              <p
                className={`text-pf-sm font-semibold transition-colors duration-300 ease-out text-neutral-200 ${
                  isAnimatingBack
                    ? 'animate-color-back'
                    : 'group-hover:text-neutral-100'
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
                className={`w-6 h-6 rounded-full transition-colors duration-300 ease-out flex items-center justify-center bg-neutral-700 ${
                  isAnimatingBack
                    ? 'animate-bg-back'
                    : 'group-hover:bg-neutral-600'
                }`}
                aria-label="Certificate available"
              >
                <span
                  className="text-xs text-neutral-300"
                  role="img"
                  aria-label="trophy"
                >
                  🏆
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </A4Modal>
  );
};

export default CertificateItem;
