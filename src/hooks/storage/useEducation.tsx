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

  const educationProps =
    education?.map((edu) => ({
      id: edu.id,
      name: edu.name,
      nameShort: edu.name_short,
      degree: edu.degree,
      specialty: edu.specialty,
      period: `${edu.start_year}-${edu.end_year || 'present'}`,
      startYear: edu.start_year,
      descriptionShort: edu.description_short,
      logoUrl: edu.logo_url,
      educationUrls: edu.education_urls || [],
      attachmentName: edu.attachment_name,
      onSelect: () => onSelect?.(edu.name_short || edu.name),
      onDeselect: onDeselect,
    })) || [];

  return { education: educationProps, loading, error };
}
