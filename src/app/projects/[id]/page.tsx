'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/storage/useProject';
import { useProjectImages } from '@/hooks/storage/useProjectImages';
import ProjectDetailLoading from './loading';
import InvalidProjectId from './_components/InvalidProjectId';
import ProjectNotFound from './_components/ProjectNotFound';
import ProjectDetailContent from './_components/ProjectDetailContent';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id ? String(params.id) : '';
  const { project, loading, error } = useProject(projectId);
  const { images: projectImages } = useProjectImages(projectId);

  // Handle case where projectId is empty
  if (!projectId) {
    return <InvalidProjectId />;
  }

  // Loading state
  if (loading) {
    return <ProjectDetailLoading />;
  }

  // Error state
  if (error || !project) {
    return <ProjectNotFound error={error} />;
  }

  return (
    <ProjectDetailContent project={project} projectImages={projectImages} />
  );
}
