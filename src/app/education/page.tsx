'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import EducationItem from '@/components/education/EducationItem';
import { useEducation } from '@/hooks/storage/useEducation';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import EducationMobileItem from '@/components/education/EducationMobileItem';

function EducationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const returnSection = parseInt(searchParams.get('returnTo') || '0');

  // Use the education hook to get data
  const { education: educationItems, loading, error } = useEducation();

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
        const threshold = itemHeight * 0.15; // Fixed threshold back to reasonable value

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
    <>
      <ContentNavbar />

      <section className="h-screen bg-neutral-900 text-white flex flex-col w-full">
        <AboutTitle
          title="About:"
          displayText="Education"
          displayTextClassName="text-neutral-300"
          lineWidth="w-64 md:w-70 lg:w-90"
        />

        {/* Education Gallery */}
        <div className="flex-1 relative min-h-0 flex flex-col">
          {/* Top gradient fade */}
          <div className="md:absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none hidden" />

          {/* Bottom gradient fade */}
          <div className="md:absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

          {/* Mobile Education Items */}
          <div className="flex-1 overflow-y-auto px-8 pb-4 md:hidden pt-4">
            <div className="space-y-4">
              {educationItems.map((education) => (
                <EducationMobileItem
                  id={education.id}
                  startYear={education.startYear}
                  name={education.name}
                  nameShort={education.nameShort}
                  degree={education.degree}
                  specialty={education.specialty}
                  period={education.period}
                  descriptionShort={education.descriptionShort}
                  logoUrl={education.logoUrl}
                  diplomaUrl={education.diplomaUrl}
                  onSelect={education.onSelect}
                  onDeselect={education.onDeselect}
                />
              ))}
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className=" inset-0 flex flex-col overflow-y-auto px-20 py-4 scrollbar-black mx-px hidden md:block bg-red-500"
          >
            {educationItems.map((education, index) => (
              <div
                key={education.id}
                data-education-item
                className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
              >
                <EducationItem
                  id={education.id}
                  startYear={education.startYear}
                  name={education.name}
                  nameShort={education.nameShort}
                  degree={education.degree}
                  specialty={education.specialty}
                  period={education.period}
                  descriptionShort={education.descriptionShort}
                  logoUrl={education.logoUrl}
                  diplomaUrl={education.diplomaUrl}
                  onSelect={education.onSelect}
                  onDeselect={education.onDeselect}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function EducationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EducationPageContent />
    </Suspense>
  );
}
