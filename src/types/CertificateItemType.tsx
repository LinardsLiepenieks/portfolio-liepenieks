export interface CertificateItemType {
  id: string | number;
  name: string;
  provider: string;
  year: number;
  logo_url: string;
  // Array of multiple URLs for this certificate
  certificate_urls: Array<{
    id: number;
    certificate_id: number;
    url: string;
  }>;
}
export interface CertificateComponentProps {
  id: string | number;
  name: string;
  provider: string;
  year: number;
  logoUrl?: string;

  // Array of all certificate images/URLs for this certificate
  certificateUrls?: Array<{
    id: number;
    certificate_id: number;
    url: string;
  }>;

  // Optional callbacks for UI interactions
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
