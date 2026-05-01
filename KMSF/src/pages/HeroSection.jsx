import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import LazyImage from '../components/LazyImage';
import useMobile from '../hooks/useMobile';

export default function HeroSection() {
  const isMobile = useMobile();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const scale = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <section
      className="relative w-full min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Background World Map */}
      <img
        src="/worldmap-1.png"
        alt="World Map"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
      />

      {/* Main Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-24 max-w-7xl mx-auto py-32 sm:py-10 lg:py-0 gap-8 lg:gap-12 pointer-events-none select-none">

        {/* Left Side - Text Content */}
        <motion.div
          className="flex-1 text-center lg:text-left w-full"
          initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: isMobile ? 0.5 : 1 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Kurdistan<br />
            Medical and<br />
            Scientific<br />
            Federation
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
            Connecting healthcare professionals and scientists across the World
          </p>
        </motion.div>

        {/* Right Side - KMSF Logo */}
        <motion.div
          className="flex flex-1 justify-center items-center w-full lg:w-auto"
          initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.5 : 1, delay: isMobile ? 0 : 0.3 }}
        >
          <motion.img
            src="/KMSF_logo.png"
            alt="KMSF Logo"
            className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[26rem] xl:h-[26rem] object-contain drop-shadow-2xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: 'drop-shadow(0 0 40px rgba(200, 164, 65, 0.35))'
            }}
          />
        </motion.div>

      </div>

      {/* Scroll Down - Centered Bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer select-none"
        style={{ opacity }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        {/* Label */}
        <motion.span
          className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F2AE02]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll Down
        </motion.span>

        {/* Glowing ring + chevrons */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute w-14 h-14 rounded-full border border-[#C8A441]/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Inner ring */}
          <div className="w-10 h-10 rounded-full border border-[#C8A441]/60 flex items-center justify-center">
            {/* Stacked animated chevrons */}
            <div className="flex flex-col items-center -space-y-2">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.svg
                  key={i}
                  className="w-4 h-4"
                  style={{ opacity: 1 - i * 0.25 }}
                  fill="none"
                  stroke="#F2AE02"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, 5, 0], opacity: [0.4 + (2 - i) * 0.2, 1, 0.4 + (2 - i) * 0.2] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay }}
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t dark:from-gray-900 from-slate-900 to-transparent"></div>
    </section>
  );
}
