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

interface AnimationState {
  currentText: string;
  targetText: string;
  isAnimating: boolean;
}

function EducationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const returnSection = parseInt(searchParams.get('returnTo') || '0');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Simplified animation state
  const [animationState, setAnimationState] = useState<AnimationState>({
    currentText: 'Education',
    targetText: 'Education',
    isAnimating: false,
  });

  // Mobile selection handlers
  const handleEducationSelect = useCallback((educationName: string) => {
    updateDisplayText(educationName);
  }, []);

  const handleEducationDeselect = useCallback(() => {
    updateDisplayText('Education');
  }, []);

  const handleCertificateSelect = useCallback((certificateName: string) => {
    updateDisplayText(certificateName);
  }, []);

  const handleCertificateDeselect = useCallback(() => {
    updateDisplayText('Education');
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

  // Improved text animation with requestAnimationFrame
  const updateDisplayText = useCallback(
    (newText: string) => {
      if (animationState.targetText === newText) return;

      setAnimationState((prev) => ({
        ...prev,
        targetText: newText,
        isAnimating: true,
      }));

      // Clear any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      let startTime: number | null = null;
      const duration = 300; // Total animation duration
      const pauseDuration = 50; // Pause between delete and type

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setAnimationState((prev) => {
          const currentLength = prev.currentText.length;
          const targetLength = newText.length;

          if (progress < 0.4) {
            // Delete phase (0-40% of animation)
            const deleteProgress = progress / 0.4;
            const charsToKeep = Math.floor(
              currentLength * (1 - deleteProgress)
            );
            return {
              ...prev,
              currentText: prev.currentText.slice(0, Math.max(0, charsToKeep)),
            };
          } else if (progress < 0.5) {
            // Pause phase (40-50% of animation)
            return {
              ...prev,
              currentText: '',
            };
          } else {
            // Type phase (50-100% of animation)
            const typeProgress = (progress - 0.5) / 0.5;
            const charsToShow = Math.floor(targetLength * typeProgress);
            return {
              ...prev,
              currentText: newText.slice(0, charsToShow),
            };
          }
        });

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setAnimationState((prev) => ({
            currentText: newText,
            targetText: newText,
            isAnimating: false,
          }));
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [animationState.targetText]
  );

  // Debounced hover handlers for desktop
  const handleHover = useCallback(
    (text: string) => {
      if (!isDesktop) return;

      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      setIsHovering(true);

      // Small delay to prevent rapid firing
      hoverTimeoutRef.current = setTimeout(() => {
        updateDisplayText(text);
      }, 900);
    },
    [isDesktop, updateDisplayText]
  );

  const handleHoverLeave = useCallback(() => {
    if (!isDesktop) return;

    // Clear timeout if still pending
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setIsHovering(false);

    // Delay before reverting to avoid flickering
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        updateDisplayText('Education');
      }
    }, 150);
  }, [isDesktop, isHovering, updateDisplayText]);

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
          const threshold = rect.height / 40;

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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
          displayText={animationState.currentText}
          displayTextClassName="text-neutral-300"
          lineWidth="w-64 md:w-70 lg:w-90"
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
