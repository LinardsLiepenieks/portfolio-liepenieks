'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import ReturnButton from '@/components/ui/button/ReturnButton';

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnSection = parseInt(searchParams.get('returnTo') || '0');

  const handleGoBack = () => {
    const sectionRoutes = ['/', '/about', '/contact'];
    const targetRoute = sectionRoutes[returnSection];

    // Add instant=true parameter to signal instant scroll
    const urlWithInstant = `${targetRoute}?instant=true`;

    router.push(urlWithInstant);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header Row with Back Arrow */}
      <div className="flex items-center p-6">
        <ReturnButton
          icon={{
            type: 'react-icons',
            component: IoArrowBack,
          }}
          size="xl"
          onClick={handleGoBack}
          className="flex-shrink-0"
        />
      </div>

      {/* Title Row */}
      <div className="px-6 pb-6">
        <h1 className="text-2xl font-light">
          About: Work <span className="text-neutral-400">(YEAR)</span>
        </h1>
      </div>

      {/* Gallery Container - Takes remaining height */}
      <div className="flex-1 px-6 pb-6">
        <div className="h-full bg-neutral-800 rounded-lg border border-neutral-700">
          {/* Gallery component will go here */}
          <div className="flex items-center justify-center h-full text-neutral-400">
            Gallery component placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
