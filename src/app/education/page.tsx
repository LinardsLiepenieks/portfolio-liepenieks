'use client';

import { Suspense, useState, useRef, useCallback, useMemo } from 'react';
import EducationItem from '@/components/education/EducationItem';
import CertificateList from '@/components/education/CertificateList';
import { useEducation } from '@/hooks/storage/useEducation';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import EducationMobileItem from '@/components/education/EducationMobileItem';
import CertificateMobileItem from '@/components/education/CertificateMobileItem';
import { useCertificates } from '@/hooks/storage/useCertificates';

function EducationPageContent() {
  const [displayText, setDisplayText] = useState('Education');
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(
    null
  );
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    string | null
  >(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Use refs to store current values without triggering re-renders
  const selectedEducationIdRef = useRef(selectedEducationId);
  const selectedCertificateIdRef = useRef(selectedCertificateId);

  // Update refs when state changes
  selectedEducationIdRef.current = selectedEducationId;
  selectedCertificateIdRef.current = selectedCertificateId;

  // Data hooks
  const { education: educationItems } = useEducation();
  const { certificates: certificateItems } = useCertificates();

  // Store items in refs to avoid dependencies in callbacks
  const educationItemsRef = useRef(educationItems);
  const certificateItemsRef = useRef(certificateItems);
  educationItemsRef.current = educationItems;
  certificateItemsRef.current = certificateItems;

  // Stable event handlers with minimal dependencies
  const handleEducationHover = useCallback((education: any) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDisplayText(education.nameShort || education.name);
  }, []); // No dependencies

  const handleCertificateHover = useCallback((certificate: any) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDisplayText(certificate.provider || certificate.name);
  }, []); // No dependencies

  const handleHoverLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      // Use refs to get current values without dependencies
      if (selectedEducationIdRef.current) {
        const selected = educationItemsRef.current.find(
          (item) => item.id === selectedEducationIdRef.current
        );
        setDisplayText(selected?.nameShort || selected?.name || 'Education');
      } else if (selectedCertificateIdRef.current) {
        const selected = certificateItemsRef.current.find(
          (item) => item.id === selectedCertificateIdRef.current
        );
        setDisplayText(selected?.provider || selected?.name || 'Education');
      } else {
        setDisplayText('Education');
      }
      hoverTimeoutRef.current = null;
    }, 100);
  }, []); // No dependencies

  const handleEducationClick = useCallback(
    (education: any) => {
      if (selectedEducationIdRef.current === education.id) {
        setSelectedEducationId(null);
        setSelectedCertificateId(null);
        setDisplayText('Education');
      } else {
        setSelectedEducationId(education.id);
        setSelectedCertificateId(null);
        setDisplayText(education.nameShort || education.name);
      }
    },
    [] // Remove selectedEducationId dependency
  );

  const handleCertificateClick = useCallback(
    (certificate: any) => {
      if (selectedCertificateIdRef.current === certificate.id) {
        setSelectedCertificateId(null);
        setSelectedEducationId(null);
        setDisplayText('Education');
      } else {
        setSelectedCertificateId(certificate.id);
        setSelectedEducationId(null);
        setDisplayText(certificate.provider || certificate.name);
      }
    },
    [] // Remove selectedCertificateId dependency
  );

  // Memoize the AboutTitle props to prevent unnecessary re-renders
  const aboutTitleProps = useMemo(
    () => ({
      title: 'About:',
      displayText,
      displayTextClassName: 'text-neutral-300',
      lineWidth: 'w-64 md:w-70 lg:w-90',
      removeSpeed: 20,
      typeSpeed: 30,
    }),
    [displayText]
  );

  // Create stable references to prevent re-renders
  const stableHandlers = useMemo(
    () => ({
      handleCertificateHover,
      handleHoverLeave,
      handleCertificateClick,
    }),
    [handleCertificateHover, handleHoverLeave, handleCertificateClick]
  );

  return (
    <>
      <ContentNavbar />

      <section className="h-screen bg-neutral-900 text-white flex flex-col w-full overflow-hidden">
        <AboutTitle {...aboutTitleProps} />

        {/* Main Content Area */}
        <div className="flex-1 relative min-h-0">
          {/* Gradient overlays for desktop */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

          {/* Mobile Layout */}
          <div className="md:hidden h-full overflow-y-auto mx-4 sm:mx-8 pb-4 pt-4 scrollbar-dark">
            <div className="space-y-4 mb-8">
              {educationItems.map((education) => (
                <div
                  key={education.id}
                  onClick={() => handleEducationClick(education)}
                >
                  <EducationMobileItem {...education} />
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
                      key={certificate.id}
                      onClick={() => handleCertificateClick(certificate)}
                    >
                      <CertificateMobileItem {...certificate} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block h-full overflow-y-auto px-20 py-4 scrollbar-black">
            {/* Education Items */}
            {educationItems.map((education) => (
              <div
                key={education.id}
                className="transition-all duration-500 ease-out will-change-transform"
                onMouseEnter={() => handleEducationHover(education)}
                onMouseLeave={handleHoverLeave}
              >
                <EducationItem {...education} />
              </div>
            ))}

            {/* Certificate Items */}
            {certificateItems.length > 0 && (
              <CertificateList
                certificates={certificateItems}
                onHover={stableHandlers.handleCertificateHover}
                onHoverLeave={stableHandlers.handleHoverLeave}
                onClick={stableHandlers.handleCertificateClick}
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
