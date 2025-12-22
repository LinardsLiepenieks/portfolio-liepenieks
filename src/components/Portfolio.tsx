'use client';
import { useRef, useState } from 'react';
import ScrollContainer from './scroll-container/ScrollContainer';
import Navbar from './ui/Navbar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';

export default function Portfolio() {
  const routes = ['/', '/about', '/contact'];
  const [scrollSnapEnabled, setScrollSnapEnabled] = useState(true);
  const scrollContainerRef = useRef<{
    scrollToSection: (index: number) => void;
    setScrollSnapEnabled: (enabled: boolean) => void;
  }>(null);

  const handleNavbarNavigation = (sectionIndex: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollToSection(sectionIndex);
    }
  };

  const toggleScrollSnap = () => {
    const newState = !scrollSnapEnabled;
    setScrollSnapEnabled(newState);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.setScrollSnapEnabled(newState);
    }
  };

  return (
    <>
      <Navbar routes={routes} onNavigate={handleNavbarNavigation} />

      {/* Toggle button */}
      <button
        onClick={toggleScrollSnap}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Toggle scroll snap"
      >
        {scrollSnapEnabled ? '🔒 Snap Mode' : '📜 Free Scroll'}
      </button>

      <ScrollContainer ref={scrollContainerRef} routes={routes}>
        <HeroSection onNavigate={handleNavbarNavigation} />
        <AboutSection />
        <ContactSection />
      </ScrollContainer>
    </>
  );
}
