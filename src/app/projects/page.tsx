'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ProjectItem from '@/components/projects/ProjectItem';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import { useProjects } from '@/hooks/storage/useProjects';
import { useHorizontalScrollContainer } from '@/hooks/scroll-container/useHorizontalScroll';

function ProjectsPageContent() {
  const [displayText, setDisplayText] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const router = useRouter();

  const { projects } = useProjects();

  const handleProjectClick = (projectId: string | number) => {
    // Handle project click
    router.push(`/projects/${projectId}`);
  };

  // Handle project hover for desktop
  const handleProjectHover = (projectName: string | null) => {
    if (!isMobile) {
      setHoveredProject(projectName);
      if (projectName) {
        setDisplayText(projectName);
      } else {
        // Reset to default text when not hovering
        setDisplayText('Projects');
      }
    }
  };

  // Memoize categorized projects to avoid recalculating on every render
  const { categories, categorizedProjects, allProjects } = useMemo(() => {
    // Group projects by category
    const categorizedProjects = projects.reduce((acc, project) => {
      const categoryName = project.categoryName || 'Uncategorized';

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(project);
      return acc;
    }, {} as Record<string, typeof projects>);

    // Sort projects within each category by year (descending)
    Object.keys(categorizedProjects).forEach((categoryName) => {
      categorizedProjects[categoryName].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      });
    });

    // Sort categories by number of items (descending - most items first)
    const categories = Object.keys(categorizedProjects).sort((a, b) => {
      return categorizedProjects[b].length - categorizedProjects[a].length;
    });

    // Flatten all projects into a single array with category info
    const allProjects = categories.flatMap((categoryName) =>
      categorizedProjects[categoryName].map((project) => ({
        ...project,
        categoryName,
      }))
    );

    return { categories, categorizedProjects, allProjects };
  }, [projects]);

  // Use horizontal scroll for all projects
  const { currentItem, containerRef, itemRefs, scrollToItem } =
    useHorizontalScrollContainer({
      totalItems: allProjects.length,
      updateActiveItem: (itemIndex: number) => {
        // Update category name in AboutTitle when project changes
        const currentProject = allProjects[itemIndex];
        if (currentProject && isMobile) {
          setDisplayText(currentProject.categoryName);
        }
      },
    });

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = (): void => {
      const wasMobile = isMobile;
      const currentlyMobile = window.innerWidth < 768; // md breakpoint

      setIsMobile(currentlyMobile);

      // Handle text changes when switching between mobile and desktop
      if (wasMobile && !currentlyMobile) {
        // Switching from mobile to desktop - show "Projects"
        setDisplayText('Projects');
      } else if (!wasMobile && currentlyMobile && allProjects.length > 0) {
        // Switching from desktop to mobile - show current project's category
        setDisplayText(allProjects[currentItem].categoryName);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile, allProjects, currentItem]);

  // Initialize with first project's category on mobile, or "Projects" on desktop
  useEffect(() => {
    if (isMobile && !displayText && allProjects.length > 0) {
      setDisplayText(allProjects[currentItem].categoryName);
    } else if (!isMobile && !displayText) {
      setDisplayText('Projects');
    }
  }, [isMobile, currentItem, displayText, allProjects]);

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
    <section className="flex flex-col w-full h-full bg-neutral-900 font-metropolis pt-4 h-screen ">
      <ContentNavbar />

      <div className="">
        <AboutTitle
          title="About:"
          displayText={displayText}
          displayTextClassName="text-neutral-300"
          removeSpeed={20}
          typeSpeed={30}
        />
      </div>

      {/* Desktop Grid Layout - Only show on lg+ */}
      <div className="hidden md:flex flex-1 overflow-y-auto relative scrollbar-dark">
        <div className="hidden md:block absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-40 pointer-events-none " />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

        <div className="hidden md:flex flex-col flex-1 overflow-y-auto px-8 pt-4 pb-16 lg:px-16 xl:px-28">
          {categories.map((categoryName) => (
            <div key={categoryName} className="mb-12">
              {/* Category Title */}
              <h2 className="text-pf-xl font-light tracking-wide mb-6 uppercase text-neutral-300">
                {categoryName}
              </h2>

              {/* Projects Grid */}
              <div className="flex flex-wrap gap-8 justify-start">
                {categorizedProjects[categoryName].map((project) => (
                  <div
                    key={project.id}
                    className="flex-shrink-0"
                    onMouseEnter={() => handleProjectHover(project.name)}
                    onMouseLeave={() => handleProjectHover(null)}
                  >
                    <ProjectItem
                      title={project.name}
                      year={project.year}
                      backgroundImage={project.backgroundUrl}
                      onClick={() => handleProjectClick(project.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet Gallery Layout - Only show below lg */}
      <div className="md:hidden flex flex-col items-center  py-8">
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
                className="min-w-full flex flex-col  "
              >
                <div className="touch-none flex justify-center flex-col items-center w-full px-4 ">
                  {/* Project Title - Only show on mobile above the image */}
                  <div className="md:hidden mb-4 text-left w-full  max-w-80">
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
                    content={
                      project.description ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: project.description,
                          }}
                        />
                      ) : undefined
                    }
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
