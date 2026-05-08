import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, X, Images, Calendar, MapPin,
    FolderOpen, Folder, ArrowLeft, Loader2, AlertCircle
} from 'lucide-react';
import { useGetEventsQuery } from '../store/api/apiSlice';
import LazyImage from '../components/LazyImage';

// Helper: has this event's date already passed?
const isPastEvent = (dateStr) => new Date(dateStr) < new Date();

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
            {/* Stacked folder effect */}
            <div className="relative">
                <div
                    className="absolute -bottom-2 left-2 right-2 h-full dark:bg-gray-700 bg-gray-300 transition-all duration-300 rounded-sm"
                    style={{ transform: isHovered ? 'rotate(3deg) translateY(-4px)' : 'rotate(2deg)' }}
                />
                <div
                    className="absolute -bottom-1 left-1 right-1 h-full dark:bg-gray-600 bg-gray-200 transition-all duration-300 rounded-sm"
                    style={{ transform: isHovered ? 'rotate(-2deg) translateY(-2px)' : 'rotate(-1deg)' }}
                />

                {/* Main card */}
                <div className="relative overflow-hidden dark:bg-gray-800 bg-white shadow-xl border dark:border-gray-700 border-gray-200 rounded-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-yellow-500/10">
                    {/* Cover image */}
                    <div className="relative h-52 overflow-hidden">
                        <LazyImage
                            src={album.cover}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Photo count badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Images size={13} className="text-yellow-400" />
                            <span className="text-white text-xs font-semibold">{album.images.length} photos</span>
                        </div>

                        {/* Hover overlay */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="bg-yellow-500/90 backdrop-blur-sm px-5 py-2.5 flex items-center gap-2 shadow-lg">
                                        <FolderOpen size={18} className="text-gray-900" />
                                        <span className="text-gray-900 font-bold text-sm">Open Album</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <h3 className="dark:text-white text-gray-900 font-bold text-base leading-snug mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                            {album.title}
                        </h3>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs dark:text-gray-400 text-gray-500">
                                <Calendar size={12} className="text-yellow-500 flex-shrink-0" />
                                <span>{new Date(album.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs dark:text-gray-400 text-gray-500">
                                <MapPin size={12} className="text-yellow-500 flex-shrink-0" />
                                <span>{album.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-0.5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-transparent transition-all duration-300 opacity-0 group-hover:opacity-100" />
                </div>
            </div>
        </motion.div>
    );
};

// ─── Album Viewer ─────────────────────────────────────────────────────────────
const AlbumViewer = ({ album, onBack, onImageClick }) => (
    <motion.div
        key="album-viewer"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ duration: 0.4 }}
    >
        <div className="flex items-center gap-4 mb-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 dark:text-gray-400 text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">All Albums</span>
            </button>
            <div className="h-px flex-1 dark:bg-gray-700 bg-gray-200" />
        </div>

        <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
                <FolderOpen size={22} className="text-yellow-500" />
                <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900">{album.title}</h2>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm dark:text-gray-400 text-gray-500">
                    <Calendar size={14} className="text-yellow-500" />
                    {new Date(album.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 text-sm dark:text-gray-400 text-gray-500">
                    <MapPin size={14} className="text-yellow-500" /> {album.location}
                </span>
                <span className="flex items-center gap-1.5 text-sm dark:text-gray-400 text-gray-500">
                    <Images size={14} className="text-yellow-500" /> {album.images.length} photos
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {album.images.map((img, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="group relative aspect-square overflow-hidden dark:bg-gray-800 bg-gray-100 cursor-pointer rounded-sm"
                    onClick={() => onImageClick(idx)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <LazyImage
                        src={img}
                        alt={`${album.title} photo ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
            ))}
        </div>
    </motion.div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ album, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const images = album.images;

    const goNext = useCallback(() => setCurrentIndex(i => Math.min(i + 1, images.length - 1)), [images.length]);
    const goPrev = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), []);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goNext, goPrev, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative overflow-hidden shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`${album.title} photo ${currentIndex + 1}`}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.25 }}
                            className="w-full max-h-[80vh] object-contain"
                        />
                    </AnimatePresence>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                        <p className="text-white font-semibold text-lg">{album.title}</p>
                        <p className="text-gray-400 text-sm mt-0.5">{currentIndex + 1} / {images.length}</p>
                    </div>
                </div>

                {currentIndex > 0 && (
                    <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg">
                        <ChevronLeft size={28} />
                    </button>
                )}
                {currentIndex < images.length - 1 && (
                    <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg">
                        <ChevronRight size={28} />
                    </button>
                )}

                <button onClick={onClose} className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg">
                    <X size={22} />
                </button>

                {/* Thumbnail strip */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 w-14 h-10 overflow-hidden transition-all duration-200 ${idx === currentIndex ? 'ring-2 ring-yellow-500 opacity-100' : 'opacity-50 hover:opacity-80'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Gallery Page ────────────────────────────────────────────────────────
const Gallery = () => {
    const [openAlbum, setOpenAlbum] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const { data: eventsData, isLoading, isError } = useGetEventsQuery();

    // Build albums from past events that have at least one image
    const albums = React.useMemo(() => {
        if (!eventsData?.data) return [];
        return eventsData.data
            .filter(ev => isPastEvent(ev.date) && ev.images && ev.images.length > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
            .map(ev => ({
                id: ev._id,
                title: ev.title,
                date: ev.date,
                location: ev.location,
                category: ev.category,
                cover: ev.images[0],
                images: ev.images,
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

    return (
        <section className="min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-50">

            {/* Hero */}
            <div className="relative overflow-hidden pt-32 pb-14">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-600 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4">
                        Memories &amp; Moments
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-bold dark:text-white text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">Our Gallery</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl dark:text-gray-300 text-gray-600 max-w-2xl mx-auto">
                        Browse event albums capturing our journey in Kurdish healthcare and scientific excellence.
                    </motion.p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={40} className="animate-spin text-yellow-500" />
                        <p className="dark:text-gray-400 text-gray-500">Loading albums…</p>
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-400">
                        <AlertCircle size={40} />
                        <p>Could not load gallery. Please try again later.</p>
                    </div>
                )}

                {/* No past events yet */}
                {!isLoading && !isError && albums.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 dark:text-gray-500 text-gray-400">
                        <Folder size={48} className="opacity-30" />
                        <p className="text-lg font-medium">No albums yet</p>
                        <p className="text-sm">Albums will appear here automatically once events have ended and their photos have been uploaded.</p>
                    </div>
                )}

                {/* Breadcrumb */}
                {!isLoading && !isError && albums.length > 0 && (
                    <AnimatePresence mode="wait">
                        {!openAlbum && (
                            <motion.div key="bc-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 mb-8 text-sm dark:text-gray-400 text-gray-500">
                                <Folder size={16} className="text-yellow-500" />
                                <span className="text-yellow-500 font-semibold">All Albums</span>
                                <span>·</span>
                                <span>{albums.length} albums</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                <AnimatePresence mode="wait">
                    {openAlbum ? (
                        <AlbumViewer
                            key={`album-${openAlbum.id}`}
                            album={openAlbum}
                            onBack={handleBack}
                            onImageClick={setLightboxIndex}
                        />
                    ) : (
                        !isLoading && !isError && albums.length > 0 && (
                            <motion.div key="albums-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {albums.map((album, index) => (
                                    <AlbumCard key={album.id} album={album} index={index} onClick={handleOpenAlbum} />
                                ))}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {openAlbum && lightboxIndex !== null && (
                    <Lightbox album={openAlbum} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
