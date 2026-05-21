import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Sparkles } from 'lucide-react';

// Floating particle
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -80], opacity: [1, 0], scale: [1, 0.3] }}
    transition={{ duration: 1.8 + Math.random(), ease: 'easeOut', delay: Math.random() * 0.5 }}
  />
);

const MEMBERSHIP_PARTICLES = [
  { width: 10, height: 10, background: '#F59E0B', left: '15%', top: '70%' },
  { width: 8, height: 8, background: '#FCD34D', left: '25%', top: '60%' },
  { width: 12, height: 12, background: '#C8A441', left: '40%', top: '75%' },
  { width: 6, height: 6, background: '#FDE68A', left: '55%', top: '65%' },
  { width: 10, height: 10, background: '#F59E0B', left: '70%', top: '72%' },
  { width: 8, height: 8, background: '#FCD34D', left: '80%', top: '60%' },
  { width: 14, height: 14, background: '#C8A441', left: '88%', top: '68%' },
];

const DONATION_PARTICLES = [
  { width: 10, height: 10, background: '#34D399', left: '10%', top: '70%' },
  { width: 8, height: 8, background: '#6EE7B7', left: '22%', top: '62%' },
  { width: 12, height: 12, background: '#10B981', left: '38%', top: '76%' },
  { width: 6, height: 6, background: '#A7F3D0', left: '52%', top: '64%' },
  { width: 10, height: 10, background: '#34D399', left: '68%', top: '73%' },
  { width: 8, height: 8, background: '#6EE7B7', left: '78%', top: '61%' },
  { width: 14, height: 14, background: '#10B981', left: '90%', top: '69%' },
];

/**
 * CelebrationModal
 * @param {boolean} isOpen
 * @param {'membership' | 'donation'} type
 * @param {number} [amount] - donated amount (donation type only)
 * @param {function} onClose
 */
const CelebrationModal = ({ isOpen, type = 'membership', amount, onClose }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 3000);
    }
    return () => clearTimeout(timerRef.current);
  }, [isOpen, onClose]);

  const isMembership = type === 'membership';
  const particles = isMembership ? MEMBERSHIP_PARTICLES : DONATION_PARTICLES;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="celebration-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          {/* Modal Card */}
          <motion.div
            key="celebration-card"
            initial={{ opacity: 0, scale: 0.75, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
            style={{
              background: isMembership
                ? 'linear-gradient(145deg, #1a1200 0%, #2d1f00 40%, #1a1200 100%)'
                : 'linear-gradient(145deg, #001a0d 0%, #00311a 40%, #001a0d 100%)',
              border: isMembership ? '1px solid rgba(248,197,55,0.3)' : '1px solid rgba(52,211,153,0.3)',
            }}
          >
            {/* Animated glow bg */}
            <motion.div
              className="absolute inset-0 opacity-20 pointer-events-none"
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: isMembership
                  ? 'radial-gradient(ellipse at 50% 50%, #F59E0B 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at 50% 50%, #10B981 0%, transparent 70%)',
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {particles.map((p, i) => (
                <Particle key={i} style={p} />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-8 py-12">
              {/* Icon ring */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="relative mb-6"
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: isMembership
                      ? 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
                    boxShadow: isMembership
                      ? '0 0 40px rgba(245,158,11,0.4)'
                      : '0 0 40px rgba(16,185,129,0.4)',
                  }}
                >
                  {isMembership ? (
                    <Star size={44} className="text-amber-400 fill-amber-400" />
                  ) : (
                    <Heart size={44} className="text-emerald-400 fill-emerald-400" />
                  )}
                </div>
                {/* Orbit sparkle */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={20} className={isMembership ? 'text-yellow-300' : 'text-emerald-300'} />
                </motion.div>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-extrabold text-white mb-2 leading-tight"
              >
                {isMembership ? (
                  <>Welcome to <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">KMSF!</span></>
                ) : (
                  <>Thank you for <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">Giving!</span></>
                )}
              </motion.h2>

              {/* Amount badge (donations only) */}
              {!isMembership && amount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-1 mb-3 px-5 py-1.5 rounded-full font-bold text-lg"
                  style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#6EE7B7' }}
                >
                  £{amount.toFixed(2)} donated
                </motion.div>
              )}

              {/* Body text */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs"
              >
                {isMembership
                  ? "Your membership is now active. You're now part of a community dedicated to advancing Kurdish healthcare and scientific excellence."
                  : 'Your generous contribution directly supports Kurdish healthcare, education, and community initiatives. Every pound makes a real difference.'}
              </motion.p>

              {/* Progress bar auto-close indicator */}
              <motion.div className="w-full h-1 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: isMembership ? '#F59E0B' : '#10B981' }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </motion.div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="px-8 py-2.5 rounded-full font-bold text-sm text-gray-900 transition-opacity hover:opacity-90"
                style={{ background: isMembership ? 'linear-gradient(90deg,#F59E0B,#FCD34D)' : 'linear-gradient(90deg,#10B981,#34D399)' }}
              >
                {isMembership ? 'Go to My Account' : 'Close'}
              </motion.button>

              <p className="text-white/30 text-xs mt-3">Closes automatically in 3 seconds</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationModal;
