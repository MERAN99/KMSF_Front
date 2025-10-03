import React from 'react';
import About from './About';
import Events from './Events';
import HeroSection from './HeroSection';
import Members from './Members';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div id="about-section">
       <About />
      </div>
      <div id="events-section">
         <Events />
      </div>
      <Members />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
