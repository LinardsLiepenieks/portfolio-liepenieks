'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import ReturnButton from '@/components/ui/button/ReturnButton';
import EducationItem from '@/components/education/EducationItem';

export default function ExperiencePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const returnSection = parseInt(searchParams.get('returnTo') || '0');

  const handleGoBack = () => {
    const sectionRoutes = ['/', '/about', '/contact'];
    const targetRoute = sectionRoutes[returnSection];
    const urlWithInstant = `${targetRoute}?instant=true`;
    router.push(urlWithInstant);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const items = scrollContainer.querySelectorAll('[data-education-item]');

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemTop = itemRect.top;
        const itemHeight = itemRect.height;

        // Check if item is hitting the top of the scroll container
        const distanceFromTop = itemTop - containerTop;
        const threshold = itemHeight * 0.0000000005; // Trigger when 1.5% of item is above container top

        if (distanceFromTop <= threshold) {
          // Add class to trigger CSS animation
          (item as HTMLElement).classList.add('animate-left');
        } else {
          // Remove class to reset position
          (item as HTMLElement).classList.remove('animate-left');
        }
      });
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="h-screen bg-neutral-900 text-white pt-8 flex flex-col w-full">
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
      <div className="px-8 md:px-16 lg:px-24 xl:px-36 pb-4">
        <h1 className="text-pf-2xl font-light font-metropolis font-medium">
          About:{' '}
          <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-neutral-400">
            Education
          </span>
        </h1>
      </div>

      {/* Education Gallery */}
      <div className="flex-1 relative min-h-0 ">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none" />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="absolute inset-0 flex flex-col overflow-y-auto px-20 py-4 scrollbar-black mx-px "
        >
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
          <div
            data-education-item
            className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
          >
            <EducationItem />
          </div>
        </div>
      </div>
    </section>
  );
}
