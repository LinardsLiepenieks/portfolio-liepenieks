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
  const [isDesktop, setIsDesktop] = useState(false);

  // Debug logging
  useEffect(() => {}, [selectedExperienceTitle]);

  // Check if we're on desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Only manage mobile state - desktop is handled by ExperienceGallery
  useEffect(() => {
    if (!isDesktop) {
      setSelectedExperienceTitle('Experience');
    }
    // Desktop: Do nothing - ExperienceGallery will handle it
  }, [isDesktop]);

  const handleExperienceSelect = (experienceTitle: string) => {
    setSelectedExperienceTitle(experienceTitle);
  };

  const handleExperienceDeselect = () => {
    setSelectedExperienceTitle('Experience');
  };

  return (
    <>
      <ContentNavbar />
      <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
        <AboutTitle
          title="About:"
          displayText={selectedExperienceTitle}
          displayTextClassName="text-neutral-300"
        />

        <div className="flex-1 min-h-0 flex flex-col">
          {/* Mobile Experience Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-4 md:hidden pt-4 scrollbar-dark">
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
