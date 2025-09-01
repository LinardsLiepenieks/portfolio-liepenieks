'use client';

import { useDatabase } from './useDatabase';
import { CertificateItemType } from '@/types/CertificateItemType';

export function useCertificates(
  onSelect?: (name: string) => void,
  onDeselect?: () => void
) {
  const {
    data: certificates,
    loading,
    error,
  } = useDatabase<CertificateItemType>('/api/certificates');

  const certificateProps =
    certificates?.map((certificate) => ({
      id: certificate.id,
      name: certificate.name,
      provider: certificate.provider,
      year: certificate.year,
      logoUrl: certificate.logo_url,
      certificateUrls: certificate.certificate_urls || [],
      onSelect: () => onSelect?.(certificate.name),
      onDeselect: onDeselect,
    })) || [];

  return { certificates: certificateProps, loading, error };
}
