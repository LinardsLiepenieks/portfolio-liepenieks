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

type LinkObj = { name?: string; url?: string; href?: string; link?: string };
type ExtendedProject = ProjectItemType & {
  links?: LinkObj[];
  homepage?: string;
  website?: string;
  github_url?: string;
  source_url?: string;
  client_url?: string;
};

export default function ProjectDetailContent({
  project,
  projectImages,
}: ProjectDetailContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        // Measure if content exceeds the 3-line height clamp
        const isOverflowing =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setShowButton(isOverflowing);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [project.description]);

  const pdata = project as ExtendedProject;

  const projectLinks = useMemo(() => {
    const links: { name: string; url: string; icon: React.ReactNode }[] = [];
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
        (normalized.includes('github.com') ? <FiGithub /> : <FiExternalLink />);
      links.push({ name, url: normalized, icon });
    };
    pushLink('GitHub Repository', pdata?.github_url);
    if (pdata?.source_url) pushLink('Live demo', pdata.source_url, <CiGlobe />);
    if (pdata?.client_url) pushLink('Client', pdata.client_url, <FiUser />);
    if (pdata?.links) {
      pdata.links.forEach((l) => {
        const url = l.url ?? l.href ?? l.link;
        const name =
          l.name ??
          (url?.includes('github.com') ? 'GitHub Repository' : 'Source');
        pushLink(name, url);
      });
    }
    pushLink('Project Homepage', pdata?.homepage ?? pdata?.website);
    return links;
  }, [pdata]);

  const imageObjects = useMemo(() => {
    return (projectImages ?? [])
      .map((im) => ({
        src: im.project_image ?? im.image_url ?? im.url,
        caption: im.caption ?? undefined,
      }))
      .filter((x) => typeof x.src === 'string') as {
      src: string;
      caption?: string;
    }[];
  }, [projectImages]);

  return (
    <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis overflow-y-auto scrollbar-dark">
      <ContentNavbar customReturnRoute="/projects" />

      <div className="flex-1 relative pt-16 lg:pt-20 max-w-page w-full mx-auto">
        <div className="px-6 pt-12 md:pt-8 pb-16 md:px-12 xl:px-16">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left column */}
            <div className="xl:w-1/2">
              <div className="mb-8 sm:mb-12 lg:mb-10 xl:mb-8">
                <h1 className="text-4xl lg:text-pf-2xl xl:text-pf-3xl font-light tracking-wide mb-2 lg:mb-3.5 text-neutral-100">
                  {project.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-neutral-400">
                  <p className="text-lg">{project.year}</p>
                  {project.categories?.length ? (
                    <>
                      <span className="text-lg">•</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        {project.categories.map((cat, i) => (
                          <React.Fragment key={cat.id}>
                            <p className="text-lg">{cat.name}</p>
                            {i < project.categories!.length - 1 && (
                              <span className="text-lg">,</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-4 max-w-3xl sm:mb-6 md:mb-6 lg:mb-10">
                <h2 className="text-2xl sm:text-3xl xl:text-pf-lg font-medium text-neutral-200 mb-3">
                  Description
                </h2>

                <div className="relative">
                  {/* Grid transition active up to 2xl breakpoint */}
                  <div
                    className={`2xl:block grid-transition ${
                      isExpanded ? 'grid-expanded' : 'grid-collapsed'
                    }`}
                  >
                    <div className="overflow-hidden 2xl:overflow-visible">
                      <p
                        ref={contentRef}
                        className={`text-gray-300 text-base leading-relaxed ${
                          !isExpanded
                            ? 'line-clamp-3 2xl:line-clamp-none'
                            : 'line-clamp-none'
                        }`}
                      >
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Button strictly hidden on 2xl and above */}
                  {showButton && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="2xl:hidden mt-2 text-neutral-400 hover:text-neutral-200 text-sm underline transition-colors hover:cursor-pointer"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="max-w-md mb-8 sm:mb-10 md:mb-12 lg:mb-10">
                <div className="flex flex-col space-y-4">
                  {projectLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-neutral-300 hover:text-white transition-colors group md:text-pf-base"
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span className="group-hover:underline">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Gallery (Hidden on XL+) */}
              <div className="xl:hidden mb-8 sm:mb-12">
                <ProjectGallery
                  backgroundUrl={pdata?.background_url}
                  logoUrl={pdata?.logo_url}
                  images={imageObjects}
                />
              </div>

              {/* Stack */}
              <div className="mb-10">
                <h2 className="text-pf-base sm:text-pf-lg text-neutral-200 mb-5 font-medium">
                  Stack
                </h2>
                <div className="flex flex-wrap gap-4 sm:gap-8 lg:gap-6 2xl:gap-8">
                  {project.technologies?.map((tech) => (
                    <ProjectTechnology key={tech.id} technology={tech} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Desktop Gallery (Visible only on xl+) */}
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
