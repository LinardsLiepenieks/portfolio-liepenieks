'use client';

import { Suspense } from 'react';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import ExperienceGallery from '@/components/experience/ExperienceGallery';
import ExperienceMobileItem from '@/components/experience/ExperienceMobileItem';

function ExperiencePageContent() {
  // Example experience items - replace with your actual data
  const experienceItems = [
    { id: 1 /* your experience data */ },
    { id: 2 /* your experience data */ },
    { id: 3 /* your experience data */ },
    { id: 4 /* your experience data */ },
    { id: 5 /* your experience data */ },
  ];

  return (
    <>
      {/* ContentNavbar - fixed positioned */}
      <ContentNavbar />

      {/* Main content container - full viewport height minus navbar */}
      <section className="h-screen  bg-neutral-900 text-white flex flex-col w-full overflow-hidden ">
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
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
              <ExperienceMobileItem
                title="Bezrindas.lv"
                position="Frontend Developer"
                period="2025-2025"
                description="Passionate frontend developer specializing in modern web technologies..."
                avatar="B"
                avatarBg="bg-gradient-to-br from-blue-500 to-indigo-600"
              />
            </div>
          </div>

          {/* Desktop Experience Gallery */}
          <div className="flex-1 min-h-0 hidden md:block">
            <ExperienceGallery experienceItems={experienceItems} />
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
