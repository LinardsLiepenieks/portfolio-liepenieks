'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface A4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string | null;
  linkTitle?: string;
}

const A4Modal = ({
  isOpen,
  onClose,
  image,
  linkTitle = 'Recommendation Letter',
}: A4ModalProps) => {
  const [mounted, setMounted] = useState(false);

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
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

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
        className={`shadow-2xl max-w-4xl w-full max-h-[90vh] bg-neutral-800/95 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 ease-out flex flex-col ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-700 flex-shrink-0">
          <h2
            id="modal-title"
            className="text-white text-lg font-medium tracking-wide font-metropolis"
          >
            {linkTitle}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-neutral-700 transition-colors duration-200 text-neutral-400 hover:text-white rounded-full p-2 flex items-center justify-center"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden bg-neutral-900 flex items-center justify-center min-h-0">
          {image ? (
            <div className="w-full h-full p-4 flex items-center justify-center">
              <Image
                src={image}
                alt={linkTitle}
                width={800}
                height={1132}
                className="max-w-full max-h-full w-auto h-auto object-contain"
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

  // Only render if mounted (client-side) and return portal
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default A4Modal;
