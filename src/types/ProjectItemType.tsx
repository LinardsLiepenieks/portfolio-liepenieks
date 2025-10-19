// types/ProjectItemType.ts
import { TechnologyType } from './TechnologyType';

export interface ProjectItemType {
  id: string | number;
  name: string;
  year: string;
  description?: string;
  background_url?: string;
  logo_url?: string;
  category: number;
  category_name?: string;
  technologies?: TechnologyType[]; // Reference to TechnologyType
  // Only expose the specific URL fields used by the UI/hook
  github_url?: string;
  source_url?: string;
}

export interface ProjectComponentProps {
  id: string | number;
  name: string;
  year: string;
  description?: string;
  backgroundUrl?: string;
  logoUrl?: string;
  category: number;
  categoryName?: string;
  technologies?: TechnologyType[]; // Reference to TechnologyType
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
