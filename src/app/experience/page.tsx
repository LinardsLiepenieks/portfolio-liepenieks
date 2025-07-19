// app/details/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Details Page</h1>
        <p className="text-lg mb-6">
          This is a separate page outside the scroll container
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
        >
          ← Back to Section {returnSection + 1}
        </button>
      </div>
    </div>
  );
}
