// types/TechnologyTypes.ts
export interface TechnologyType {
  id: number;
  technology_name: string;
  technology_url: string | null;
  images?: TechnologyImageType[];
}

export interface TechnologyImageType {
  id: number;
  technology_id: number;
  technology_image: string | null;
}

// Mapping between projects and technologies
export interface ProjectTechnologyImage {
  id: number;
  project_id: number;
  technology_id: number;
  project_item: string;
  technology_image: string | null;
}
