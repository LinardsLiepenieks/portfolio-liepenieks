import CertificateItem from '@/components/education/CertificateItem';
import { CertificateComponentProps } from '@/types/CertificateItemType';

interface CertificateListProps {
  certificates: CertificateComponentProps[];
  onHover: (certificate: CertificateComponentProps) => void;
  onHoverLeave: () => void;
  onClick: (certificate: CertificateComponentProps) => void;
}

const CertificateList = ({
  certificates,
  onHover,
  onHoverLeave,
  onClick,
}: CertificateListProps) => {
  return (
    <div className="flex flex-col items-start ">
      <h3
        className="font-metropolis text-pf-2xl font-medium mb-2"
        id="certificates-heading"
      >
        Certificates:
      </h3>
      <div
        role="list"
        aria-labelledby="certificates-heading"
        className="w-full"
      >
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            role="listitem"
            className="transition-all duration-500 ease-out will-change-transform rounded-md"
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
    </div>
  );
};

CertificateList.displayName = 'CertificateList';

export default CertificateList;
