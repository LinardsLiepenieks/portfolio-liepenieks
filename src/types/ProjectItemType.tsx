// types/ProjectItemType.ts
import { TechnologyType } from './TechnologyType';

export interface CategoryType {
  id: number;
  name: string;
}

export interface ProjectItemType {
  id: string | number;
  name: string;
  year: string;
  description?: string;
  background_url?: string;
  logo_url?: string;
  categories?: CategoryType[]; // Changed from single category to array
  technologies?: TechnologyType[];
  github_url?: string;
  source_url?: string;
  client_url?: string;
}

export interface ProjectComponentProps {
  id: string | number;
  name: string;
  year: string;
  description?: string;
  backgroundUrl?: string;
  logoUrl?: string;
  categories?: CategoryType[]; // Changed from single category to array
  technologies?: TechnologyType[];
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
