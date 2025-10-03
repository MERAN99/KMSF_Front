

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Archive from './pages/Archive';
import Membership from './pages/Membership';
import Donations from './pages/Donations';
import Contact from './pages/Contact';
import Footer from './layout/Footer';

function App() {
  return (
    <Router>
      <div className="">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

      </div>
      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
