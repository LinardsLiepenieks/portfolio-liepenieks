// hooks/useProjectTechnologies.ts
'use client';

import { useDatabase } from './useDatabase';
import { TechnologyType } from '@/types/TechnologyType';

export function useProjectTechnologies(projectId: string | number) {
  const {
    data: technologies,
    loading,
    error,
  } = useDatabase<TechnologyType>(`/api/projects/${projectId}/technologies`);

  return { technologies, loading, error };
}
