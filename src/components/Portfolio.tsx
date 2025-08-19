'use client';
import { useRef } from 'react';
import ScrollContainer from './scroll-container/ScrollContainer';
import Navbar from './ui/Navbar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';

export default function Portfolio() {
  const routes = ['/', '/about', '/contact'];
  const scrollContainerRef = useRef<{
    scrollToSection: (index: number) => void;
  }>(null);

  const handleNavbarNavigation = (sectionIndex: number) => {
    // Call the scrollToSection method from ScrollContainer
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollToSection(sectionIndex);
    }
  };

  return (
    <>
      {/* Navbar with scroll navigation callback */}
      <Navbar routes={routes} onNavigate={handleNavbarNavigation} />
      <ScrollContainer ref={scrollContainerRef} routes={routes}>
        <HeroSection></HeroSection>
        <AboutSection></AboutSection>
        <ContactSection></ContactSection>
      </ScrollContainer>
    </>
  );
}
