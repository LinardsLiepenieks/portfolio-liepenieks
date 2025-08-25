export interface ExperienceItemType {
  /** Unique identifier */
  id: string | number;

  /** Company, project, or organization name */
  title: string;

  /**start and end of work */
  start_year: number;
  end_year: number;

  /** Detailed description of the role/experience */
  description: string;
  description_short: string;

  /** Optional logo URL */
  logo_url: string;

  /** Job title or role */
  position: string;

  /** Optional recommendation letter URL */
  recommendation_url?: string;

  /** Text for the recommendation link/modal button */
  reference_title?: string;
}

export interface ExperienceComponentProps {
  id: string | number;
  key?: string | number;
  title: string;
  position: string;
  description?: string;
  description_short?: string;
  period: string; // formatted string like "2023-Present"
  logoUrl?: string;
  recommendationUrl?: string;
  linkTitle?: string;

  // Optional callbacks for UI interactions
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
