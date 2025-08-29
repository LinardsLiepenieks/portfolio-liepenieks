export interface CertificateItemType {
  /** Unique identifier */
  id: string | number;

  /** Certificate or course name */
  name: string;

  /** Organization or platform that issued the certificate */
  provider: string;

  /** Year the certificate was obtained */
  year: number;

  /** Optional logo URL of the provider */
  logo_url: string;

  /** URL to the certificate document/verification */
  certificate_url: string;
}

export interface CertificateComponentProps {
  id: string | number;
  name: string;
  provider: string;
  year: number;
  logoUrl?: string;
  certificateUrl?: string;

  // Optional callbacks for UI interactions
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}
