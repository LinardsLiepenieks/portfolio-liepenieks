'use client';

import { useEffect, useState, memo, useRef } from 'react';
import { useLoading } from '@/contexts/LoadingProvider';

const SquareLoader = memo(() => (
  <div className="relative h-12 w-12 flex items-center justify-center">
    <div className="absolute inset-0 border border-neutral-800" />
    <div className="absolute inset-0 border-t-2 border-white animate-spin-fast" />
    <style jsx global>{`
      @keyframes spin-fast {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .animate-spin-fast {
        animation: spin-fast 0.6s linear infinite;
      }
    `}</style>
  </div>
));

SquareLoader.displayName = 'SquareLoader';

export default function LoadingScreen({ message = 'Loading...' }) {
  const { isLoading } = useLoading();
  const [shouldRender, setShouldRender] = useState(isLoading);

  // 1. Create a "display message" state that won't change during unmounting
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setDisplayMessage(message); // Update message while loading
    } else {
      // 2. We do NOT update displayMessage here.
      // It stays as the last message received until the component unmounts.
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, message]);

  // Keep displayMessage in sync if message changes while still loading
  useEffect(() => {
    if (isLoading) {
      setDisplayMessage(message);
    }
  }, [message, isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-900 transition-opacity duration-500 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <SquareLoader />

        <div className="h-4 mt-8 flex items-center justify-center ml-4">
          <p className="text-neutral-500 text-[10px] tracking-[0.4em] uppercase whitespace-nowrap">
            {displayMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
