import React from 'react';

const Footer = () => {
  return (

    <footer className="dark:bg-gray-900 bg-gray-100 w-full py-12 border-t dark:border-gray-800 border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <img
              src="/KMSF_logo.png"
              alt="KMSF Logo"
              className="w-16 h-16 mb-4 rounded-full"
            />
            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-3">Kurdistan Medical and Scientific Federation</h3>
            <p className="dark:text-gray-400 text-gray-500 text-sm leading-relaxed">
              Advancing Kurdish healthcare and scientific excellence through unified professional support and collaboration since 1988.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 dark:text-gray-400 text-gray-500">
              <li><a href="#events-section" className="hover:text-amber-500 transition-colors">Events</a></li>
              <li><a href="#about-section" className="hover:text-amber-500 transition-colors">About Us</a></li>
              <li><a href="/membership" className="hover:text-amber-500 transition-colors">Membership</a></li>
              <li><a href="/contact" className="hover:text-amber-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">Contact Us</h4>
            <div className="space-y-2 dark:text-gray-400 text-gray-500 text-sm">
              <p>📧 info@kmsf.org</p>
              <p>📞 +44 20 1234 5678</p>
              <p>📍 London, United Kingdom</p>
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-800 border-gray-200 mt-8 pt-8 text-center">
          <p className="dark:text-gray-400 text-gray-500 text-sm">
            © 2025 Kurdistan Medical and Scientific Federation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

  );
}

export default Footer;
