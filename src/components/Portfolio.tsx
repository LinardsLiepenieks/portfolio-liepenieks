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
        className="fixed bottom-4 right-4 z-50 font-metropolis hover:cursor-pointer text-neutral-700 underline hover:text-neutral-400 italic transition-all transition-300 ease text-xs"
        aria-label="Toggle scroll snap"
      >
        {scrollSnapEnabled
          ? 'Problems with scrolling?'
          : 'Problems with scrolling? SCROLL SNAP OFF'}
      </button>

      <ScrollContainer ref={scrollContainerRef} routes={routes}>
        <HeroSection onNavigate={handleNavbarNavigation} />
        <AboutSection />
        <ContactSection />
      </ScrollContainer>
    </>
  );
}
