import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import LazyImage from '../components/LazyImage';
import useMobile from '../hooks/useMobile';

const Gallery = () => {
  const isMobile = useMobile();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showIndicators, setShowIndicators] = useState({ row1: true, row2: true, row3: true });

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  const galleryImages = [
    { id: 1, src: '/Events/Eve-1.jpg', alt: 'KMSF Event 1', category: 'Events' },
    { id: 2, src: '/Events/Eve-2.jpg', alt: 'KMSF Event 2', category: 'Events' },
    { id: 3, src: '/Events/Eve-3.jpg', alt: 'KMSF Event 3', category: 'Events' },
    { id: 4, src: '/Events/Eve-4.jpg', alt: 'KMSF Event 4', category: 'Events' },
    { id: 5, src: '/Team/Team-1.jpg', alt: 'KMSF Team', category: 'Team' },
    { id: 6, src: '/Events/Eve-1.jpg', alt: 'KMSF Event 5', category: 'Events' },
    { id: 7, src: '/Events/Eve-2.jpg', alt: 'KMSF Event 6', category: 'Events' },
    { id: 8, src: '/Events/Eve-3.jpg', alt: 'KMSF Event 7', category: 'Events' },
    { id: 9, src: '/Events/Eve-4.jpg', alt: 'KMSF Event 8', category: 'Events' },
    { id: 10, src: '/Team/Team-1.jpg', alt: 'KMSF Team 2', category: 'Team' },
    { id: 11, src: '/Events/Eve-1.jpg', alt: 'KMSF Event 9', category: 'Events' },
    { id: 12, src: '/Events/Eve-2.jpg', alt: 'KMSF Event 10', category: 'Events' },
    { id: 13, src: '/Events/Eve-3.jpg', alt: 'KMSF Event 11', category: 'Events' },
    { id: 14, src: '/Events/Eve-4.jpg', alt: 'KMSF Event 12', category: 'Events' },
    { id: 15, src: '/Team/Team-1.jpg', alt: 'KMSF Team 3', category: 'Team' },
    { id: 16, src: '/Events/Eve-1.jpg', alt: 'KMSF Event 13', category: 'Events' },
    { id: 17, src: '/Events/Eve-2.jpg', alt: 'KMSF Event 14', category: 'Events' },
    { id: 18, src: '/Events/Eve-3.jpg', alt: 'KMSF Event 15', category: 'Events' },
    { id: 19, src: '/Events/Eve-4.jpg', alt: 'KMSF Event 16', category: 'Events' },
    { id: 20, src: '/Team/Team-1.jpg', alt: 'KMSF Team 4', category: 'Team' },
    { id: 21, src: '/Events/Eve-1.jpg', alt: 'KMSF Event 17', category: 'Events' },
    { id: 22, src: '/Events/Eve-2.jpg', alt: 'KMSF Event 18', category: 'Events' },
    { id: 23, src: '/Events/Eve-3.jpg', alt: 'KMSF Event 19', category: 'Events' },
    { id: 24, src: '/Events/Eve-4.jpg', alt: 'KMSF Event 20', category: 'Events' },
  ];

  const categories = ['All', 'Events', 'Team'];
  const filteredImages = activeFilter === 'All' ? galleryImages : galleryImages.filter(img => img.category === activeFilter);

  const imagesPerRow = Math.ceil(filteredImages.length / 3);
  const row1 = filteredImages.slice(0, imagesPerRow);
  const row2 = filteredImages.slice(imagesPerRow, imagesPerRow * 2);
  const row3 = filteredImages.slice(imagesPerRow * 2);

  const goToNextImage = () => {
    if (selectedIndex < filteredImages.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedImage(filteredImages[newIndex]);
    }
  };

  const goToPreviousImage = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedImage(filteredImages[newIndex]);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedImage) {
        if (e.key === 'ArrowRight') goToNextImage();
        if (e.key === 'ArrowLeft') goToPreviousImage();
        if (e.key === 'Escape') { setSelectedImage(null); setSelectedIndex(null); }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, selectedIndex]);

  const useDragScroll = (ref) => {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      let isDown = false, startX, scrollLeft;
      const handleMouseDown = (e) => { isDown = true; el.style.cursor = 'grabbing'; el.style.userSelect = 'none'; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
      const handleMouseLeave = () => { isDown = false; el.style.cursor = 'grab'; el.style.userSelect = 'auto'; };
      const handleMouseUp = () => { isDown = false; el.style.cursor = 'grab'; el.style.userSelect = 'auto'; };
      const handleMouseMove = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; const walk = (x - startX) * 2; el.scrollLeft = scrollLeft - walk; };
      el.addEventListener('mousedown', handleMouseDown);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseup', handleMouseUp);
      el.addEventListener('mousemove', handleMouseMove);
      el.style.cursor = 'grab'; el.style.userSelect = 'none';
      return () => { el.removeEventListener('mousedown', handleMouseDown); el.removeEventListener('mouseleave', handleMouseLeave); el.removeEventListener('mouseup', handleMouseUp); el.removeEventListener('mousemove', handleMouseMove); };
    }, [ref]);
  };

  useDragScroll(row1Ref);
  useDragScroll(row2Ref);
  useDragScroll(row3Ref);

  const handleScroll = (ref, rowKey) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      setShowIndicators(prev => ({ ...prev, [rowKey]: !isAtEnd }));
    }
  };

  useEffect(() => {
    const row1Element = row1Ref.current, row2Element = row2Ref.current, row3Element = row3Ref.current;
    const h1 = () => handleScroll(row1Ref, 'row1'), h2 = () => handleScroll(row2Ref, 'row2'), h3 = () => handleScroll(row3Ref, 'row3');
    if (row1Element) row1Element.addEventListener('scroll', h1);
    if (row2Element) row2Element.addEventListener('scroll', h2);
    if (row3Element) row3Element.addEventListener('scroll', h3);
    return () => { if (row1Element) row1Element.removeEventListener('scroll', h1); if (row2Element) row2Element.removeEventListener('scroll', h2); if (row3Element) row3Element.removeEventListener('scroll', h3); };
  }, [filteredImages]);

  const renderRow = (images, rowIndex) => {
    return images.map((image, index) => {
      const directions = [{ x: 100, y: 0 }, { x: 0, y: 100 }, { x: 0, y: -100 }, { x: -100, y: 0 }];
      const direction = directions[index % 4];
      const globalIndex = filteredImages.findIndex(img => img.id === image.id);

      if (isMobile) {
        return (
          <div key={image.id} className="group relative flex-shrink-0 w-80 h-80 overflow-hidden dark:bg-gray-800 bg-gray-200 cursor-pointer select-none" onClick={() => { setSelectedImage(image); setSelectedIndex(globalIndex); }}>
            <LazyImage src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 text-xs font-bold mb-3">{image.category}</span>
                <p className="text-white font-semibold text-lg">{image.alt}</p>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/50 transition-all duration-300"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        );
      }

      return (
        <motion.div key={image.id} layout initial={{ opacity: 0, x: direction.x, y: direction.y }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, delay: (rowIndex * imagesPerRow + index) * 0.05 }} className="group relative flex-shrink-0 w-80 h-80 overflow-hidden dark:bg-gray-800 bg-gray-200 cursor-pointer select-none" onClick={() => { setSelectedImage(image); setSelectedIndex(globalIndex); }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <LazyImage src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 text-xs font-bold mb-3">{image.category}</span>
              <p className="text-white font-semibold text-lg">{image.alt}</p>
            </div>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/50 transition-all duration-300"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      );
    });
  };

  return (
    <section className="min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-r from-gray-50 via-white to-gray-50"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isMobile ? (
            <div className="text-center">
              <span className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4">Memories & Moments</span>
              <h1 className="text-6xl md:text-8xl font-bold dark:text-white text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">Our Gallery</span>
              </h1>
              <p className="text-xl md:text-2xl dark:text-gray-300 text-gray-600 max-w-3xl mx-auto leading-relaxed">Capturing moments that define our journey in Kurdish healthcare and scientific excellence</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4">Memories & Moments</motion.span>
              <h1 className="text-6xl md:text-8xl font-bold dark:text-white text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">Our Gallery</span>
              </h1>
              <p className="text-xl md:text-2xl dark:text-gray-300 text-gray-600 max-w-3xl mx-auto leading-relaxed">Capturing moments that define our journey in Kurdish healthcare and scientific excellence</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mt-5 mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {isMobile ? (
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveFilter(category)} className={`px-8 py-3 font-semibold transition-all duration-300 ${activeFilter === category ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' : 'dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-300'}`}>{category}</button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveFilter(category)} className={`px-8 py-3 font-semibold transition-all duration-300 ${activeFilter === category ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' : 'dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-300'}`}>{category}</button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Swipe Indicator */}
      {isMobile ? (
        <div className="flex items-center justify-center gap-3 mb-8"><div className="flex items-center gap-2 text-yellow-500"><span className="text-sm font-semibold uppercase tracking-wider">Drag or Swipe to explore</span><ChevronRight className="w-5 h-5" /><ChevronRight className="w-5 h-5 -ml-3" /></div></div>
      ) : (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.8 }} className="flex items-center justify-center gap-3 mb-8">
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-2 text-yellow-500"><span className="text-sm font-semibold uppercase tracking-wider">Drag or Swipe to explore</span><ChevronRight className="w-5 h-5" /><ChevronRight className="w-5 h-5 -ml-3" /></motion.div>
        </motion.div>
      )}

      {/* Gallery Rows */}
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none;scroll-behavior:smooth}`}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {[{ ref: row1Ref, data: row1, key: 'row1', rowIdx: 0 }, { ref: row2Ref, data: row2, key: 'row2', rowIdx: 1 }, { ref: row3Ref, data: row3, key: 'row3', rowIdx: 2 }].map(({ ref, data, key, rowIdx }) => (
          <div key={key} className="relative">
            <div ref={ref} className="overflow-x-auto hide-scrollbar">
              <motion.div layout className="flex gap-6 min-w-min" style={{ width: 'fit-content' }}>{renderRow(data, rowIdx)}</motion.div>
            </div>
            {showIndicators[key] && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-0 top-0 bottom-0 w-32 dark:bg-gradient-to-l dark:from-gray-900 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none flex items-center justify-end pr-4">
                <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}><ChevronRight className="w-8 h-8 text-yellow-500" /></motion.div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => { setSelectedImage(null); setSelectedIndex(null); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25 }} className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative overflow-hidden shadow-2xl">
              <LazyImage src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto max-h-[85vh] object-contain select-none" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 md:p-8">
                <span className="inline-block bg-yellow-500 text-gray-900 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold mb-2 md:mb-3">{selectedImage.category}</span>
                <p className="text-white font-semibold text-lg md:text-2xl mb-1 md:mb-2">{selectedImage.alt}</p>
                <p className="text-gray-400 text-xs md:text-sm">{selectedIndex + 1} / {filteredImages.length}</p>
              </div>
            </div>
            {selectedIndex > 0 && (<button onClick={goToPreviousImage} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-2 md:p-4 transition-all duration-300"><ChevronLeft className="w-5 h-5 md:w-8 md:h-8" /></button>)}
            {selectedIndex < filteredImages.length - 1 && (<button onClick={goToNextImage} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-2 md:p-4 transition-all duration-300"><ChevronRight className="w-5 h-5 md:w-8 md:h-8" /></button>)}
            <button onClick={() => { setSelectedImage(null); setSelectedIndex(null); }} className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-4 transition-all duration-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      {isMobile ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 p-12 md:p-16 shadow-2xl">
            <div className="relative text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Want to be part of our story?</h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join our community and help create more memorable moments for Kurdish healthcare and scientific advancement.</p>
              <button className="bg-white text-gray-900 px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all duration-300">Get Involved</button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 p-12 md:p-16 shadow-2xl">
            <div className="relative text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Want to be part of our story?</h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join our community and help create more memorable moments for Kurdish healthcare and scientific advancement.</p>
              <button className="bg-white text-gray-900 px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all duration-300">Get Involved</button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
