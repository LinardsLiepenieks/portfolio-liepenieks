'use client';

import { useParams, useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import { useProjects } from '@/hooks/storage/useProjects';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const { projects } = useProjects();

  // Find the specific project
  const project = projects.find((p) => p.id.toString() === projectId);

  if (!project) {
    return (
      <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis pt-8">
        <ContentNavbar customReturnRoute="/projects" />
        <div className="flex flex-col items-center justify-center flex-1 text-neutral-300">
          <h2 className="text-2xl mb-4">Project not found</h2>
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

      <div className="">
        <AboutTitle
          title="Project:"
          displayText={project.name}
          displayTextClassName="text-neutral-300"
          removeSpeed={20}
          typeSpeed={30}
        />
      </div>

      <div className="flex-1 overflow-y-auto relative scrollbar-dark">
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col px-8 pt-8 pb-16 lg:px-16 xl:px-28">
          {/* Back button */}
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-neutral-300 hover:text-white mb-8 w-fit"
          >
            <IoChevronBack size={20} />
            Back to Projects
          </button>

          {/* Project details */}
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4 text-neutral-100">
              {project.name}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8 text-neutral-400">
              <p className="text-lg">{project.year}</p>
              {project.categoryName && (
                <>
                  <span>•</span>
                  <p className="text-lg">{project.categoryName}</p>
                </>
              )}
            </div>

            {project.description && (
              <div
                className="prose prose-invert prose-neutral max-w-none text-neutral-300"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            )}

            {/* Add more project details here as needed */}
            {/* For example: images, videos, links, tech stack, etc. */}
          </div>
        </div>
      </div>
    </section>
  );
}
