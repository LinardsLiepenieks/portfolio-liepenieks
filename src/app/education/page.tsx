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
import { useCallback } from 'react';

function EducationPageContent() {
  const [displayText, setDisplayText] = useState('Education');
  const [selectedEducationId, setSelectedEducationId] = useState<
    string | number | null
  >(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    string | number | null
  >(null);
  const [hiddenEducationIds, setHiddenEducationIds] = useState<
    Set<string | number>
  >(new Set());
  const [hiddenCertificateIds, setHiddenCertificateIds] = useState<
    Set<string | number>
  >(new Set());
  const [isDesktop, setIsDesktop] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null); // New ref for desktop container
  const observerRef = useRef<IntersectionObserver | null>(null);
  const educationRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const certificateRefs = useRef<Map<string | number, HTMLDivElement>>(
    new Map()
  );

  // Data hooks
  const { education: educationItems } = useEducation();
  const { certificates: certificateItems } = useCertificates();

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkIsDesktop = () => {
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
    };

    let timeoutId: number;
    const debouncedCheckIsDesktop = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkIsDesktop, 150);
    };

    checkIsDesktop();
    window.addEventListener('resize', debouncedCheckIsDesktop, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', debouncedCheckIsDesktop);
      clearTimeout(timeoutId);
    };
  }, []);

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

    document.addEventListener('mousedown', handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Optimized Intersection Observer for both education and certificates
  useEffect(() => {
    if (!isDesktop) {
      setHiddenEducationIds(new Set());
      setHiddenCertificateIds(new Set());
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Wait for the desktop scroll container to be available
    if (!desktopScrollContainerRef.current) {
      return;
    }

    // Create observer only once with optimized configuration
    if (!observerRef.current) {
      // Use requestIdleCallback for non-essential work (recommended by W3C spec)
      const deferredCallback = (entries: IntersectionObserverEntry[]) => {
        const educationUpdates = new Map<string | number, boolean>();
        const certificateUpdates = new Map<string | number, boolean>();

        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const educationId = element.dataset.educationId;
          const certificateId = element.dataset.certificateId;
          const isVisible = entry.isIntersecting;

          if (educationId) {
            const id = isNaN(Number(educationId))
              ? educationId
              : Number(educationId);
            educationUpdates.set(id, isVisible);
          } else if (certificateId) {
            const id = isNaN(Number(certificateId))
              ? certificateId
              : Number(certificateId);
            certificateUpdates.set(id, isVisible);
          }
        });

        // Use requestIdleCallback to defer state updates during idle time
        const updateStates = () => {
          // Update education items
          if (educationUpdates.size > 0) {
            setHiddenEducationIds((prev) => {
              const newSet = new Set(prev);
              let hasChanges = false;

              educationUpdates.forEach((isVisible, id) => {
                const wasHidden = prev.has(id);

                if (!isVisible && !wasHidden) {
                  // Item is no longer intersecting (hidden from top due to negative rootMargin)
                  newSet.add(id);
                  hasChanges = true;
                } else if (isVisible && wasHidden) {
                  // Item is intersecting again (visible)
                  newSet.delete(id);
                  hasChanges = true;
                }
              });

              return hasChanges ? newSet : prev;
            });
          }

          // Update certificate items
          if (certificateUpdates.size > 0) {
            setHiddenCertificateIds((prev) => {
              const newSet = new Set(prev);
              let hasChanges = false;

              certificateUpdates.forEach((isVisible, id) => {
                const wasHidden = prev.has(id);

                if (!isVisible && !wasHidden) {
                  // Item is no longer intersecting (hidden from top due to negative rootMargin)
                  newSet.add(id);
                  hasChanges = true;
                  console.log(
                    `Certificate item ${id} is now hidden from the top`
                  );
                } else if (isVisible && wasHidden) {
                  // Item is intersecting again (visible)
                  newSet.delete(id);
                  hasChanges = true;
                  console.log(`Certificate item ${id} is now visible again`);
                }
              });

              return hasChanges ? newSet : prev;
            });
          }
        };

        if (
          (educationUpdates.size > 0 || certificateUpdates.size > 0) &&
          'requestIdleCallback' in window
        ) {
          window.requestIdleCallback(updateStates);
        } else {
          updateStates();
        }
      };

      observerRef.current = new IntersectionObserver(deferredCallback, {
        // Use default threshold 0 - triggers when any part enters/leaves
        threshold: 0.6,
        // CRITICAL: Use negative bottom margin to prevent bottom-side triggers
        // This shrinks the intersection area from the bottom, creating a "dead zone"
        // Format: "top right bottom left" - we only want to shrink from bottom
        rootMargin: '0px 0px 100% 0px',
        root: desktopScrollContainerRef.current, // Use the desktop scroll container as root
      });
    }

    // Observe all current education elements
    educationRefs.current.forEach((element) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Observe all current certificate elements
    certificateRefs.current.forEach((element) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isDesktop, educationItems.length, certificateItems.length]);

  // Optimized ref callback for education items
  const setEducationRef = useCallback(
    (id: string | number) => (el: HTMLDivElement | null) => {
      if (el) {
        educationRefs.current.set(id, el);
        // Observe immediately if desktop and observer exists
        if (isDesktop && observerRef.current) {
          observerRef.current.observe(el);
        }
      } else {
        // Clean up when element is removed
        const existingElement = educationRefs.current.get(id);
        if (existingElement && observerRef.current) {
          observerRef.current.unobserve(existingElement);
        }
        educationRefs.current.delete(id);
      }
    },
    [isDesktop]
  );

  // Optimized ref callback for certificate items
  const setCertificateRef = useCallback(
    (id: string | number) => (el: HTMLDivElement | null) => {
      if (el) {
        certificateRefs.current.set(id, el);
        // Observe immediately if desktop and observer exists
        if (isDesktop && observerRef.current) {
          observerRef.current.observe(el);
        }
      } else {
        // Clean up when element is removed
        const existingElement = certificateRefs.current.get(id);
        if (existingElement && observerRef.current) {
          observerRef.current.unobserve(existingElement);
        }
        certificateRefs.current.delete(id);
      }
    },
    [isDesktop]
  );

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleEducationHover = useCallback(
    (education: EducationComponentProps) => {
      clearHoverTimeout();
      setDisplayText(education.nameShort || education.name);
    },
    [clearHoverTimeout]
  );

  const handleCertificateHover = useCallback(
    (certificate: CertificateComponentProps) => {
      clearHoverTimeout();
      setDisplayText(certificate.provider || certificate.name);
    },
    [clearHoverTimeout]
  );

  const handleHoverLeave = useCallback(() => {
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
  }, [
    selectedEducationId,
    selectedCertificateId,
    educationItems,
    certificateItems,
    clearHoverTimeout,
  ]);

  const handleEducationClick = useCallback(
    (education: EducationComponentProps) => {
      if (selectedEducationId === education.id) {
        setSelectedEducationId(null);
        setSelectedCertificateId(null);
        setDisplayText('Education');
      } else {
        setSelectedEducationId(education.id);
        setSelectedCertificateId(null);
        setDisplayText(education.nameShort || education.name);
      }
    },
    [selectedEducationId]
  );

  const handleCertificateClick = useCallback(
    (certificate: CertificateComponentProps) => {
      if (selectedCertificateId === certificate.id) {
        setSelectedCertificateId(null);
        setSelectedEducationId(null);
        setDisplayText('Education');
      } else {
        setSelectedCertificateId(certificate.id);
        setSelectedEducationId(null);
        setDisplayText(certificate.provider || certificate.name);
      }
    },
    [selectedCertificateId]
  );

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
          <div className="md:hidden h-full overflow-y-auto mx-4 sm:mx-8 pb-4 pt-8 scrollbar-dark">
            <div className="space-y-3 mb-4">
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
                <h3 className="font-metropolis text-pf-lg font-semibold text-neutral-100 mb-2">
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
          <div
            ref={desktopScrollContainerRef} // Add ref to desktop scroll container
            className="hidden md:flex h-full overflow-y-auto px-20 pt-12 xl:pt-4 pb-4 scrollbar-black flex-col gap-8 "
          >
            {/* Education Items */}
            {educationItems.map((education) => {
              const { id, ...educationProps } = education;
              const isHidden = hiddenEducationIds.has(id);

              return (
                <div
                  key={id}
                  ref={setEducationRef(id)}
                  data-education-id={id}
                  className={`transition-all relative duration-300 ease-in-out ${
                    isHidden ? '-left-8 opacity-60' : 'left-0 opacity-100'
                  }`}
                  onMouseEnter={() => {
                    handleEducationHover(education);
                    console.log(education);
                  }}
                  onMouseLeave={handleHoverLeave}
                >
                  <EducationItem id={id} {...educationProps} />
                </div>
              );
            })}
            {/* Certificate Items */}
            {certificateItems.length > 0 && (
              <div className="flex flex-col ">
                <CertificateList
                  certificates={certificateItems}
                  onHover={handleCertificateHover}
                  onHoverLeave={handleHoverLeave}
                  onClick={handleCertificateClick}
                  hiddenCertificateIds={hiddenCertificateIds}
                  setCertificateRef={setCertificateRef}
                />
              </div>
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
