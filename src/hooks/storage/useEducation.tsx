'use client';

import { useDatabase } from './useDatabase';
import { EducationItemType } from '@/types/EducationItemType';

export function useEducation(
  onSelect?: (name: string) => void,
  onDeselect?: () => void
) {
  const {
    data: education,
    loading,
    error,
  } = useDatabase<EducationItemType>('/api/education');

  // Map raw data to component props format
  const educationProps =
    education?.map((edu) => ({
      id: edu.id,
      key: edu.id,
      name: edu.name,
      nameShort: edu.name_short,
      degree: edu.degree,
      specialty: edu.specialty,
      period: `${edu.start_year}-${edu.end_year || 'present'}`,
      startYear: edu.start_year,
      descriptionShort: edu.description_short,
      logoUrl: edu.logo_url,
      diplomaUrl: edu.diploma_url,
      onSelect: () => onSelect?.(edu.name_short || edu.name),
      onDeselect: onDeselect,
    })) || [];

  return { education: educationProps, loading, error };
}
