'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import ReturnButton from '@/components/ui/button/ReturnButton';
import ExperienceItem from '@/components/experience/ExperienceItem';

export default function ExperiencePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnSection = parseInt(searchParams.get('returnTo') || '0');

  const handleGoBack = () => {
    const sectionRoutes = ['/', '/about', '/contact'];
    const targetRoute = sectionRoutes[returnSection];
    const urlWithInstant = `${targetRoute}?instant=true`;
    router.push(urlWithInstant);
  };

  return (
    <section className="h-screen bg-neutral-900 text-white py-8 flex flex-col w-full ">
      {/* Header Row with Back Arrow */}
      <div className="flex items-center pb-6 px-8">
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
      <div className="px-8 md:px-16 lg:px-24 xl:px-36 pb-16">
        <h1 className="text-pf-2xl font-light font-metropolis font-medium">
          About:{' '}
          <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-neutral-400">
            Work <span className="text-neutral-300">(YEAR)</span>
          </span>
        </h1>
      </div>

      {/* Gallery Container */}
      <div className="h-full px-8 md:px-16 lg:px-24 xl:px-36  overflow-hidden">
        <div className="w-full flex-1 h-full flex items-center justify-center  overflow-hidden">
          <ExperienceItem></ExperienceItem>
        </div>
      </div>
    </section>
  );
}
