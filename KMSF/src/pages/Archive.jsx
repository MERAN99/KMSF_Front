import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, X, Loader2, AlertCircle, Archive, Images, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { useGetEventsQuery, useGetArchiveFoldersQuery, useGetArchiveImagesQuery } from '../store/api/apiSlice';
import LazyImage from '../components/LazyImage';

// Helper: has this event's date already passed?
const isPastEvent = (dateStr) => {
    const eventDate = new Date(dateStr);
    const threeDaysAfter = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    return new Date() > threeDaysAfter;
};

const IMAGES_PER_PAGE = 12;

// ─── Cloudinary folder card — matches other archive event cards exactly ───────
const CloudinaryFolderSection = ({ folder, index }) => {
    const [open, setOpen] = useState(false);
    const [cursor, setCursor] = useState(undefined);
    const [cursorHistory, setCursorHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [lightboxIdx, setLightboxIdx] = useState(null);

    const { data, isFetching, isError } = useGetArchiveImagesQuery(
        { folder: folder.path, limit: IMAGES_PER_PAGE, cursor },
        { skip: !open }
    );

    const images = data?.images || [];
    const total = data?.total || 0;
    const nextCursor = data?.nextCursor;
    const totalPages = total ? Math.ceil(total / IMAGES_PER_PAGE) : '?';

    const handleNext = () => {
        if (!nextCursor) return;
        setCursorHistory(p => [...p, cursor]);
        setCursor(nextCursor);
        setPage(p => p + 1);
    };
    const handlePrev = () => {
        if (!cursorHistory.length) return;
        const prev = [...cursorHistory];
        const c = prev.pop();
        setCursorHistory(prev);
        setCursor(c);
        setPage(p => p - 1);
    };

    // Cover comes from the pre-fetched folder data — available before user opens the card
    const coverThumb = folder.coverThumb || null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: (index || 0) * 0.08 }}
            className="group relative dark:bg-gray-900 bg-white overflow-hidden hover:shadow-xl transition-all duration-500 border dark:border-gray-700/50 border-gray-200"
        >
            {/* Horizontal card — same as event cards */}
            <div className="flex flex-col lg:flex-row">

                {/* Image panel */}
                <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden dark:bg-gray-800 bg-gray-100">
                    {coverThumb ? (
                        <img
                            src={coverThumb}
                            alt={folder.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Images size={48} className="text-gray-400 opacity-30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent dark:to-gray-900 to-white opacity-60 lg:opacity-100" />
                    <div className="absolute top-6 left-6 bg-yellow-500 text-gray-900 px-4 py-2 font-bold text-sm">
                        {folder.category || 'Conference'}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span>📷</span>
                        <span>{folder.totalImages || 0} photos</span>
                    </div>
                </div>

                {/* Content panel */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-4 dark:text-gray-400 text-gray-500 text-sm mb-4">
                        {folder.date && (
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-yellow-500" />
                                <span>{new Date(folder.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        )}
                        {folder.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-yellow-500" />
                                <span>{folder.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Images size={16} className="text-yellow-500" />
                            <span>Photo Archive</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4 group-hover:text-yellow-500 transition-colors duration-300">
                        {folder.name}
                    </h2>
                    
                    {folder.description && (
                        <p className="dark:text-gray-300 text-gray-600 line-clamp-3 mb-6">
                            {folder.description}
                        </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 text-yellow-500 font-semibold">
                        <button
                            onClick={() => setOpen(o => !o)}
                            className="flex items-center gap-2 hover:gap-4 transition-all duration-300"
                        >
                            <span>{open ? 'Hide Photos' : 'View Photos'}</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Gold left-border hover — identical to event cards */}
            <div className="absolute inset-0 border-l-4 border-transparent group-hover:border-yellow-500 transition-all duration-300 pointer-events-none" />

            {/* Expandable photo grid */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden border-t dark:border-gray-700/50 border-gray-200"
                    >
                        <div className="p-6 lg:p-10">
                            {isFetching && (
                                <div className="flex items-center justify-center py-12 gap-3">
                                    <Loader2 size={30} className="animate-spin text-yellow-500" />
                                    <span className="dark:text-gray-400 text-gray-500">Loading photos…</span>
                                </div>
                            )}
                            {isError && !isFetching && (
                                <div className="flex items-center justify-center py-12 gap-3 text-red-400">
                                    <AlertCircle size={26} /><span>Failed to load photos.</span>
                                </div>
                            )}
                            {!isFetching && !isError && (
                                <>
                                    <p className="dark:text-gray-400 text-gray-500 text-sm mb-5">
                                        Showing {(page - 1) * IMAGES_PER_PAGE + 1}–{Math.min(page * IMAGES_PER_PAGE, total)} of {total} photos · Page {page} of {totalPages}
                                    </p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                        {images.map((img, idx) => (
                                            <motion.button
                                                key={img.publicId}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.025 }}
                                                onClick={() => setLightboxIdx(idx)}
                                                className="aspect-square overflow-hidden dark:bg-gray-800 bg-gray-100 relative"
                                            >
                                                <LazyImage
                                                    src={img.thumb}
                                                    alt={`Photo ${idx + 1}`}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Images size={16} className="text-white" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-5 border-t dark:border-gray-700 border-gray-200">
                                        <button onClick={handlePrev} disabled={page === 1}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-400 transition-all">
                                            <ChevronLeft size={16} /> Previous
                                        </button>
                                        <span className="dark:text-gray-400 text-gray-500 text-sm">
                                            {(page - 1) * IMAGES_PER_PAGE + 1}–{Math.min(page * IMAGES_PER_PAGE, total)} of {total}
                                        </span>
                                        <button onClick={handleNext} disabled={!nextCursor}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-400 transition-all">
                                            Next <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIdx !== null && images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative max-w-5xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={images[lightboxIdx].full} alt="" className="w-full max-h-[80vh] object-contain shadow-2xl" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                                <p className="text-white font-semibold">{folder.name}</p>
                                <p className="text-gray-400 text-sm mt-0.5">{lightboxIdx + 1} / {images.length} · page {page}</p>
                            </div>
                            {lightboxIdx > 0 && (
                                <button onClick={() => setLightboxIdx(i => i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg">
                                    <ChevronLeft size={26} />
                                </button>
                            )}
                            {lightboxIdx < images.length - 1 && (
                                <button onClick={() => setLightboxIdx(i => i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg">
                                    <ChevronRight size={26} />
                                </button>
                            )}
                            <button onClick={() => setLightboxIdx(null)} className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg">
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


const Archives = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filter, setFilter] = useState('All');

    const { data: eventsData, isLoading, isError } = useGetEventsQuery();
    const { data: foldersData, isLoading: foldersLoading } = useGetArchiveFoldersQuery();

    // Past events only, sorted newest first
    const pastEvents = React.useMemo(() => {
        if (!eventsData?.data) return [];
        return eventsData.data
            .filter(ev => isPastEvent(ev.date))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [eventsData]);

    // Build category list dynamically from real data (combining both sources)
    const categories = React.useMemo(() => {
        const eventCats = pastEvents.map(ev => ev.category).filter(Boolean);
        const folderCats = (foldersData?.folders || []).map(f => f.category || 'Conference').filter(Boolean);
        const allCats = [...new Set([...eventCats, ...folderCats])];
        return ['All', ...allCats.sort()];
    }, [pastEvents, foldersData]);

    const filteredEvents = filter === 'All' ? pastEvents : pastEvents.filter(ev => ev.category === filter);
    const filteredFolders = filter === 'All' 
        ? (foldersData?.folders || []) 
        : (foldersData?.folders || []).filter(f => (f.category || 'Conference') === filter);


    return (
        <section className="min-h-screen dark:bg-gray-900 bg-gray-50">

            {/* Hero */}
            <div className="relative overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 bg-gradient-to-b from-gray-50 to-white" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500 blur-3xl" />
                    <div className="absolute top-40 right-1/3 w-80 h-80 bg-yellow-600 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                        <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4">
                            Past Events &amp; Activities
                        </motion.span>
                        <h1 className="text-6xl md:text-8xl font-bold dark:text-white text-gray-900 mb-6">
                            <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">Archives</span>
                        </h1>
                        <p className="text-xl md:text-2xl dark:text-gray-300 text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Explore our journey through past events, conferences, and community initiatives that shaped our mission
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 size={40} className="animate-spin text-yellow-500" />
                    <p className="dark:text-gray-400 text-gray-500">Loading archive…</p>
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-400">
                    <AlertCircle size={40} />
                    <p>Could not load archive. Please try again later.</p>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && pastEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 dark:text-gray-500 text-gray-400">
                    <Archive size={48} className="opacity-30" />
                    <p className="text-lg font-medium">No past events yet</p>
                    <p className="text-sm">Events will appear here automatically once their date has passed.</p>
                </div>
            )}

            {/* Filter Tabs */}
            {!isLoading && !isError && pastEvents.length > 0 && (
                <>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-4">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-8 py-3 mt-3 font-semibold transition-all duration-300 cursor-pointer ${filter === category ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' : 'dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-300'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Events Timeline */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                        {/* ── Cloudinary Archive Folders ── */}
                        {filteredFolders.length > 0 && (
                            <div className="mb-8 space-y-8">
                                {filteredFolders.map((f, i) => (
                                    <CloudinaryFolderSection key={f.path} folder={f} index={i} />
                                ))}
                            </div>
                        )}

                        {filteredEvents.length === 0 && filteredFolders.length === 0 ? (
                            <div className="text-center py-16 dark:text-gray-500 text-gray-400">No events or albums in this category.</div>
                        ) : (
                            <div className="space-y-8">
                                {filteredEvents.map((event, index) => {
                                    const coverImage = event.images?.[0] || event.image || null;
                                    const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    });

                                    return (
                                        <motion.div
                                            key={event._id}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-100px' }}
                                            transition={{ duration: 0.6, delay: index * 0.08 }}
                                            className="group relative dark:bg-gray-900 bg-white overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer border dark:border-gray-700/50 border-gray-200"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Image */}
                                                <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden dark:bg-gray-800 bg-gray-100">
                                                    {coverImage ? (
                                                        <img
                                                            src={coverImage}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Calendar size={48} className="text-gray-400 opacity-30" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent dark:to-gray-900 to-white opacity-60 lg:opacity-100" />
                                                    <div className="absolute top-6 left-6 bg-yellow-500 text-gray-900 px-4 py-2 font-bold text-sm">
                                                        {event.category || 'Event'}
                                                    </div>
                                                    {event.images?.length > 1 && (
                                                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                            <span>📷</span>
                                                            <span>{event.images.length} photos</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                                                    <div className="flex flex-wrap items-center gap-4 dark:text-gray-400 text-gray-500 text-sm mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={16} className="text-yellow-500" />
                                                            <span>{formattedDate}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={16} className="text-yellow-500" />
                                                            <span>{event.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={16} className="text-yellow-500" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </div>

                                                    <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4 group-hover:text-yellow-500 transition-colors duration-300">
                                                        {event.title}
                                                    </h2>
                                                    {event.description && (
                                                        <p className="dark:text-gray-300 text-gray-600 text-lg mb-6 leading-relaxed line-clamp-3">
                                                            {event.description}
                                                        </p>
                                                    )}

                                                    <div className="mt-auto flex items-center gap-2 text-yellow-500 font-semibold group-hover:gap-4 transition-all duration-300">
                                                        <span>View Details</span>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 border-l-4 border-transparent group-hover:border-yellow-500 transition-all duration-300" />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (() => {
                    const coverImage = selectedEvent.images?.[0] || selectedEvent.image || null;
                    return (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
                            onClick={() => setSelectedEvent(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="relative max-w-4xl w-full my-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="dark:bg-gray-900 bg-white overflow-hidden shadow-2xl">
                                    {/* Header image */}
                                    <div className="relative h-72">
                                        {coverImage ? (
                                            <img src={coverImage} alt={selectedEvent.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full dark:bg-gray-800 bg-gray-200 flex items-center justify-center">
                                                <Calendar size={64} className="text-gray-400 opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t dark:from-gray-900 from-white to-transparent" />
                                        <div className="absolute bottom-6 left-8 right-8">
                                            <span className="inline-block bg-yellow-500 text-gray-900 px-4 py-2 font-bold text-sm mb-3">
                                                {selectedEvent.category || 'Event'}
                                            </span>
                                            <h2 className="text-3xl font-bold text-white">{selectedEvent.title}</h2>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Meta */}
                                        <div className="flex flex-wrap gap-5 dark:text-gray-400 text-gray-500 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-yellow-500" />
                                                <span>{new Date(selectedEvent.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-yellow-500" />
                                                <span>{selectedEvent.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-yellow-500" />
                                                <span>{selectedEvent.location}</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {selectedEvent.description && (
                                            <p className="dark:text-gray-300 text-gray-600 text-lg mb-8 leading-relaxed">{selectedEvent.description}</p>
                                        )}

                                        {/* Photo gallery strip (if multiple images) */}
                                        {selectedEvent.images?.length > 1 && (
                                            <div>
                                                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Event Photos</h3>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                    {selectedEvent.images.map((img, idx) => (
                                                        <div key={idx} className="aspect-square overflow-hidden rounded-sm">
                                                            <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all shadow-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 p-12 md:p-16 shadow-2xl">
                    <div className="relative text-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay Updated on Upcoming Events</h3>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">Don't miss out on future conferences, workshops, and community initiatives. Join our mailing list today.</p>
                        <button className="bg-white text-gray-900 px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">Subscribe to Updates</button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Archives;