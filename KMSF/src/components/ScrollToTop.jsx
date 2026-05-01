import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
      setIsVisible(progress > 0.05);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const BAR_HEIGHT = 80; // px — total track height
  const fillHeight = scrollProgress * BAR_HEIGHT;
  const percentLabel = Math.round(scrollProgress * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-8 right-6 z-50 flex flex-col items-center gap-2 group"
        >
          {/* Percentage label */}
          <motion.span
            className="text-[10px] font-bold tracking-widest text-[#F2AE02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {percentLabel}%
          </motion.span>

          {/* Arrow button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll to top"
            className="relative w-8 h-8 flex items-center justify-center rounded-full border border-[#C8A441]/60 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:border-[#F2AE02] hover:shadow-[0_0_16px_rgba(242,174,2,0.4)] transition-all duration-300"
          >
            {/* Animated arrow */}
            <motion.svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="#F2AE02" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M18 15l-6-6-6 6" />
            </motion.svg>
          </motion.button>

          {/* Track */}
          <div
            className="relative w-[3px] rounded-full overflow-hidden bg-white/10"
            style={{ height: BAR_HEIGHT }}
          >
            {/* Glow behind fill */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 rounded-full blur-sm bg-[#F2AE02]/40 transition-all duration-150"
              style={{ height: fillHeight }}
            />
            {/* Gold fill bar — grows from bottom */}
            <motion.div
              className="absolute bottom-0 left-0 w-full rounded-full"
              style={{
                height: fillHeight,
                background: 'linear-gradient(to top, #C8A441, #F2AE02)',
                boxShadow: '0 0 6px rgba(242,174,2,0.7)',
              }}
              transition={{ duration: 0.08 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

