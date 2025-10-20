// app/projects/[id]/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { CiGlobe } from 'react-icons/ci';
import ContentNavbar from '@/components/ui/ContentNavbar';
import { useProject } from '@/hooks/storage/useProject';
import { ProjectItemType } from '@/types/ProjectItemType';
import ProjectTechnology from '@/components/projects/ProjectTechnology';
import ProjectGallery from '@/components/projects/ProjectGallery';
import { useProjectImages } from '@/hooks/storage/useProjectImages';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? String(params.id) : '';
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
  // If a project has a `source_url` field, prefer a globe icon for it
  pushLink(
    'Live demo',
    pdata?.source_url,
    pdata?.source_url ? <CiGlobe /> : undefined
  );

  // Fetch project images via hook (keeps data fetching separated like technologies)
  const {
    images: projectImages,
    loading: imagesLoading,
    error: imagesError,
  } = useProjectImages(projectId);

  const imageObjects = useMemo(() => {
    return (
      projectImages
        ?.map((im: any) => ({
          src: im.project_image ?? im.image_url ?? im.url,
          caption: im.caption ?? undefined,
        }))
        .filter((x: any) => x.src) || []
    );
  }, [projectImages]);

  // Debug: log images coming from the hook and what we pass to the gallery
  useEffect(() => {
    console.log('projectImages (from useProjectImages):', projectImages);
    console.log('imageObjects (passed to ProjectGallery):', imageObjects);
  }, [projectImages, imageObjects]);

  // Process links
  if (pdata?.links && Array.isArray(pdata.links)) {
    pdata.links.forEach((l: LinkObj) => {
      const url = l.url ?? l.href ?? l.link;
      const name =
        l.name ??
        (url && url.includes('github.com') ? 'GitHub Repository' : 'Source');
      pushLink(name, url);
    });
  }

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

  function getCandidateField(
    p: ExtendedProject | null,
    field: CandidateField
  ): string | undefined {
    if (!p) return undefined;
    const record = p as unknown as Record<CandidateField, string | undefined>;
    return record[field];
  }

  candidates.forEach((c) => {
    pushLink(c.name, getCandidateField(pdata, c.field));
  });

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

      <div className="flex-1 overflow-y-auto relative scrollbar-dark pt-20 max-w-page w-full mx-auto">
        <div className="px-8 pt-8 pb-16 lg:px-16 xl:px-28 ">
          <div className="flex flex-col lg:flex-row gap-8 ">
            {/* Left column */}
            <div className="lg:w-1/2">
              <div className="mb-16">
                <h1 className="text-4xl md:text-pf-3xl font-light tracking-wide mb-6 text-neutral-100">
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

              <div className="mb-4 max-w-3xl">
                <h2 className="text-pf-lg font-medium text-neutral-200 mb-3">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed text-base">
                  {project.description}
                </p>
              </div>
              <div className="max-w-md mb-14">
                <div className="flex flex-col space-y-3 inline-flex">
                  {projectLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-neutral-300 hover:text-white transition-colors py-3 group text-pf-base"
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span className="group-hover:underline">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-pf-base text-neutral-200 mb-5 font-medium">
                  Stack
                </h2>
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
            </div>

            {/* Right column: gallery */}
            <div className="lg:w-1/2 flex flex-col items-center justify-start">
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
