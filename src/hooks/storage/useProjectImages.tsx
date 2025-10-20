'use client';

import { useDatabase } from './useDatabase';
import { ProjectImageType } from '@/types/ProjectImageType';

export function useProjectImages(projectId: string | number) {
  const {
    data: images,
    loading,
    error,
  } = useDatabase<ProjectImageType>(`/api/projects/${projectId}/images`);

  return { images, loading, error };
}
