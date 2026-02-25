import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User as UserIcon, CreditCard, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectCurrentToken, logout } from '../store/slices/authSlice';
import MemberIDCard from '../components/MemberIDCard';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const profileRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicked outside, BUT NOT if clicking the toggle button itself
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about', scrollTo: 'about-section' },
    { name: 'Events', href: '/events', scrollTo: 'events-section' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Archive', href: '/archive' },
    ...(!token ? [{ name: 'Membership', href: '/membership' }] : []),
    { name: 'Donations', href: '/donations' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (e, link) => {
    if (link.scrollTo) {
      e.preventDefault();

      if (window.location.pathname === '/') {
        const scrollToElement = () => {
          const element = document.getElementById(link.scrollTo);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 80;
            window.scrollTo({
              top: elementTop - offset,
              behavior: 'smooth'
            });
          }
        };
        scrollToElement();
        setTimeout(scrollToElement, 200);
      } else {
        window.location.href = `/#${link.scrollTo}`;
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - KMSF Title */}
            <div className="flex-shrink-0 flex-row flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
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

            {/* Right side - Sign In Button / Profile & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {token ? (
                /* Logged In Profile Icon */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 bg-gray-800 border border-amber-500/50 p-1 pr-3 rounded-full hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <span className="text-white text-sm font-medium hidden sm:inline-block">
                      {user?.firstName}
                    </span>
                    <ChevronDown size={16} className={`text-amber-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 shadow-2xl rounded-lg overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-800 bg-gray-850">
                          <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">Membership</p>
                          <p className="text-white font-bold truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => { setIsIDCardOpen(true); setIsProfileOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                          >
                            <CreditCard size={18} />
                            <span>My ID Card</span>
                          </button>

                          {user?.role === 'admin' && (
                            <button
                              onClick={() => { navigate('/admin'); setIsProfileOpen(false); }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-amber-500 hover:bg-amber-500/10 transition-colors"
                            >
                              <UserIcon size={18} />
                              <span>Admin Dashboard</span>
                            </button>
                          )}

                          <button
                            onClick={() => { setIsChangePasswordOpen(true); setIsProfileOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                          >
                            <Lock size={18} />
                            <span>Change Password</span>
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-gray-800/50"
                          >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Become a member Button */
                <a
                  href="/membership"
                  className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-5 py-2 font-bold text-sm transition-all duration-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                >
                  Become a member
                </a>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  ref={toggleButtonRef}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center w-10 h-10 relative z-10"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              className="lg:hidden bg-gray-900 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-white hover:bg-white/10 px-3 py-4 rounded-md text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ID Card Modal */}
      <AnimatePresence>
        {isIDCardOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIDCardOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <button
                onClick={() => setIsIDCardOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors p-2"
              >
                <X size={32} />
              </button>

              <MemberIDCard user={user} />

              <div className="mt-8 text-center text-gray-500 text-sm">
                This is your official KMSF membership card. <br />
                Show this card for events and member benefits.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};

export default Navbar;
