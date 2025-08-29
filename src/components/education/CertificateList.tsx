import CertificateItem from '@/components/education/CertificateItem';
import { CertificateComponentProps } from '@/types/CertificateItemType';

interface CertificateListProps {
  certificates: CertificateComponentProps[];
  onHover: (certificate: CertificateComponentProps) => void;
  onHoverLeave: () => void;
  onClick: (certificate: CertificateComponentProps) => void;
  hiddenCertificateIds: Set<string | number>;
  setCertificateRef: (
    id: string | number
  ) => (el: HTMLDivElement | null) => void;
}

const CertificateList = ({
  certificates,
  onHover,
  onHoverLeave,
  onClick,
  hiddenCertificateIds,
  setCertificateRef,
}: CertificateListProps) => {
  return (
    <>
      <h3 className="font-metropolis text-pf-lg font-medium mb-4">
        Certificates:
      </h3>
      <div className="space-y-4">
        {certificates.map((certificate) => {
          const isHidden = hiddenCertificateIds.has(certificate.id);

          return (
            <div
              key={certificate.id}
              ref={setCertificateRef(certificate.id)}
              data-certificate-id={certificate.id}
              className={`transition-transform duration-300 ease-out ${
                isHidden
                  ? '-translate-x-4 opacity-70'
                  : 'translate-x-0 opacity-100'
              }`}
              onMouseEnter={() => onHover(certificate)}
              onMouseLeave={onHoverLeave}
            >
              <CertificateItem
                {...certificate}
                onClick={() => onClick(certificate)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

CertificateList.displayName = 'CertificateList';

export default CertificateList;
