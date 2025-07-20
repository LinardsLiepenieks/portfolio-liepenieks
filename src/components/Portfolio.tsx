'use client';
import { useRef } from 'react';
import ScrollContainer from './scroll-container/ScrollContainer';
import Navbar from './ui/NavBar';
import {
  Section1,
  Section2,
  Section3,
} from '@/components/sections/DummySections';

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
        <Section1 />
        <Section2 />
        <Section3 />
      </ScrollContainer>
    </>
  );
}
