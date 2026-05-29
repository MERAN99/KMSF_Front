import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, X, Images, Calendar, MapPin,
    FolderOpen, ArrowLeft, Loader2, AlertCircle
} from 'lucide-react';
import { useGetEventsQuery } from '../store/api/apiSlice';
import LazyImage from '../components/LazyImage';
import { API_BASE_URL } from '../config';

const IMAGES_PER_PAGE = 12;

// Helper: has this event's date already passed?
const isPastEvent = (dateStr) => {
    const eventDate = new Date(dateStr);
    const threeDaysAfter = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    return new Date() > threeDaysAfter;
};

// Format image URL
const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) {
        return `${API_BASE_URL}${url}`;
    }
    return url;
};

// ─── Album Card ───────────────────────────────────────────────────────────────
const AlbumCard = ({ album, index, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className="group cursor-pointer"
            onClick={() => onClick(album)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                <div className="absolute -bottom-2 left-2 right-2 h-full dark:bg-gray-700 bg-gray-300 transition-all duration-300 rounded-sm"
                    style={{ transform: isHovered ? 'rotate(3deg) translateY(-4px)' : 'rotate(2deg)' }} />
                <div className="absolute -bottom-1 left-1 right-1 h-full dark:bg-gray-600 bg-gray-200 transition-all duration-300 rounded-sm"
                    style={{ transform: isHovered ? 'rotate(-2deg) translateY(-2px)' : 'rotate(-1deg)' }} />

                <div className="relative overflow-hidden dark:bg-gray-800 bg-white shadow-xl border dark:border-gray-700 border-gray-200 rounded-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-[#C8A441]/10">
                    <div className="relative h-52 overflow-hidden">
                    {album.cover ? (
                        <LazyImage
                            src={getImageUrl(album.cover)}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center dark:bg-gray-800 bg-gray-100">
                            <Images size={40} className="text-gray-400 opacity-30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Images size={13} className="text-[#C8A441]" />
                            <span className="text-white text-xs font-semibold">{album.totalImages} photos</span>
                        </div>

                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="bg-[#C8A441]/90 backdrop-blur-sm px-5 py-2.5 flex items-center gap-2 shadow-lg rounded-full text-white">
                                        <FolderOpen size={18} />
                                        <span className="font-bold text-sm">Open Album</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-4">
                        <h3 className="dark:text-white text-gray-900 font-bold text-base leading-snug mb-2 group-hover:text-[#C8A441] transition-colors line-clamp-2">
                            {album.title}
                        </h3>
                        <div className="flex flex-col gap-1">
                            {album.date && (
                                <div className="flex items-center gap-1.5 text-xs dark:text-gray-400 text-gray-500">
                                    <Calendar size={12} className="text-[#C8A441] flex-shrink-0" />
                                    <span>{new Date(album.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            )}
                            {album.location && (
                                <div className="flex items-center gap-1.5 text-xs dark:text-gray-400 text-gray-500">
                                    <MapPin size={12} className="text-[#C8A441] flex-shrink-0" />
                                    <span>{album.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Event Album Viewer ───────────────────────────────────────────────────────
const EventAlbumViewer = ({ album, onBack, onImageClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(album.images.length / IMAGES_PER_PAGE);
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const paginatedImages = album.images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 250, behavior: 'smooth' });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={onBack} className="group flex items-center gap-2 dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 transition-colors mb-8 bg-transparent border-0">
                <div className="p-2 rounded-full dark:bg-gray-800 bg-gray-100 group-hover:bg-[#C8A441] group-hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span className="font-medium">Back to Albums</span>
            </button>

            <div className="mb-10 text-center max-w-3xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full dark:bg-gray-800 bg-gray-100 text-[#C8A441] text-xs font-bold tracking-wider uppercase mb-4">
                    {album.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4 leading-tight">{album.title}</h2>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm dark:text-gray-400 text-gray-500 mb-6">
                    {album.date && (
                        <div className="flex items-center gap-2"><Calendar size={16} className="text-[#C8A441]" /> <span>{new Date(album.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                    )}
                    {album.location && (
                        <div className="flex items-center gap-2"><MapPin size={16} className="text-[#C8A441]" /> <span>{album.location}</span></div>
                    )}
                </div>
                <p className="text-lg dark:text-gray-300 text-gray-600 font-light">{album.description}</p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {paginatedImages.map((img, idx) => {
                    const globalIdx = startIndex + idx;
                    return (
                        <motion.div
                            key={globalIdx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all"
                            onClick={() => onImageClick(globalIdx, album.images.map(i => ({ url: getImageUrl(i), thumb: getImageUrl(i) })))}
                        >
                            <LazyImage src={getImageUrl(img)} alt={`Gallery Image ${globalIdx + 1}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white/20 p-3 rounded-full text-white backdrop-blur-md">
                                    <Images size={24} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pb-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="p-2 rounded-lg border dark:border-gray-700 border-gray-300 dark:bg-gray-800 bg-white dark:text-white text-gray-700 hover:bg-[#C8A441] hover:text-white dark:hover:bg-[#C8A441] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all border ${
                                currentPage === page
                                    ? 'bg-[#C8A441] text-white border-[#C8A441] shadow-lg shadow-[#C8A441]/20'
                                    : 'dark:border-gray-700 border-gray-300 dark:bg-gray-800 bg-white dark:text-gray-400 text-gray-600 hover:bg-[#C8A441] hover:text-white dark:hover:bg-[#C8A441] dark:hover:text-white'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="p-2 rounded-lg border dark:border-gray-700 border-gray-300 dark:bg-gray-800 bg-white dark:text-white text-gray-700 hover:bg-[#C8A441] hover:text-white dark:hover:bg-[#C8A441] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </motion.div>
    );
};

// ─── Lightbox Modal ───────────────────────────────────────────────────────────
const LightboxModal = ({ images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const scrollContainerRef = useRef(null);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, images.length]);

    // Keep active thumbnail in view
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const activeThumb = container.children[currentIndex];
            if (activeThumb) {
                const scrollLeft = activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [currentIndex]);

    const handlePrev = useCallback((e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const handleNext = useCallback((e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50">
                <X size={28} />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-[75vh] flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex].url}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm"
                        onClick={(e) => e.stopPropagation()}
                    />
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button onClick={handlePrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 md:p-4 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
                            <ChevronLeft size={32} />
                        </button>
                        <button onClick={handleNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 md:p-4 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            <div className="h-[15vh] w-full flex flex-col items-center justify-center pb-6">
                <p className="text-white/50 text-sm font-medium mb-3">
                    {currentIndex + 1} <span className="mx-1 text-white/30">/</span> {images.length}
                </p>
                <div ref={scrollContainerRef} className="flex gap-2 max-w-[90vw] overflow-x-auto snap-x snap-mandatory hide-scrollbar py-2 px-4" onClick={e => e.stopPropagation()}>
                    {images.map((img, idx) => (
                        <button key={idx} onClick={() => setCurrentIndex(idx)} className={`snap-center flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden transition-all duration-300 ${idx === currentIndex ? 'ring-2 ring-[#C8A441] opacity-100 scale-110' : 'opacity-40 hover:opacity-100'}`}>
                            <img src={img.thumb} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Gallery Page ────────────────────────────────────────────────────────
const Gallery = () => {
    const [openAlbum, setOpenAlbum] = useState(null);
    const [lightbox, setLightbox] = useState(null); // { index, images }

    const { data: eventsData, isLoading, isError } = useGetEventsQuery();

    // Event-based albums
    const eventAlbums = React.useMemo(() => {
        if (!eventsData?.data) return [];
        return eventsData.data
            .filter(ev => isPastEvent(ev.date) && ev.galleryImages && ev.galleryImages.length > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(ev => ({
                id: ev._id,
                title: ev.title,
                date: ev.date,
                location: ev.location,
                category: ev.category,
                description: ev.description,
                // Fallback to poster image if no gallery images
                cover: ev.galleryImages[0] || ev.images[0],
                images: ev.galleryImages,
                totalImages: ev.galleryImages.length,
            }));
    }, [eventsData]);

    const handleOpenAlbum = (album) => {
        setOpenAlbum(album);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleBack = () => {
        setOpenAlbum(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openLightbox = (idx, images) => setLightbox({ index: idx, images });

    return (
        <section className="min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-50">

            {/* Hero */}
            <div className="relative overflow-hidden pt-44 pb-14">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C8A441] blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F2AE02] blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-block text-[#C8A441] font-semibold text-sm uppercase tracking-widest mb-4">
                        Memories &amp; Moments
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-bold dark:text-white text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Our Gallery</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl dark:text-gray-300 text-gray-600 max-w-2xl mx-auto">
                        Browse event albums capturing our journey in healthcare and scientific excellence.
                    </motion.p>
                </div>
            </div>

            <div className="pb-24">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 animate-spin text-[#C8A441]" />
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center h-64 dark:text-red-400 text-red-500">
                        <AlertCircle size={40} className="mb-4" />
                        <p className="text-lg">Failed to load albums</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {openAlbum ? (
                            <EventAlbumViewer
                                key="album-viewer"
                                album={openAlbum}
                                onBack={handleBack}
                                onImageClick={openLightbox}
                            />
                        ) : (
                            <motion.div
                                key="album-grid"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                            >
                                {eventAlbums.length === 0 ? (
                                    <div className="text-center py-24 dark:text-gray-500 text-gray-400">
                                        <Images size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No albums available yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                                        {eventAlbums.map((album, idx) => (
                                            <AlbumCard key={album.id} album={album} index={idx} onClick={handleOpenAlbum} />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <LightboxModal
                        images={lightbox.images}
                        initialIndex={lightbox.index}
                        onClose={() => setLightbox(null)}
                    />
                )}
            </AnimatePresence>
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default Gallery;
