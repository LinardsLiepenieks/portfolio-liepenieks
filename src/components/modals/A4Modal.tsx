'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import AdaptiveIcon from '../ui/utility/AdaptiveIcon';

interface A4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string | null;
}

const A4Modal = ({ isOpen, onClose, image }: A4ModalProps) => {
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

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-8 transition-all duration-400 ease-out ${
        isOpen
          ? 'opacity-100 visible pointer-events-auto bg-black/80'
          : 'opacity-0 invisible pointer-events-none bg-transparent'
      }`}
      onClick={handleOverlayClick}
    >
      <div className="shadow-2xl max-w-2xl rounded-sm h-full w-full bg-neutral-600/40 p-2">
        <div className="relative h-full overflow-hidden">
          {/* Close button positioned absolutely on top of image */}
          <button
            onClick={onClose}
            className="hover:bg-gray-600 hover:cursor-pointer transition-all active:bg-gray-200 duration-300 absolute top-1 right-5 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 flex items-center justify-center"
          >
            <AdaptiveIcon
              type="react-icons"
              component={IoClose}
              size="sm"
              className="text-white"
            />
          </button>

          {/* A4 container with animation */}
          <div className="w-full transition-all duration-300 ease-out h-full rounded-sm overflow-hidden">
            <div className="w-full overflow-y-auto overflow-x-hidden h-full scrollbar-dark">
              <Image
                src={
                  image ||
                  'https://via.placeholder.com/600x849/f3f4f6/6b7280?text=Recommendation+Letter'
                }
                alt="Recommendation Letter"
                width={600}
                height={849}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Only render if mounted (client-side) and return portal
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default A4Modal;
