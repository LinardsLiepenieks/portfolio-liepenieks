'use client';

import { useDatabase } from './useDatabase';

export interface ExperienceItem {
  id: number;
  title: string;
  start_year: number;
  end_year: number;
  description: string;
  description_short: string;
  image_url?: string;
}

export function useExperience() {
  const {
    data: experiences,
    loading,
    error,
  } = useDatabase<ExperienceItem>('/api/experience');
  return { experiences, loading, error };
}
