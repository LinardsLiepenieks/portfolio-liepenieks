// types/EducationItemType.ts
export interface EducationItemType {
  /** Unique identifier */
  id: string | number;

  /** Institution name */
  name: string;

  /** Short version of institution name */
  name_short: string;

  /** Degree/qualification obtained */
  degree: string;

  /** Start year of education */
  start_year: number;

  /** End year of education */
  end_year: number;

  /** Field of study/specialty */
  specialty: string;

  /** Brief description of the education */
  description_short: string;

  /** Optional diploma/certificate URL */
  diploma_url?: string;

  /** Optional institution logo URL */
  logo_url?: string;
}

export interface EducationComponentProps {
  id: string | number;
  name: string;
  nameShort: string;
  degree: string;
  specialty: string;
  period: string; // formatted string like "2020-2024"
  startYear: number;
  descriptionShort: string;
  logoUrl?: string;
  diplomaUrl?: string;

  // Optional callbacks for UI interactions
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
