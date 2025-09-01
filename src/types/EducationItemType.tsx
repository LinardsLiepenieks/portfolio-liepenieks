// types/EducationItemType.ts
export interface EducationItemType {
  id: string | number;
  name: string;
  name_short: string;
  degree: string;
  start_year: number;
  end_year?: number;
  specialty?: string;
  description_short?: string;
  attachment_name?: string;
  logo_url?: string;
  education_urls: Array<{
    id: number;
    education_id: number;
    url: string;
    attachment_name: string;
  }>;
}

export interface EducationComponentProps {
  id: string | number;
  name: string;
  nameShort: string;
  degree: string;
  specialty?: string;
  period: string; // e.g. "2020-2024"
  startYear: number;
  descriptionShort?: string;
  logoUrl?: string;
  educationUrls: Array<{
    id: number;
    education_id: number;
    url: string;
    attachment_name: string;
  }>;
  attachmentName?: string;
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
