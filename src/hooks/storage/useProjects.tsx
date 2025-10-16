'use client';

import { useDatabase } from './useDatabase';
import { ProjectItemType } from '@/types/ProjectItemType';

export function useProjects(
  onSelect?: (name: string) => void,
  onDeselect?: () => void
) {
  const {
    data: projects,
    loading,
    error,
  } = useDatabase<ProjectItemType>('/api/projects');
  console.log('HERE', projects);
  const projectsProps =
    projects?.map((project) => ({
      id: project.id,
      name: project.name,
      year: project.year,
      description: project.description,
      backgroundUrl: project.background_url,
      logoUrl: project.logo_url,
      category: project.category,
      categoryName: project.category_name,
      onSelect: () => onSelect?.(project.name),
      onDeselect: onDeselect,
    })) || [];

  return { projects: projectsProps, loading, error };
}
