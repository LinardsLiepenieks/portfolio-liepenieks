'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import ReturnButton from '@/components/ui/button/ReturnButton';
import ProjectItem from '@/components/projects/ProjectItem';

function ProjectsPageContent() {
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

  const handleProjectClick = (projectId: string) => {
    // Handle project click - navigate to project detail or open modal
    console.log('Project clicked:', projectId);
  };

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
      <div className="px-8 md:px-16 lg:px-24 xl:px-36 pb-12">
        <h1 className="text-pf-2xl font-light font-metropolis font-medium">
          About:{' '}
          <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-neutral-400">
            Projects
          </span>
        </h1>
      </div>

      <div className="px-20  scrollbar-hidden flex relative flex-1 min-h-0">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none opacity-40" />

        <div
          className="overflow-y-auto flex-1 min-h-0 scrollbar-hidden"
          ref={scrollContainerRef}
        >
          <h2 className="text-pf-2xl font-light tracking-wide mb-4">WEB</h2>
          <div className="flex flex-wrap gap-4 pb-16">
            <ProjectItem
              title="Project Name"
              year="2024"
              content={
                <>
                  sdfdsfdsf
                  <br />
                  dsfgdfgdfg
                </>
              }
              onClick={() => handleProjectClick('project-1')}
            />
            {/* Add more projects as needed */}
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
            <ProjectItem
              title="Another Project"
              year="2023"
              onClick={() => handleProjectClick('project-2')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}
