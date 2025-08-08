'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import ReturnButton from '@/components/ui/button/ReturnButton';
import EducationItem from '@/components/education/EducationItem';
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

  // Example experience items - replace with your actual data

  return (
    <section className="h-screen bg-neutral-900 text-white py-8 flex flex-col w-full">
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
      <div className="px-8 md:px-16 lg:px-24 xl:px-36 pb-8">
        <h1 className="text-pf-2xl font-light font-metropolis font-medium">
          About:{' '}
          <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-neutral-400">
            Education
          </span>
        </h1>
      </div>
      {/* Experience Gallery */}
      <div className="flex   flex-1 flex-col min-h-0 overflow-y-auto px-20 py-2 scrollbar-dark mx-px">
        <EducationItem></EducationItem>
        <EducationItem></EducationItem>
        <EducationItem></EducationItem>
        <EducationItem></EducationItem>
        <EducationItem></EducationItem>
        <EducationItem></EducationItem>
        <EducationItem></EducationItem>
      </div>
    </section>
  );
}
