export interface ProjectImageType {
  id: string | number;
  project_id: string | number;
  project_item?: string;
  // common column names we might encounter
  image_url?: string;
  project_image?: string;
  url?: string;
  caption?: string;
}
