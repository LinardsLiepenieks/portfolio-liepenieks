'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface A4ModalProps {
  image?: string | null;
  linkTitle?: string;
  children?: React.ReactNode;
  defaultButtonText?: string;
  defaultButtonClassName?: string;
  propagationAllowed?: boolean;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

const A4Modal = ({
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

  const openModal = () => {
    setIsOpen(true);
    onModalOpen?.();
  };

  const closeModal = () => {
    setIsOpen(false);
    onModalClose?.();
  };

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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // Trigger component with conditional propagation control
  const Trigger = () => {
    if (children) {
      if (propagationAllowed) {
        // Original behavior with capture and stopPropagation
        return (
          <div
            onClick={(e) => {
              openModal();
            }}
            onClickCapture={(e) => {
              openModal();
              e.stopPropagation();
            }}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
              }
            }}
          >
            {children}
          </div>
        );
      } else {
        // Clean behavior without event interference
        return (
          <div
            onClick={openModal}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
              }
            }}
          >
            {children}
          </div>
        );
      }
    }

    return (
      <button
        onClick={openModal}
        className={defaultButtonClassName}
        type="button"
      >
        {defaultButtonText}
      </button>
    );
  };

  // Modal content
  const modalContent = (
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
            className="text-white  text-sm md:text-lg font-medium tracking-wide font-metropolis"
          >
            {linkTitle}
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
          {image ? (
            <div className="w-full min-h-full flex justify-center">
              <Image
                src={image}
                alt={linkTitle}
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
      </div>
    </div>
  );

  // Only render if mounted (client-side)
  if (!mounted) return null;

  return (
    <>
      <Trigger />
      {createPortal(modalContent, document.body)}
    </>
  );
};

export default A4Modal;
