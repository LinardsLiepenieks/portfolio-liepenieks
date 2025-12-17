'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { FiGithub, FiExternalLink, FiUser } from 'react-icons/fi';
import { CiGlobe } from 'react-icons/ci';
import ContentNavbar from '@/components/ui/ContentNavbar';
import { ProjectItemType } from '@/types/ProjectItemType';
import { ProjectImageType } from '@/types/ProjectImageType';
import ProjectTechnology from '@/components/projects/ProjectTechnology';
import ProjectGallery from '@/components/projects/ProjectGallery';

interface ProjectDetailContentProps {
  project: ProjectItemType;
  projectImages: ProjectImageType[];
}

// Strongly-typed flexible project data for optional fields we use here
type LinkObj = { name?: string; url?: string; href?: string; link?: string };
type ExtendedProject = ProjectItemType & {
  links?: LinkObj[];
  homepage?: string;
  website?: string;
  github_url?: string;
  source_url?: string;
  client_url?: string;
};

type CandidateField =
  | 'github_url'
  | 'repository_url'
  | 'repo_url'
  | 'demo_url'
  | 'live_url'
  | 'url'
  | 'project_url'
  | 'link';

export default function ProjectDetailContent({
  project,
  projectImages,
}: ProjectDetailContentProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Dynamic Height Logic ---
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);

  // Calculate both collapsed and expanded heights once content is available
  useEffect(() => {
    if (!project || !contentRef.current || !containerRef.current) return;

    const calculateHeights = () => {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!content || !container) return;

      // First measure collapsed height (with line-clamp-3)
      content.style.webkitLineClamp = '3';
      const collapsed = content.scrollHeight;

      // Then measure expanded height (without line-clamp)
      content.style.webkitLineClamp = 'unset';
      const expanded = content.scrollHeight;

      // Reset back to collapsed state
      content.style.webkitLineClamp = '3';

      setExpandedHeight(expanded);
      setCollapsedHeight(collapsed);
      setShouldShowButton(expanded > collapsed);

      // Set the initial collapsed height immediately
      container.style.height = `${collapsed}px`;

      setIsInitialized(true);

      console.log('Heights calculated:', { collapsed, expanded });
    };

    // Initial calculation with a small delay to ensure content is rendered
    const timer = setTimeout(calculateHeights, 50);

    // Recalculate on window resize
    window.addEventListener('resize', calculateHeights);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateHeights);
    };
  }, [project]);

  // Handle smooth height animation with JavaScript
  const toggleDescription = () => {
    if (
      !containerRef.current ||
      collapsedHeight === null ||
      expandedHeight === null
    )
      return;

    const container = containerRef.current;
    const startHeight = isDescriptionExpanded
      ? expandedHeight
      : collapsedHeight;
    const endHeight = isDescriptionExpanded ? collapsedHeight : expandedHeight;

    // Set starting height
    container.style.height = `${startHeight}px`;

    // Force reflow
    container.offsetHeight;

    // Add transition
    container.style.transition = 'height 400ms cubic-bezier(0.4, 0, 0.2, 1)';

    // Set end height
    requestAnimationFrame(() => {
      container.style.height = `${endHeight}px`;
    });

    // Update line-clamp on content
    if (contentRef.current) {
      if (isDescriptionExpanded) {
        contentRef.current.style.webkitLineClamp = '3';
      } else {
        contentRef.current.style.webkitLineClamp = 'unset';
      }
    }

    // Toggle state
    setIsDescriptionExpanded(!isDescriptionExpanded);

    // Clean up transition after animation completes
    const cleanup = setTimeout(() => {
      if (container) {
        container.style.transition = '';
        // Only set to 'auto' if expanded, keep fixed height if collapsed
        if (!isDescriptionExpanded) {
          container.style.height = 'auto';
        }
      }
    }, 400);

    return () => clearTimeout(cleanup);
  };

  const pdata = project as ExtendedProject;

  // Build project links from the loaded project data
  const projectLinks: { name: string; url: string; icon: React.ReactNode }[] =
    [];
  const seen = new Set<string>();

  const pushLink = (
    name: string,
    url?: string | null,
    iconOverride?: React.ReactNode
  ) => {
    if (!url) return;
    const normalized = String(url).trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    const icon =
      iconOverride ??
      ((name && name.toLowerCase().includes('github')) ||
      normalized.includes('github.com') ? (
        <FiGithub />
      ) : (
        <FiExternalLink />
      ));
    projectLinks.push({ name, url: normalized, icon });
  };

  pushLink('GitHub Repository', pdata?.github_url);
  pushLink(
    'Live demo',
    pdata?.source_url,
    pdata?.source_url ? <CiGlobe /> : undefined
  );
  pushLink(
    'Client',
    pdata?.client_url,
    pdata?.client_url ? <FiUser /> : undefined
  );

  // Process links array
  if (pdata?.links && Array.isArray(pdata.links)) {
    pdata.links.forEach((l: LinkObj) => {
      const url = l.url ?? l.href ?? l.link;
      const name =
        l.name ??
        (url && url.includes('github.com') ? 'GitHub Repository' : 'Source');
      pushLink(name, url);
    });
  }

  const candidates: { field: CandidateField; name: string }[] = [
    { field: 'github_url', name: 'GitHub Repository' },
    { field: 'repository_url', name: 'Repository' },
    { field: 'repo_url', name: 'Repository' },
    { field: 'demo_url', name: 'Live Demo' },
    { field: 'live_url', name: 'Live Demo' },
    { field: 'url', name: 'Project Link' },
    { field: 'project_url', name: 'Project Link' },
    { field: 'link', name: 'Project Link' },
  ];

  function getCandidateField(
    p: ExtendedProject,
    field: CandidateField
  ): string | undefined {
    const record = p as unknown as Record<CandidateField, string | undefined>;
    return record[field];
  }

  candidates.forEach((c) => {
    pushLink(c.name, getCandidateField(pdata, c.field));
  });

  pushLink('Project Homepage', pdata?.homepage ?? pdata?.website);

  const imageObjects = useMemo(() => {
    const mapped =
      projectImages?.map((im: ProjectImageType) => ({
        src: im.project_image ?? im.image_url ?? im.url,
        caption: im.caption ?? undefined,
      })) ?? [];

    return mapped.filter((x) => typeof x.src === 'string') as {
      src: string;
      caption?: string;
    }[];
  }, [projectImages]);

  return (
    <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis overflow-y-auto scrollbar-dark">
      <ContentNavbar customReturnRoute="/projects" />

      <div className="flex-1  relative  pt-16 lg:pt-20 max-w-page w-full mx-auto">
        <div className="px-6 pt-12 md:pt-8 pb-16 md:px-12 xl:px-28">
          <div className="flex flex-col xl:flex-row gap-8 ">
            {/* Left column */}
            <div className="xl:w-1/2">
              <div className="mb-8 sm:mb-12 ">
                <h1 className="text-4xl sm:text-pf-2xl text-4xl xl:text-pf-3xl  font-light tracking-wide mb-2 lg:mb-6 xl:mb-4 text-neutral-100">
                  {project.name}
                </h1>

                <div className="flex flex-wrap gap-4 text-neutral-400">
                  <p className="text-lg">{project.year}</p>

                  {/* Display multiple categories */}
                  {project.categories && project.categories.length > 0 && (
                    <>
                      <span className="text-lg">•</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        {project.categories.map((category, index) => (
                          <React.Fragment key={category.id}>
                            <p className="text-lg">{category.name}</p>
                            {index < project.categories!.length - 1 && (
                              <span className="text-lg">,</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4 max-w-3xl sm:mb-12">
                <h2 className="text-2xl sm:text-3xl xl:text-pf-lg lg:font-medium text-neutral-200 mb-1 sm:mb-3 lg:mb-3">
                  Description
                </h2>
                <div className="relative">
                  <div className="2xl:hidden">
                    <div
                      ref={containerRef}
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <p
                        ref={contentRef}
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 3,
                          overflow: 'hidden',
                        }}
                        className="text-gray-300 text-base leading-relaxed"
                      >
                        {project.description}
                      </p>
                    </div>

                    {shouldShowButton && (
                      <div className="mt-2">
                        <button
                          onClick={toggleDescription}
                          className="text-neutral-400 hover:text-neutral-200 text-sm underline transition-colors"
                        >
                          {isDescriptionExpanded ? 'Close' : 'Read more'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="hidden 2xl:block">
                    <p className="text-gray-300 leading-relaxed text-base">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-md mb-12">
                <div className="flex flex-col space-y-4">
                  {projectLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-neutral-100 lg:text-neutral-300 hover:text-white transition-colors group text-pf-base"
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span className="group-hover:underline">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Gallery on mobile */}
              <div className="xl:hidden mb-8 sm:mb-12 lg:mb-8">
                <ProjectGallery
                  backgroundUrl={pdata?.background_url}
                  logoUrl={pdata?.logo_url}
                  images={imageObjects}
                />
              </div>

              <div className="mb-10">
                <h2 className="text-pf-base sm:text-pf-lg text-neutral-200 mb-2 lg:mb-5 font-medium">
                  Stack
                </h2>
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-4 lg:gap-8">
                    {project.technologies.map((tech) => (
                      <ProjectTechnology key={tech.id} technology={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-400">
                    No technologies listed for this project
                  </p>
                )}
              </div>
            </div>

            {/* Right column: gallery - desktop only */}
            <div className="hidden xl:flex xl:w-1/2 flex-col items-center justify-start mt-4">
              <ProjectGallery
                backgroundUrl={pdata?.background_url}
                logoUrl={pdata?.logo_url}
                images={imageObjects}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
