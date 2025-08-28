import CertificateItem from '@/components/education/CertificateItem';
import { memo } from 'react';
interface CertificateListProps {
  certificates: any[];
  onHover: (certificate: any) => void;
  onHoverLeave: () => void;
  onClick: (certificate: any) => void;
}

const CertificateList = memo(
  ({ certificates, onHover, onHoverLeave, onClick }: CertificateListProps) => {
    return (
      <div className="flex flex-col items-start">
        <h3 className="font-metropolis text-pf-2xl font-medium mb-4">
          Certificates:
        </h3>
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="transition-all duration-500 ease-out will-change-transform"
            onMouseEnter={() => onHover(certificate)}
            onMouseLeave={onHoverLeave}
          >
            <CertificateItem
              {...certificate}
              onClick={() => onClick(certificate)}
            />
          </div>
        ))}
      </div>
    );
  }
);

CertificateList.displayName = 'CertificateList';

export default CertificateList;
