'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ProjectItem from '@/components/projects/ProjectItem';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import { useProjects } from '@/hooks/storage/useProjects';
import { useHorizontalScrollContainer } from '@/hooks/scroll-container/useHorizontalScroll';

function ProjectsPageContent() {
  const [displayText, setDisplayText] = useState<string>('Projects');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();

  const { projects, loading } = useProjects();

  const handleProjectClick = (projectId: string | number) => {
    router.push(`/projects/${projectId}`);
  };

  // Handle project hover for desktop
  const handleProjectHover = (projectName: string | null) => {
    console.log('Hover event fired:', { projectName, isMobile });
    // No need to check isMobile - this handler is only used in desktop layout
    if (projectName) {
      console.log('Setting display text to:', projectName);
      setDisplayText(projectName);
    } else {
      console.log('Resetting display text to Projects');
      setDisplayText('Projects');
    }
  };

  // Projects are already ordered by id DESC from the API
  const allProjects = projects;

  // Use horizontal scroll for all projects
  const { currentItem, containerRef, itemRefs, scrollToItem } =
    useHorizontalScrollContainer({
      totalItems: allProjects.length,
    });

  // Update display text when loading state changes
  useEffect(() => {
    if (loading) {
      setDisplayText('Loading Projects...');
    } else if (allProjects.length > 0) {
      setDisplayText('Projects');
    }
  }, [loading, allProjects.length]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = (): void => {
      const currentlyMobile = window.innerWidth < 1024;
      const wasMobile = isMobile;
      setIsMobile(currentlyMobile);

      // Only update displayText when switching between mobile/desktop
      if (wasMobile !== currentlyMobile) {
        setDisplayText(loading ? 'Loading Projects...' : 'Projects');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [allProjects, currentItem, isMobile, loading]);

  const handleProjectIndicatorClick = (index: number): void => {
    scrollToItem(index);
  };

  // Navigation arrow handlers
  const handlePreviousClick = (): void => {
    const prevIndex =
      currentItem > 0 ? currentItem - 1 : allProjects.length - 1;
    scrollToItem(prevIndex);
  };

  const handleNextClick = (): void => {
    const nextIndex =
      currentItem < allProjects.length - 1 ? currentItem + 1 : 0;
    scrollToItem(nextIndex);
  };

  return (
    <section className="flex flex-col w-full h-full bg-neutral-900 font-metropolis pt-8 lg:pt-4 min-h-screen px-8 lg:px-0 ">
      <ContentNavbar />
      <div className="max-w-page w-full mx-auto">
        <div className="">
          <AboutTitle
            title="About:"
            displayText={displayText}
            displayTextClassName="text-neutral-300"
            removeSpeed={5}
            typeSpeed={10}
          />
        </div>

        {/* Desktop Grid Layout - Only show on lg+ */}
        <div className="hidden lg:flex flex-1 overflow-y-auto relative scrollbar-dark">
          <div className="hidden lg:block absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-40 pointer-events-none " />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

          <div className="hidden lg:flex flex-col flex-1 overflow-y-auto px-8 pt-4 pb-16 lg:px-16 xl:px-28">
            {/* Projects Grid */}
            <div className="flex flex-wrap gap-8 justify-start">
              {allProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex-shrink-0 cursor-pointer"
                  onMouseEnter={() => handleProjectHover(project.name)}
                  onMouseLeave={() => handleProjectHover(null)}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <ProjectItem
                    title={project.name}
                    year={project.year}
                    backgroundImage={project.backgroundUrl}
                    categories={project.categories}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Gallery Layout - Only show below lg */}
        <div className="lg:hidden flex flex-col items-center py-8 mt-8 md:mt-4">
          {/* Horizontal Scroll Gallery for All Projects */}
          <div
            ref={containerRef}
            className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden "
          >
            <div className="flex">
              {allProjects.map((project, index) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="min-w-full flex flex-col"
                >
                  <div className="touch-none flex justify-center flex-col items-center w-full px-4">
                    {/* Project Title - Only show on mobile above the image */}
                    <div className="lg:hidden mb-4 text-left w-full max-w-96 md:max-w-100">
                      <h3 className="text-pf-base font-medium text-neutral-100/88">
                        {project.name}
                      </h3>
                      <p className="text-pf-sm font-medium text-neutral-100/60 -mb-1">
                        {project.year}
                      </p>
                    </div>

                    <ProjectItem
                      title={project.name}
                      year={project.year}
                      backgroundImage={project.backgroundUrl}
                      categories={project.categories}
                      onClick={() => handleProjectClick(project.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls - Like ExperienceGallery - Only on mobile/tablet */}
          <div className="flex justify-center items-center gap-4 py-4">
            {/* Prev button */}
            <button
              onClick={handlePreviousClick}
              disabled={currentItem === 0}
              className={`p-2 rounded-full ${
                currentItem === 0
                  ? 'text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer'
              }`}
              aria-label="Previous project"
            >
              <IoChevronBack size={20} />
            </button>

            {/* Dots */}
            <div className="flex justify-center items-center gap-2">
              {allProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleProjectIndicatorClick(index)}
                  className={`h-1 transition-all duration-300 ease-out rounded-full ${
                    currentItem === index
                      ? 'w-8 bg-white'
                      : 'w-4 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={handleNextClick}
              disabled={currentItem === allProjects.length - 1}
              className={`p-2 rounded-full ${
                currentItem === allProjects.length - 1
                  ? 'text-neutral-600 cursor-not-allowed'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700 hover:cursor-pointer'
              }`}
              aria-label="Next project"
            >
              <IoChevronForward size={20} />
            </button>
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
