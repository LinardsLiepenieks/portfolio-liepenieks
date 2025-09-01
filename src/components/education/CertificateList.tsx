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
      <h3 className="font-metropolis text-pf-xl lg:text-pf-2xl font-medium mb-4 lg:mb-2">
        Certificates:
      </h3>
      <div className="flex flex-col lg:gap-2 items-start">
        {certificates.map((certificate) => {
          const isHidden = hiddenCertificateIds.has(certificate.id);

          return (
            <div
              key={certificate.id}
              ref={setCertificateRef(certificate.id)}
              data-certificate-id={certificate.id}
              className={`transition-transform duration-300 ease-in-out inline  ${
                isHidden ? '-left-8 opacity-60' : 'left-0 opacity-100'
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
