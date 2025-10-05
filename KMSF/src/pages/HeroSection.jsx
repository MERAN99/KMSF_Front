import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import LazyImage from '../components/LazyImage';
import useMobile from '../hooks/useMobile';

export default function HeroSection() {
  const isMobile = useMobile();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const scale = useTransform(scrollY, [0, 100], [1, 0]);

  // Images with different directions for pop-out effect
  const stackImages = [
    { id: 1, direction: 'left', rotate: -8, x: -40, y: -20 ,image: "/Events/Eve-4.jpg", shadowColor: 'rgba(54, 191, 90, 0.6)'},
    { id: 2, direction: 'center', rotate: 0, x: 0, y: 0,image: "/Team/Team-1.jpg", shadowColor: 'rgba(255, 255, 255, 0.2)' },
    { id: 3, direction: 'right', rotate: 8, x: 40, y: -20,image: "/Events/Eve-3.jpg", shadowColor: 'rgba(238, 68, 71, 0.3)' },
  ];

  return (
    <section 
      className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Background World Map */}
      <img
        src="/Worldmap.png"
        alt="World Map"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />

      {/* Main Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-24 max-w-7xl mx-auto py-32 sm:py-10 lg:py-0 gap-4 lg:gap-12">
        
        {/* Left Side - Text Content */}
        <motion.div
          className="flex-1 text-center lg:text-left w-full"
          initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: isMobile ? 0 : 0 }}
          transition={{ duration: isMobile ? 0.5 : 1 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Kurdistan<br />
            Medical and<br />
            Scientific<br />
            Federation
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
                 Connecting healthcare professionals and scientists across the World          
                 </p>
        </motion.div>

        {/* Right Side - Popped Out Images */}
        <motion.div
          className="flex flex-1 justify-center items-center w-full lg:w-auto"
          initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.5 : 1, delay: isMobile ? 0 : 0.3 }}
        >
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-80 sm:h-96 md:h-[28rem] flex items-center justify-center">
            {stackImages.map((img, index) => (
              <motion.div
                key={img.id}
                className="absolute w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 bg-gradient-to-br from-[#C8A441] to-[#F2AE02] rounded-xl sm:rounded-2xl"
                initial={{ opacity: 0, scale: 0.5, rotate: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: img.rotate,
                  x: isMobile ? (index === 0 ? -20 : index === 1 ? 0 : 20) : img.x,
                  y: isMobile ? (index === 0 ? -10 : index === 1 ? 0 : -10) : img.y
                }}
                transition={{
                  duration: isMobile ? 0.4 : 0.8,
                  delay: index * (isMobile ? 0.1 : 0.15) + (isMobile ? 0.2 : 0.5),
                  type: isMobile ? "tween" : "spring",
                  stiffness: isMobile ? undefined : 100
                }}
                whileHover={isMobile ? {} : {
                  scale: 1.05,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                style={{
                  zIndex: index === 1 ? 30 : 20,
                  boxShadow: `0 25px 50px -12px ${img.shadowColor}`
                }}
              >
                {/* Lazy loaded images */}
                <LazyImage
                  src={img.image}
                  alt={`Federation ${img.id}`}
                  className="w-full h-full object-cover rounded-sm sm:rounded-2xl"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Triangle */}
      <motion.div
        className="absolute bottom-0 right-0 w-46 h-46 md:w-60 md:h-60 flex items-center justify-center text-white text-lg md:text-xl font-bold"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441] to-[#F2AE02]" style={{clipPath: 'polygon(100% 100%, 100% 0%, 0% 100%)'}}></div>
        <motion.span
          className="absolute flex-col items-center justify-center left-28 top-20 md:left-32 md:top-30 z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
           <div>
              Scroll Down
           </div>
          
          <h1>
            <svg className="w-6 h-6 mx-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </h1>
        </motion.span>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </section>
  );
}
