'use client';

import { useDatabase } from './useDatabase';
import { ExperienceItemType } from '@/types/ExperienceItemType';

export function useExperience(
  onSelect?: (title: string) => void,
  onDeselect?: () => void
) {
  const {
    data: experiences,
    loading,
    error,
  } = useDatabase<ExperienceItemType>('/api/experience');

  // Map raw data to component props format
  const experienceProps =
    experiences?.map((experience) => ({
      id: experience.id,
      key: experience.id,
      title: experience.title,
      position: experience.position,
      period: `${experience.start_year}-${experience.end_year || 'Present'}`,
      startYear: experience.start_year,
      descriptionShort: experience.description_short,
      description: experience.description,
      logoUrl: experience.logo_url,
      recommendationUrl: experience.recommendation_url,
      linkTitle: experience.reference_title,
      onSelect: () => onSelect?.(experience.title),
      onDeselect: onDeselect,
    })) || [];

  return { experiences: experienceProps, loading, error };
}
