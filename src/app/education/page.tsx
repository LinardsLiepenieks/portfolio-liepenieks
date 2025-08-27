'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRef } from 'react';
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

  const [selectedEducationTitle, setSelectedEducationTitle] =
    useState<string>('Education');
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isDesktop, setIsDesktop] = useState(false);
  const hoveringRef = useRef(false);

  // Use the education hook to get data with custom handlers
  const {
    education: educationItems,
    loading,
    error,
  } = useEducation(
    (name: string) => handleEducationSelect(name), // onSelect for mobile
    () => handleEducationDeselect() // onDeselect for mobile
  );

  // Check if we're on desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Animation function
  const clearCurrentInterval = (): void => {
    if (currentInterval) {
      clearInterval(currentInterval);
      setCurrentInterval(null);
    }
  };

  const animateText = (oldText: string, newText: string): void => {
    clearCurrentInterval();

    if (oldText === newText) return;

    // Get the current displayed text instead of the old text parameter
    const currentDisplayedText = selectedEducationTitle;

    // If we're already animating, start from current state
    let currentIndex = currentDisplayedText.length;

    const removeInterval = setInterval(() => {
      currentIndex--;
      if (currentIndex <= 0) {
        clearInterval(removeInterval);
        setSelectedEducationTitle('');

        let typeIndex = 0;
        const typeInterval = setInterval(() => {
          setSelectedEducationTitle(newText.slice(0, typeIndex + 1));
          typeIndex++;
          if (typeIndex >= newText.length) {
            clearInterval(typeInterval);
            setCurrentInterval(null);
          }
        }, 30);
        setCurrentInterval(typeInterval);
      } else {
        setSelectedEducationTitle(currentDisplayedText.slice(0, currentIndex));
      }
    }, 20);
    setCurrentInterval(removeInterval);
  };

  // Handlers for mobile (click-based)
  const handleEducationSelect = (educationName: string) => {
    animateText(selectedEducationTitle, educationName);
  };

  const handleEducationDeselect = () => {
    animateText(selectedEducationTitle, 'Education');
  };

  // Handlers for desktop (hover-based)
  const handleEducationHover = (educationName: string) => {
    if (isDesktop) {
      hoveringRef.current = true;
      animateText(selectedEducationTitle, educationName);
    }
  };

  const handleEducationLeave = () => {
    if (isDesktop) {
      hoveringRef.current = false;
      // Add a small delay to check if we're hovering on another item
      setTimeout(() => {
        if (!hoveringRef.current) {
          animateText(selectedEducationTitle, 'Education');
        }
      }, 50);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (currentInterval) clearInterval(currentInterval);
    };
  }, [currentInterval]);

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
        const threshold = itemHeight * 0.15;

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
          displayText={selectedEducationTitle}
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
                  key={education.id}
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

          {/* Desktop Education Items */}
          <div
            ref={scrollContainerRef}
            className="inset-0 flex flex-col overflow-y-auto px-20 py-4 scrollbar-black mx-px hidden md:block"
          >
            {educationItems.map((education, index) => (
              <div
                key={education.id}
                data-education-item
                className="transition-all duration-500 ease-out [&.animate-left]:transform [&.animate-left]:-translate-x-12 [&.animate-left]:opacity-40"
                onMouseEnter={() => handleEducationHover(education.nameShort)}
                onMouseLeave={handleEducationLeave}
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
                  // Pass null functions for desktop since we handle hover at container level
                  onSelect={() => {}}
                  onDeselect={() => {}}
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
