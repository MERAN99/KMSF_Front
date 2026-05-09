import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import LazyImage from '../components/LazyImage';
import { API_BASE_URL } from '../config';

import { useGetEventsQuery } from '../store/api/apiSlice';

// Helper: is this event upcoming, or did it end less than 3 days ago?
const isUpcomingEvent = (dateStr) => {
    const eventDate = new Date(dateStr);
    const threeDaysAfter = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    return new Date() <= threeDaysAfter;
};

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: eventsData, isLoading } = useGetEventsQuery();
  const baseUrl = API_BASE_URL;

  const events = eventsData?.data?.map(ev => ({
    ...ev,
    id: ev._id,
    image: ev.image?.startsWith('/uploads') ? `${baseUrl}${ev.image}` : ev.image,
    registration: {
      student: ev.prices?.find(p => p.type === 'Student')?.amount || 'Free',
      kmsfMember: ev.prices?.find(p => p.type === 'Member')?.amount || 'N/A',
      nonMember: ev.prices?.find(p => p.type === 'Non-member')?.amount || 'N/A'
    }
  }))
  .filter(ev => isUpcomingEvent(ev.date)) || [];

  if (isLoading) {
    return <div className="min-h-screen dark:bg-gray-900 bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C8A441]"></div></div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative w-full min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 sm:py-20 lg:py-24 overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 pb-4 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <p className="text-sm sm:text-base md:text-lg dark:text-gray-300 text-gray-600 max-w-2xl mx-auto">
            Join us for medical conferences, workshops, and educational programs designed to advance healthcare excellence
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={cardVariants}
              className="group relative dark:bg-gray-900 bg-white backdrop-blur-sm overflow-hidden border dark:border-white/10 border-gray-200 hover:border-[#C8A441]/50 transition-all duration-300 shadow-xl hover:shadow-2xl min-h-[500px] flex flex-col"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {event.category}
                </span>
              </div>

              {/* Event Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <LazyImage
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Event Content */}
              <div className="p-4 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-bold dark:text-white text-gray-900 mb-2 group-hover:text-[#C8A441] transition-colors">
                    {event.title}
                  </h3>

                  <p className="dark:text-gray-300 text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center dark:text-gray-400 text-gray-500 text-xs">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-[#C8A441]" />
                      <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center dark:text-gray-400 text-gray-500 text-xs">
                      <Clock className="w-3.5 h-3.5 mr-2 text-[#C8A441]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center dark:text-gray-400 text-gray-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-[#C8A441]" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center dark:text-gray-400 text-gray-500 text-xs">
                      <span>Student: <strong className="text-[#C8A441]">{event.registration.student}</strong> | Member: <strong className="text-[#C8A441]">{event.registration.kmsfMember}</strong> | Non-member: <strong className="text-[#C8A441]">{event.registration.nonMember}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Learn More Button */}
                <button
                  onClick={() => { setSelectedEvent(event); setCurrentImageIndex(0); }}
                  className="w-full bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white py-2 font-semibold flex items-center justify-center gap-2 hover:from-[#C8A441] hover:to-[#F2AE02] transition-all duration-300 group-hover:gap-3 text-sm mt-auto"
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t dark:from-gray-900/50 from-gray-100/20 to-transparent pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button className="dark:bg-white/10 bg-gray-100 backdrop-blur-sm dark:text-white text-gray-800 px-8 py-4 rounded-lg font-semibold dark:hover:bg-white/20 hover:bg-gray-200 transition-all duration-300 border dark:border-white/20 border-gray-300 dark:hover:border-white/40 hover:border-gray-400 inline-flex items-center gap-2">
            View All Events
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 dark:bg-gradient-to-t dark:from-gray-900 from-white to-transparent pointer-events-none"></div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              {/* Image Carousel Area */}
              <div className="w-full md:w-1/2 relative bg-black flex-shrink-0 h-64 md:h-auto flex items-center justify-center">
                {selectedEvent.images && selectedEvent.images.length > 0 ? (
                  <>
                    <LazyImage
                      src={selectedEvent.images[currentImageIndex].startsWith('/uploads') ? `${baseUrl}${selectedEvent.images[currentImageIndex]}` : selectedEvent.images[currentImageIndex]}
                      alt={selectedEvent.title}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Carousel Controls */}
                    {selectedEvent.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => (prev === 0 ? selectedEvent.images.length - 1 : prev - 1));
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => (prev === selectedEvent.images.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                          {selectedEvent.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-[#C8A441] w-4' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <LazyImage
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Details Area */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                <div className="flex flex-col h-full">
                  <div className="mb-2">
                    <span className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                      {selectedEvent.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-4">
                    {selectedEvent.title}
                  </h3>

                  <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center dark:text-gray-300 text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-[#C8A441] flex-shrink-0" />
                      <span className="font-medium">{new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center dark:text-gray-300 text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-[#C8A441] flex-shrink-0" />
                      <span className="font-medium">{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-start dark:text-gray-300 text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-[#C8A441] flex-shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{selectedEvent.location}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-bold dark:text-white text-gray-900 mb-2">Registration</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student</p>
                        <p className="font-bold text-[#C8A441] text-lg">{selectedEvent.registration.student}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Member</p>
                        <p className="font-bold text-[#C8A441] text-lg">{selectedEvent.registration.kmsfMember}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Non-member</p>
                        <p className="font-bold text-[#C8A441] text-lg">{selectedEvent.registration.nonMember}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold dark:text-white text-gray-900 mb-2">About This Event</h4>
                    <p className="dark:text-gray-300 text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {selectedEvent.link && (
                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
                      <a
                        href={selectedEvent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white py-3.5 px-6 font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-[#C8A441]/30"
                      >
                        Register / External Link
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
