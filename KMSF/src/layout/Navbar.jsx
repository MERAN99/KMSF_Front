import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about', scrollTo: 'about-section' },
    { name: 'Events', href: '/events', scrollTo: 'events-section' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Archive', href: '/archive' },
    { name: 'Membership', href: '/membership' },
    { name: 'Donations', href: '/donations' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (e, link) => {
    if (link.scrollTo) {
      e.preventDefault();

      if (window.location.pathname === '/') {
        // Already on home page, just scroll
        const scrollToElement = () => {
          const element = document.getElementById(link.scrollTo);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 80; // Account for fixed navbar height
            window.scrollTo({
              top: elementTop - offset,
              behavior: 'smooth'
            });
          } else {
            console.warn(`Element with ID "${link.scrollTo}" not found`);
          }
        };

        // Try immediately, then retry after a delay for lazy-loaded content
        scrollToElement();
        setTimeout(scrollToElement, 200);
      } else {
        // Navigate to home page first, then scroll
        window.location.href = `/#${link.scrollTo}`;
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white40 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - KMSF Title */}
          <div className="flex-shrink-0 flex-row flex items-center space-x-2">
            <img src="/KMSF_logo.png" className='w-8 ' alt="" />
            <h1 className="text-2xl font-bold text-white">KMSF</h1>
          </div>

          {/* Center - Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              link.scrollTo ? (
                <button
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-white hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none"
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* Right side - Sign In Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Sign In Button - Always visible */}
            <a
              href="/membership"
              className=" hover:bg-amber-400 hover:border-white text-white px-4 py-2 border border-amber-400  text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </a>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked, current state:', isMobileMenuOpen);
                  setIsMobileMenuOpen(prev => {
                    console.log('Setting menu to:', !prev);
                    return !prev;
                  });
                }}
                className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200 flex items-center justify-center w-10 h-10 relative z-10"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-gray-900/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link, index) => (
                link.scrollTo ? (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block text-white hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer w-full text-left bg-transparent border-none"
                    onClick={(e) => {
                      handleNavClick(e, link);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.name}
                  </motion.button>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block text-white hover:bg-white/10 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
