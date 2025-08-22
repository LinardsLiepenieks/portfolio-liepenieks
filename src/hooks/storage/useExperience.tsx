'use client';

import { useState, useEffect } from 'react';

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
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        setLoading(true);
        const response = await fetch('/api/experience');
        if (!response.ok) throw new Error('Failed to fetch experiences');
        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, []);

  return { experiences, loading, error };
}
