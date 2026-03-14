import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User as UserIcon, CreditCard, ChevronDown, Lock, Zap, Star, Pencil, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectCurrentToken, logout } from '../store/slices/authSlice';
import MemberIDCard from '../components/MemberIDCard';
import ChangePasswordModal from '../components/ChangePasswordModal';
import EditProfileModal from '../components/EditProfileModal';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const profileRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const { isDark, toggleTheme } = useTheme();
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

  const navTextColor = isScrolled
    ? 'dark:text-white text-gray-800'
    : 'dark:text-white text-gray-900';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'dark:bg-gray-900/80 bg-white/90 backdrop-blur-lg shadow-lg dark:shadow-gray-900/50 shadow-gray-200/70'
          : 'dark:bg-transparent bg-white/80 backdrop-blur-sm dark:shadow-none shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - KMSF Title */}
            <div className="flex-shrink-0 flex-row flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/KMSF_logo.png" className='w-8 ' alt="" />
              <h1 className={`text-2xl font-bold ${navTextColor}`}>KMSF</h1>
            </div>

            {/* Center - Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                link.scrollTo ? (
                  <button
                    key={link.name}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`${navTextColor} hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`${navTextColor} hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer`}
                  >
                    {link.name}
                  </a>
                )
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-200 ${isScrolled
                  ? 'dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-amber-400 bg-gray-100 hover:bg-gray-200 text-amber-600'
                  : 'dark:bg-white/10 dark:hover:bg-white/20 dark:text-white bg-gray-100 hover:bg-gray-200 text-amber-600'
                  }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {token ? (
                /* Logged In Profile Icon */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 dark:bg-gray-800 bg-gray-100 dark:border-amber-500/50 border-amber-500/70 border p-1 pr-3 rounded-full dark:hover:bg-gray-700 hover:bg-gray-200 transition-all duration-200 relative"
                  >
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold relative">
                      {user?.firstName?.[0] || 'U'}
                      {user?.membershipStatus === 'registered' && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-800 animate-pulse" />
                      )}
                      {user?.membershipStatus === 'active' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                          <Star size={8} className="fill-gray-900 text-gray-900" />
                        </span>
                      )}
                    </div>
                    <span className="dark:text-white text-gray-800 text-sm font-medium hidden sm:inline-block">
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
                        className="absolute right-0 mt-2 w-56 dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 border shadow-2xl rounded-lg overflow-hidden z-50"
                      >
                        <div className="p-4 border-b dark:border-gray-800 border-gray-200 dark:bg-gray-800 bg-gray-100">
                          <p className={`text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1 ${user?.membershipStatus === 'active' ? 'text-amber-400' :
                            user?.membershipStatus === 'registered' ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                            {user?.membershipStatus === 'active' && <Star size={10} className="fill-amber-400" />}
                            {user?.membershipStatus === 'active' ? 'Full Member' :
                              user?.membershipStatus === 'registered' ? 'Free Member' : 'Membership'}
                          </p>
                          <p className="dark:text-white text-gray-900 font-bold truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-[10px] dark:text-gray-400 text-gray-500 truncate">{user?.email}</p>
                        </div>

                        <div className="py-2">
                          {user?.membershipStatus === 'registered' && (
                            <button
                              onClick={() => { navigate('/membership'); setIsProfileOpen(false); }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-900 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 transition-all"
                            >
                              <Zap size={16} className="flex-shrink-0" />
                              <span>Upgrade to Full Member</span>
                            </button>
                          )}

                          <button
                            onClick={() => { setIsEditProfileOpen(true); setIsProfileOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm dark:text-gray-300 text-gray-600 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                          >
                            <Pencil size={18} />
                            <span>Edit Profile</span>
                          </button>

                          <button
                            onClick={() => { setIsIDCardOpen(true); setIsProfileOpen(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm dark:text-gray-300 text-gray-600 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
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
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t dark:border-gray-800/50 border-gray-200"
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
                  className={`${navTextColor} p-2 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center w-10 h-10 relative z-10`}
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
              className="lg:hidden dark:bg-gray-900 bg-white border-t dark:border-gray-800 border-gray-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block dark:text-white text-gray-800 dark:hover:bg-white/10 hover:bg-gray-100 px-3 py-4 rounded-md text-lg font-medium"
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
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};

export default Navbar;
