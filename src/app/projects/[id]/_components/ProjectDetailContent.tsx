'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
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

  // --- Dynamic Height Logic ---
  const contentRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);

  // Calculate both collapsed and expanded heights once content is available
  useEffect(() => {
    if (!project || !contentRef.current || !paragraphRef.current) return;

    const calculateHeights = () => {
      const element = contentRef.current;
      const paragraph = paragraphRef.current;
      if (!element || !paragraph) return;

      // First, measure the collapsed height (with line-clamp-3)
      const collapsed = element.getBoundingClientRect().height;
      setCollapsedHeight(collapsed);

      // Then remove line-clamp to measure expanded height
      paragraph.classList.remove('line-clamp-3');

      // Use requestAnimationFrame to ensure browser has repainted
      requestAnimationFrame(() => {
        const expanded = element.getBoundingClientRect().height;
        setExpandedHeight(expanded);

        console.log('Heights calculated:', { collapsed, expanded });

        // Restore line-clamp
        paragraph.classList.add('line-clamp-3');
      });
    };

    // Initial calculation
    const timer = setTimeout(calculateHeights, 100);

    // Recalculate on window resize
    window.addEventListener('resize', calculateHeights);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateHeights);
    };
  }, [project]);

  const currentMaxHeight = isDescriptionExpanded
    ? expandedHeight
    : collapsedHeight;

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
                  {project.category_name && (
                    <>
                      <span className="text-lg">•</span>
                      <p className="text-lg">{project.category_name}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4 max-w-3xl sm:mb-8">
                <h2 className="text-2xl sm:text-3xl xl:text-pf-lg lg:font-medium text-neutral-200 mb-1 sm:mb-3 lg:mb-3">
                  Description
                </h2>
                <div className="relative">
                  <div className="2xl:hidden">
                    <div
                      style={{
                        maxHeight: `${currentMaxHeight}px`,
                      }}
                      className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                    >
                      <div ref={contentRef}>
                        <p
                          ref={paragraphRef}
                          className={`text-gray-300 text-base leading-relaxed text-base ${
                            !isDescriptionExpanded ? 'line-clamp-3' : ''
                          }`}
                        >
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      {!isDescriptionExpanded &&
                      expandedHeight > collapsedHeight ? (
                        <button
                          onClick={() => setIsDescriptionExpanded(true)}
                          className="text-neutral-400 hover:text-neutral-200 text-sm underline transition-colors"
                        >
                          Read more
                        </button>
                      ) : isDescriptionExpanded &&
                        expandedHeight > collapsedHeight ? (
                        <button
                          onClick={() => setIsDescriptionExpanded(false)}
                          className="text-neutral-400 hover:text-neutral-200 text-sm underline transition-colors"
                        >
                          Close
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="hidden 2xl:block">
                    <p className="text-gray-300 leading-relaxed text-base">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-md mb-6">
                <div className="flex flex-col space-y-3">
                  {projectLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-neutral-100 lg:text-neutral-300 hover:text-white transition-colors py-3 group text-pf-base"
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
