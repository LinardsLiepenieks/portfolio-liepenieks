// hooks/storage/useProject.ts
'use client';

import { useState, useEffect } from 'react';
import { ProjectItemType } from '@/types/ProjectItemType';

export function useProject(id: string) {
  const [project, setProject] = useState<ProjectItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProject() {
      if (!id) {
        setLoading(false);
        setError('No project ID provided');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch project: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        if (isMounted) {
          setProject(result);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { project, loading, error };
}
