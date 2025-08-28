'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import EducationItem from '@/components/education/EducationItem';
import CertificateItem from '@/components/education/CertificateItem';
import { useEducation } from '@/hooks/storage/useEducation';
import ContentNavbar from '@/components/ui/ContentNavbar';
import AboutTitle from '@/components/sections/about_section/AboutTitle';
import EducationMobileItem from '@/components/education/EducationMobileItem';
import CertificateMobileItem from '@/components/education/CertificateMobileItem';
import { useCertificates } from '@/hooks/storage/useCertificates';

function EducationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Simplified timeout refs for hover management
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const returnSection = parseInt(searchParams.get('returnTo') || '0');
  const [isDesktop, setIsDesktop] = useState(false);
  const [displayText, setDisplayText] = useState<string>('Education');

  // Mobile selection handlers
  const handleEducationSelect = useCallback((educationName: string) => {
    setDisplayText(educationName);
  }, []);

  const handleEducationDeselect = useCallback(() => {
    setDisplayText('Education');
  }, []);

  const handleCertificateSelect = useCallback((certificateName: string) => {
    setDisplayText(certificateName);
  }, []);

  const handleCertificateDeselect = useCallback(() => {
    setDisplayText('Education');
  }, []);

  // Get data with handlers
  const {
    education: educationItems,
    loading,
    error,
  } = useEducation(handleEducationSelect, handleEducationDeselect);

  const { certificates: certificateItems } = useCertificates(
    handleCertificateSelect,
    handleCertificateDeselect
  );

  // Responsive check
  useEffect(() => {
    const checkIsDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Simplified hover handlers
  const handleHover = useCallback(
    (text: string) => {
      if (!isDesktop) return;

      // Clear any pending timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Update text immediately on hover
      setDisplayText(text);
    },
    [isDesktop]
  );

  const handleHoverLeave = useCallback(() => {
    if (!isDesktop) return;

    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Use a short delay to prevent flickering when moving between elements
    hoverTimeoutRef.current = setTimeout(() => {
      setDisplayText('Education');
      hoverTimeoutRef.current = null;
    }, 100);
  }, [isDesktop]);

  // Scroll animation with intersection observer for better performance
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const rect = entry.boundingClientRect;
          const containerRect = scrollContainer.getBoundingClientRect();

          // Check if item is near the top of the container
          const distanceFromTop = rect.top - containerRect.top;
          const threshold = rect.height * 0.05;

          if (distanceFromTop <= threshold && entry.isIntersecting) {
            element.classList.add('animate-left');
          } else {
            element.classList.remove('animate-left');
          }
        });
      },
      {
        root: scrollContainer,
        rootMargin: '-10px 0px',
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    // Observe all items
    const items = scrollContainer.querySelectorAll(
      '[data-education-item], [data-certificate-item]'
    );
    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [isDesktop, educationItems, certificateItems]);

  // Navigation handler
  const handleGoBack = useCallback(() => {
    const sectionRoutes = ['/', '/about', '/contact'];
    const targetRoute = sectionRoutes[returnSection] || '/';
    router.push(`${targetRoute}?instant=true`);
  }, [returnSection, router]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Loading and error states
  if (loading) {
    return (
      <div className="h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-neutral-300">Loading education data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-red-400">Error loading education data</div>
      </div>
    );
  }

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
        <div className="flex-1 relative min-h-0">
          {/* Gradient overlays for desktop */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

          {/* Mobile Layout */}
          <div className="md:hidden h-full overflow-y-auto mx-4 sm:mx-8 pb-4 pt-4 scrollbar-dark">
            <div className="space-y-4 mb-8">
              {educationItems.map((education) => (
                <div key={education.id}>
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
                    <div key={certificate.id}>
                      <CertificateMobileItem {...certificate} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop Layout */}
          <div
            ref={scrollContainerRef}
            className="hidden md:block h-full overflow-y-auto px-20 py-4 scrollbar-black"
          >
            {/* Education Items */}
            {educationItems.map((education) => (
              <div
                key={education.id}
                data-education-item
                className="transition-all duration-500 ease-out will-change-transform"
                style={{
                  transform: 'translateX(0)',
                  opacity: 1,
                }}
                onMouseEnter={() => handleHover(education.nameShort)}
                onMouseLeave={handleHoverLeave}
              >
                <EducationItem
                  {...education}
                  onSelect={() => {}}
                  onDeselect={() => {}}
                />
              </div>
            ))}

            {/* Certificate Items */}
            <div className="flex flex-col items-start">
              <h3 className="font-metropolis text-pf-2xl font-medium mb-4">
                Certificates:
              </h3>

              {certificateItems.map((certificate) => (
                <div
                  key={certificate.id}
                  data-certificate-item
                  className="transition-all duration-500 ease-out will-change-transform"
                  style={{
                    transform: 'translateX(0)',
                    opacity: 1,
                  }}
                  onMouseEnter={() => handleHover(certificate.provider)}
                  onMouseLeave={handleHoverLeave}
                >
                  <CertificateItem
                    {...certificate}
                    onSelect={() => {}}
                    onDeselect={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom CSS for scroll animations */}
        <style jsx>{`
          .animate-left {
            transform: translateX(-48px) !important;
            opacity: 0.4 !important;
          }
        `}</style>
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
