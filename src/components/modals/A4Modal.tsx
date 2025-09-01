'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface A4ModalProps {
  image?: string | string[] | null;
  linkTitle?: string;
  children?: React.ReactNode;
  defaultButtonText?: string;
  defaultButtonClassName?: string;
  propagationAllowed?: boolean;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

const A4Modal = React.memo(
  ({
    image,
    linkTitle = 'Recommendation Letter',
    children,
    defaultButtonText = 'View Document',
    defaultButtonClassName = "hover:cursor-pointer text-pf-base italic font-semibold !tracking-wide rounded transition-colors relative group after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 after:ease-out hover:after:w-full text-white",
    propagationAllowed = true,
    onModalOpen,
    onModalClose,
  }: A4ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Convert image prop to array for consistent handling
    const images = useMemo(() => {
      if (!image) return [];
      return Array.isArray(image) ? image : [image];
    }, [image]);

    const hasMultipleImages = images.length > 1;

    const openModal = useCallback(() => {
      setIsOpen(true);
      setCurrentImageIndex(0); // Reset to first image when opening
      onModalOpen?.();
    }, [onModalOpen]);

    const closeModal = useCallback(() => {
      setIsOpen(false);
      onModalClose?.();
    }, [onModalClose]);

    const goToPreviousImage = useCallback(() => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }, [images.length]);

    const goToNextImage = useCallback(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, [images.length]);

    const goToImage = useCallback((index: number) => {
      setCurrentImageIndex(index);
    }, []);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    useEffect(() => {
      if (isOpen) {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      // Cleanup on unmount
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      },
      [closeModal]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
          goToPreviousImage();
        } else if (e.key === 'ArrowRight' && hasMultipleImages) {
          goToNextImage();
        }
      },
      [closeModal, goToPreviousImage, goToNextImage, hasMultipleImages]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isOpen, handleKeyDown]);

    // Stable trigger handlers
    const handleTriggerClick = useCallback(
      (e?: React.MouseEvent) => {
        openModal();
      },
      [openModal]
    );

    const handleTriggerClickCapture = useCallback(
      (e: React.MouseEvent) => {
        openModal();
        e.stopPropagation();
      },
      [openModal]
    );

    const handleKeyDownTrigger = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      },
      [openModal]
    );

    // Memoize trigger component to prevent re-creation
    const Trigger = useMemo(() => {
      if (children) {
        if (propagationAllowed) {
          // Original behavior with capture and stopPropagation
          return React.cloneElement(
            <div style={{ display: 'contents' }}>{children}</div>,
            {
              onClick: handleTriggerClick,
              onClickCapture: handleTriggerClickCapture,
              onKeyDown: handleKeyDownTrigger,
              role: 'button',
              tabIndex: 0,
            }
          );
        } else {
          // Clean behavior without event interference
          return React.cloneElement(
            <div style={{ display: 'contents' }}>{children}</div>,
            {
              onClick: handleTriggerClick,
              onKeyDown: handleKeyDownTrigger,
              role: 'button',
              tabIndex: 0,
            }
          );
        }
      }

      return (
        <button
          onClick={handleTriggerClick}
          className={defaultButtonClassName}
          type="button"
        >
          {defaultButtonText}
        </button>
      );
    }, [
      children,
      propagationAllowed,
      handleTriggerClick,
      handleTriggerClickCapture,
      handleKeyDownTrigger,
      defaultButtonClassName,
      defaultButtonText,
    ]);

    // Memoize modal content to prevent re-creation
    const modalContent = useMemo(
      () => (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 md:p-8 transition-all duration-300 ease-out ${
            isOpen
              ? 'opacity-100 visible pointer-events-auto bg-black/80'
              : 'opacity-0 invisible pointer-events-none bg-transparent'
          }`}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={`shadow-2xl max-w-4xl w-full max-h-[90vh] bg-neutral-800/95 backdrop-blur-sm rounded-lg overflow-hidden border border-neutral-700 border-2 transition-all duration-300 ease-out flex flex-col ${
              isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center px-4 py-2 lg:p-4 border-b border-neutral-700 flex-shrink-0">
              <h2
                id="modal-title"
                className="text-white text-sm md:text-lg font-medium tracking-wide font-metropolis"
              >
                {linkTitle}
                {hasMultipleImages && (
                  <span className="text-neutral-400 text-xs md:text-sm ml-2">
                    ({currentImageIndex + 1} of {images.length})
                  </span>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="hover:bg-neutral-700 hover:cursor-pointer transition-colors duration-200 text-neutral-400 hover:text-white rounded-full p-2 flex items-center justify-center"
                aria-label="Close modal"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto bg-neutral-900 min-h-0 scrollbar-dark">
              {images.length > 0 ? (
                <div className="w-full min-h-full flex justify-center">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${linkTitle} - Page ${currentImageIndex + 1}`}
                    fill
                    className="!relative h-full w-auto max-w-full object-contain object-top"
                    unoptimized
                    priority
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-neutral-500 text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <p>No {linkTitle.toLowerCase()} available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation controls for multiple images */}
            {hasMultipleImages && (
              <div className="flex justify-center items-center gap-4 p-4 border-t border-neutral-700 bg-neutral-800/95">
                {/* Previous button */}
                <button
                  onClick={goToPreviousImage}
                  className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer transition-colors duration-200"
                  aria-label="Previous image"
                >
                  <IoChevronBack size={20} />
                </button>

                {/* Dots navigation */}
                <div className="flex justify-center items-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`h-1 transition-all duration-300 ease-out rounded-full ${
                        currentImageIndex === index
                          ? 'w-8 bg-white'
                          : 'w-4 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={goToNextImage}
                  className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer transition-colors duration-200"
                  aria-label="Next image"
                >
                  <IoChevronForward size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      ),
      [
        isOpen,
        handleOverlayClick,
        linkTitle,
        closeModal,
        images,
        currentImageIndex,
        hasMultipleImages,
        goToPreviousImage,
        goToNextImage,
        goToImage,
      ]
    );

    // Only render if mounted (client-side)
    if (!mounted) return null;

    return (
      <>
        {Trigger}
        {createPortal(modalContent, document.body)}
      </>
    );
  }
);

A4Modal.displayName = 'A4Modal';

export default A4Modal;
