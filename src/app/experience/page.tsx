'use client';

import { Suspense, useState, useEffect } from 'react';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import ExperienceGallery from '@/components/experience/ExperienceGallery';
import ExperienceMobileItem from '@/components/experience/ExperienceMobileItem';
import { useExperience } from '@/hooks/storage/useExperience';

function ExperiencePageContent() {
  const { experiences } = useExperience();
  const [selectedExperienceTitle, setSelectedExperienceTitle] =
    useState<string>('Experience');
  const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [hasSetInitialTitle, setHasSetInitialTitle] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    // Only set initial title on desktop and if we haven't set it yet
    if (!hasSetInitialTitle && experiences.length > 0 && isDesktop) {
      animateText('Experience', experiences[0].title);
      setHasSetInitialTitle(true);
    }
  }, [experiences, hasSetInitialTitle, isDesktop]);

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

    let currentIndex = oldText.length;
    const removeInterval = setInterval(() => {
      setSelectedExperienceTitle(oldText.slice(0, currentIndex - 1));
      currentIndex--;
      if (currentIndex <= 0) {
        clearInterval(removeInterval);

        let typeIndex = 0;
        const typeInterval = setInterval(() => {
          setSelectedExperienceTitle(newText.slice(0, typeIndex + 1));
          typeIndex++;
          if (typeIndex >= newText.length) {
            clearInterval(typeInterval);
            setCurrentInterval(null);
          }
        }, 30);
        setCurrentInterval(typeInterval);
      }
    }, 20);
    setCurrentInterval(removeInterval);
  };

  const handleExperienceSelect = (experienceTitle: string) => {
    animateText(selectedExperienceTitle, experienceTitle);
  };

  const handleExperienceDeselect = () => {
    animateText(selectedExperienceTitle, 'Experience');
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (currentInterval) clearInterval(currentInterval);
    };
  }, [currentInterval]);

  return (
    <>
      <ContentNavbar />
      <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
        <AboutTitle
          title="About:"
          displayText={selectedExperienceTitle}
          displayTextClassName="text-neutral-300"
          lineWidth="w-64 md:w-70 lg:w-90"
        />

        <div className="flex-1 min-h-0 flex flex-col">
          {/* Mobile Experience Items */}
          <div className="flex-1 overflow-y-auto px-8 pb-4 md:hidden pt-4">
            <div className="space-y-4">
              {experiences.map((experience) => (
                <ExperienceMobileItem
                  key={experience.id}
                  id={experience.id}
                  title={experience.title}
                  position={experience.position}
                  period={experience.period}
                  description={experience.descriptionShort}
                  logoUrl={experience.logoUrl}
                  recommendationUrl={experience.recommendationUrl}
                  onSelect={() => handleExperienceSelect(experience.title)}
                  onDeselect={handleExperienceDeselect}
                  linkTitle={experience.linkTitle}
                />
              ))}
            </div>
          </div>

          {/* Desktop Experience Gallery */}
          <div className="flex-1 min-h-0 hidden md:block my-2">
            <ExperienceGallery
              experienceItems={experiences}
              onSelectExperience={handleExperienceSelect}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default function ExperiencePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExperiencePageContent />
    </Suspense>
  );
}
