'use client';

import { Suspense } from 'react';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import ExperienceGallery from '@/components/experience/ExperienceGallery';
import ExperienceMobileItem from '@/components/experience/ExperienceMobileItem';
import { useExperience } from '@/hooks/storage/useExperience';

function ExperiencePageContent() {
  const { experiences, loading, error } = useExperience();

  // Helper function to get avatar letter from title
  const getAvatarLetter = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  // Helper function to generate avatar background
  const getAvatarBg = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600',
    ];
    return gradients[index % gradients.length];
  };

  // Loading state
  if (loading) {
    return (
      <>
        <ContentNavbar />
        <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
          <div className="flex-shrink-0 pt-8 pb-8">
            <AboutTitle
              title="About:"
              displayText="Experience"
              className=""
              displayTextClassName="text-neutral-300"
              lineWidth="w-64 md:w-70 lg:w-90"
            />
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="animate-pulse text-neutral-400">
              Loading experiences...
            </div>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <ContentNavbar />
        <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
          <div className="flex-shrink-0 pt-8 pb-8">
            <AboutTitle
              title="About:"
              displayText="Experience"
              className=""
              displayTextClassName="text-neutral-300"
              lineWidth="w-64 md:w-70 lg:w-90"
            />
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="text-red-400">
              Error loading experiences: {error}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* ContentNavbar - fixed positioned */}
      <ContentNavbar />

      {/* Main content container - full viewport height minus navbar */}
      <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
        {/* Title Section - fixed height */}
        <div className="flex-shrink-0 pt-8 pb-8">
          <AboutTitle
            title="About:"
            displayText="Experience"
            className=""
            displayTextClassName="text-neutral-300"
            lineWidth="w-64 md:w-70 lg:w-90"
          />
        </div>

        {/* Scrollable content area - takes remaining space */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Mobile Experience Items - scrollable */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 md:hidden">
            <div className="space-y-4">
              {experiences.map((experience, index) => (
                <ExperienceMobileItem
                  key={experience.id}
                  title={experience.title}
                  position={experience.title} // You might want to split this into separate fields
                  period={`${experience.start_year}-${experience.end_year}`}
                  description={experience.description_short}
                  avatar={getAvatarLetter(experience.title)}
                  avatarBg={getAvatarBg(index)}
                />
              ))}
            </div>
          </div>

          {/* Desktop Experience Gallery */}
          <div className="flex-1 min-h-0 hidden md:block">
            <ExperienceGallery experienceItems={experiences} />
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
