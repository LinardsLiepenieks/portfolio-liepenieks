// app/projects/[id]/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import ContentNavbar from '@/components/ui/ContentNavbar';
import { useProject } from '@/hooks/storage/useProject';
import { ProjectItemType } from '@/types/ProjectItemType';
import ProjectTechnology from '@/components/projects/ProjectTechnology';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : '';
  // Use the project hook to fetch details
  const { project, loading, error } = useProject(projectId);
  console.log(project);

  // Strongly-typed flexible project data for optional fields we use here
  type LinkObj = { name?: string; url?: string; href?: string; link?: string };
  type ExtendedProject = ProjectItemType & {
    links?: LinkObj[];
    homepage?: string;
    website?: string;
    github_url?: string;
    source_url?: string;
  };

  const pdata = project as ExtendedProject | null;

  // Build project links from the loaded project data (avoid dummy hardcoded links)
  const projectLinks: { name: string; url: string; icon: React.ReactNode }[] =
    [];
  const seen = new Set<string>();

  const pushLink = (name: string, url?: string | null) => {
    if (!url) return;
    const normalized = String(url).trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    // Prefer explicit field names first (github/source), otherwise fall back to heuristics
    const icon =
      (name && name.toLowerCase().includes('github')) ||
      normalized.includes('github.com') ? (
        <FiGithub />
      ) : (
        <FiExternalLink />
      );
    projectLinks.push({ name, url: normalized, icon });
  };

  // Prefer explicit fields if present (show these links based on these attributes)
  pushLink('GitHub Repository', pdata?.github_url);
  pushLink('Live demo', pdata?.source_url);

  // --- Gallery images and rotation logic -------------------------------------------------
  const images = useMemo(() => {
    const list: string[] = [];
    if (pdata?.background_url) list.push(pdata.background_url);
    if (pdata?.logo_url) list.push(pdata.logo_url);

    // Fill with placeholder images so gallery has several items (dummy generation)
    const placeholders = [
      'https://picsum.photos/seed/1/1200/900',
      'https://picsum.photos/seed/2/1200/900',
      'https://picsum.photos/seed/3/1200/900',
      'https://picsum.photos/seed/4/1200/900',
      'https://picsum.photos/seed/5/1200/900',
    ];

    let i = 0;
    while (list.length < 5 && i < placeholders.length) {
      if (!list.includes(placeholders[i])) list.push(placeholders[i]);
      i += 1;
    }

    // Ensure there's at least one image
    return list.length > 0 ? list : placeholders;
  }, [pdata?.background_url, pdata?.logo_url]);

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (images.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 8000) as unknown as number;
  };

  useEffect(() => {
    // Reset active to first image when image list changes
    setActiveIndex(0);
    startTimer();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join('|')]);

  const onThumbnailClick = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };
  // --------------------------------------------------------------------------------------

  // If project has an explicit links array
  if (pdata?.links && Array.isArray(pdata.links)) {
    pdata.links.forEach((l: LinkObj) => {
      const url = l.url ?? l.href ?? l.link;
      const name =
        l.name ??
        (url && url.includes('github.com') ? 'GitHub Repository' : 'Source');
      pushLink(name, url);
    });
  }

  // Common single-field properties to check
  type CandidateField =
    | 'github_url'
    | 'repository_url'
    | 'repo_url'
    | 'demo_url'
    | 'live_url'
    | 'url'
    | 'project_url'
    | 'link';

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

  candidates.forEach((c) => {
    // project shape may vary; use typed indexing
    pushLink(c.name, (pdata as any)?.[c.field] as string | undefined);
  });

  // Fallbacks
  pushLink('Project Homepage', pdata?.homepage ?? pdata?.website);

  // Handle case where projectId is empty
  if (!projectId) {
    return (
      <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis pt-8">
        <ContentNavbar customReturnRoute="/projects" />
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-300">
          <h2 className="text-2xl mb-4">Invalid project ID</h2>
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-neutral-300 hover:text-white"
          >
            <IoChevronBack size={20} />
            Back to Projects
          </button>
        </div>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis">
        <ContentNavbar customReturnRoute="/projects" />
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-300">
          <h2 className="text-2xl">Loading project details...</h2>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis pt-8">
        <ContentNavbar customReturnRoute="/projects" />
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-300">
          <h2 className="text-2xl mb-4">Project not found</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-neutral-300 hover:text-white"
          >
            <IoChevronBack size={20} />
            Back to Projects
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis">
      <ContentNavbar customReturnRoute="/projects" />

      <div className="flex-1 overflow-y-auto relative scrollbar-dark pt-20">
        {/* Main content container */}
        <div className="px-8 pt-8 pb-16 lg:px-16 xl:px-28">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column: existing content (takes 50% on lg+) */}
            <div className="lg:w-1/2">
              {/* Project header */}
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4 text-neutral-100">
                  {project.name}
                </h1>

                <div className="flex flex-wrap gap-4 text-neutral-400">
                  <p className="text-lg">{project.year}</p>
                  {project.category_name && (
                    <>
                      <span>•</span>
                      <p className="text-lg">{project.category_name}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Description section */}
              <div className="mb-10 max-w-3xl">
                <h2 className="text-xl text-neutral-200 mb-4">Description</h2>
                <p className="text-neutral-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies section - using separate component */}
              <div className="mb-10">
                <h2 className="text-xl text-neutral-200 mb-4">Technologies</h2>
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-8">
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

              {/* Links section */}
              <div className="max-w-md">
                <h2 className="text-xl text-neutral-200 mb-4">Links</h2>
                <div className="flex flex-col space-y-3">
                  {projectLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-neutral-300 hover:text-white transition-colors bg-neutral-700/30 rounded-lg px-4 py-3"
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: gallery (takes 50% on lg+) */}
            <div className="lg:w-1/2 flex flex-col items-center justify-start">
              {/* Big display rectangle with crossfade images */}
              <div className="w-full h-[60vh] border-4 border-white shadow-md relative overflow-hidden bg-neutral-700">
                {images.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Gallery image ${idx + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      idx === activeIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    draggable={false}
                  />
                ))}
              </div>

              {/* Thumbnails grid */}
              <div className="mt-6 w-full flex flex-wrap gap-3">
                {images.map((src, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={src}
                      onClick={() => onThumbnailClick(idx)}
                      className={`overflow-hidden border ${
                        isActive ? 'ring-2 ring-white' : ''
                      } focus:outline-none`}
                      style={{ flexBasis: '20%' }}
                      aria-label={`Thumbnail ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-full h-28 object-cover transition-transform duration-300 ${
                          isActive
                            ? 'brightness-110 scale-105'
                            : 'brightness-75'
                        }`}
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
