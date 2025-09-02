// types/ProjectItemType.ts
export interface ProjectItemType {
  id: string | number;
  name: string;
  year: string;
  description?: string;
  background_url?: string;
  logo_url?: string;
  category: number;
  category_name?: string;
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
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
