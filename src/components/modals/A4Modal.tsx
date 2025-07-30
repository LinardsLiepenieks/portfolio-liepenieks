'use client';

import React from 'react';
import { IoClose } from 'react-icons/io5'; // or any other close icon you prefer
import AdaptiveIcon from '../ui/utility/AdaptiveIcon';

interface A4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string | null;
}

const A4Modal = ({ isOpen, onClose, image }: A4ModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-8 transition-all duration-500 ease-out ${
        isOpen
          ? 'opacity-100 visible pointer-events-auto bg-black/80'
          : 'opacity-0 invisible pointer-events-none bg-transparent'
      }`}
      onClick={handleOverlayClick}
    >
      <div className="relative bg-neutral-900 border-2 border-gray-600 rounded-xl shadow-2xl max-w-2xl w-full max-h-full overflow-auto">
        {/* Close button positioned absolutely on top of image */}
        <button
          onClick={onClose}
          className="hover:bg-gray-600 hover:cursor-pointer transition-all active:bg-gray-200 duration-300 absolute top-3 right-3 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 flex items-center justify-center"
        >
          <AdaptiveIcon
            type="react-icons"
            component={IoClose}
            size="sm"
            className="text-white"
          />
        </button>

        {/* A4 container with animation - NO transform on image */}
        <div
          className={`w-full transition-all duration-700 ease-out ${
            isOpen ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-1'
          }`}
        >
          <div className="w-full overflow-y-auto overflow-x-hidden">
            <img
              src={
                image ||
                'https://via.placeholder.com/600x849/f3f4f6/6b7280?text=Recommendation+Letter'
              }
              alt="Recommendation Letter"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default A4Modal;
