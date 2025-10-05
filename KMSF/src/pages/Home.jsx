import React, { Suspense, lazy, useEffect } from 'react';
import ScrollToTop from '../components/ScrollToTop';

// Lazy load sections for better performance
const HeroSection = lazy(() => import('./HeroSection'));
const About = lazy(() => import('./About'));
const Events = lazy(() => import('./Events'));
const Members = lazy(() => import('./Members'));

// Loading component for sections
const SectionLoader = () => (
  <div className="min-h-[50vh] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C8A441]"></div>
  </div>
);

const Home = () => {
  useEffect(() => {
    // Handle hash scrolling after components load (only on initial page load)
    const hash = window.location.hash;
    if (hash && hash.includes('-section')) {
      const elementId = hash.substring(1); // Remove the '#'
      const element = document.getElementById(elementId);
      if (element) {
        // Small delay to ensure components are fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800); // Longer delay for lazy-loaded components
      }
    }
  }, []);

  return (
    <div>
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      <div id="about-section">
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
      </div>
      <div id="events-section">
        <Suspense fallback={<SectionLoader />}>
          <Events />
        </Suspense>
      </div>
      <Suspense fallback={<SectionLoader />}>
        <Members />
      </Suspense>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
