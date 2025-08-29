'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import EducationItem from '@/components/education/EducationItem';
import CertificateList from '@/components/education/CertificateList';
import { useEducation } from '@/hooks/storage/useEducation';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import EducationMobileItem from '@/components/education/EducationMobileItem';
import CertificateMobileItem from '@/components/education/CertificateMobileItem';
import { useCertificates } from '@/hooks/storage/useCertificates';
import { EducationComponentProps } from '@/types/EducationItemType';
import { CertificateComponentProps } from '@/types/CertificateItemType';

function EducationPageContent() {
  const [displayText, setDisplayText] = useState('Education');
  const [selectedEducationId, setSelectedEducationId] = useState<
    string | number | null
  >(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    string | number | null
  >(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Data hooks
  const { education: educationItems } = useEducation();
  const { certificates: certificateItems } = useCertificates();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setSelectedEducationId(null);
        setSelectedCertificateId(null);
        setDisplayText('Education');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleEducationHover = (education: EducationComponentProps) => {
    clearHoverTimeout();
    setDisplayText(education.nameShort || education.name);
  };

  const handleCertificateHover = (certificate: CertificateComponentProps) => {
    clearHoverTimeout();
    setDisplayText(certificate.provider || certificate.name);
  };

  const handleHoverLeave = () => {
    clearHoverTimeout();

    hoverTimeoutRef.current = window.setTimeout(() => {
      if (selectedEducationId) {
        const selected = educationItems.find(
          (item) => item.id === selectedEducationId
        );
        setDisplayText(selected?.nameShort || selected?.name || 'Education');
      } else if (selectedCertificateId) {
        const selected = certificateItems.find(
          (item) => item.id === selectedCertificateId
        );
        setDisplayText(selected?.provider || selected?.name || 'Education');
      } else {
        setDisplayText('Education');
      }
      hoverTimeoutRef.current = null;
    }, 100);
  };

  const handleEducationClick = (education: EducationComponentProps) => {
    if (selectedEducationId === education.id) {
      setSelectedEducationId(null);
      setSelectedCertificateId(null);
      setDisplayText('Education');
    } else {
      setSelectedEducationId(education.id);
      setSelectedCertificateId(null);
      setDisplayText(education.nameShort || education.name);
    }
  };

  const handleCertificateClick = (certificate: CertificateComponentProps) => {
    if (selectedCertificateId === certificate.id) {
      setSelectedCertificateId(null);
      setSelectedEducationId(null);
      setDisplayText('Education');
    } else {
      setSelectedCertificateId(certificate.id);
      setSelectedEducationId(null);
      setDisplayText(certificate.provider || certificate.name);
    }
  };

  return (
    <>
      <ContentNavbar />

      <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
        <AboutTitle
          title="About:"
          displayText={displayText}
          displayTextClassName="text-neutral-300"
          lineWidth="w-64 md:w-70 lg:w-90"
          removeSpeed={20}
          typeSpeed={30}
        />

        {/* Main Content Area */}
        <div className="flex-1 relative min-h-0" ref={contentRef}>
          {/* Gradient overlays for desktop */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

          {/* Mobile Layout */}
          <div className="md:hidden h-full overflow-y-auto mx-4 sm:mx-8 pb-4 pt-4 scrollbar-dark">
            <div className="space-y-4 mb-8">
              {educationItems.map(({ id, ...educationProps }) => (
                <div
                  key={id}
                  onClick={() =>
                    handleEducationClick({ id, ...educationProps })
                  }
                >
                  <EducationMobileItem id={id} {...educationProps} />
                </div>
              ))}
            </div>
            {certificateItems.length > 0 && (
              <>
                <h3 className="font-metropolis text-pf-lg font-medium mb-4">
                  Certificates:
                </h3>
                <div className="space-y-4">
                  {certificateItems.map((certificate) => (
                    <div
                      onClick={() => handleCertificateClick(certificate)}
                      key={certificate.id}
                    >
                      <CertificateMobileItem {...certificate} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex h-full overflow-y-auto px-20 py-4 scrollbar-black flex-col gap-16 ">
            {/* Education Items */}
            {educationItems.map((education) => {
              const { id, ...educationProps } = education;
              return (
                <div
                  key={id}
                  className="transition-all duration-500 ease-out will-change-transform"
                  onMouseEnter={() => handleEducationHover(education)}
                  onMouseLeave={handleHoverLeave}
                >
                  <EducationItem id={id} {...educationProps} />
                </div>
              );
            })}
            {/* Certificate Items */}
            {certificateItems.length > 0 && (
              <CertificateList
                certificates={certificateItems}
                onHover={handleCertificateHover}
                onHoverLeave={handleHoverLeave}
                onClick={handleCertificateClick}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function EducationPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-neutral-900 text-white flex items-center justify-center">
          <div className="text-neutral-300">Loading...</div>
        </div>
      }
    >
      <EducationPageContent />
    </Suspense>
  );
}
