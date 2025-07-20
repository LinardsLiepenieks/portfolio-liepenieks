'use client';

import { useLoadingContext } from '@/contexts/LoadingContext';

export default function LoadingScreen() {
  const { isLoading } = useLoadingContext();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    </div>
  );
}
