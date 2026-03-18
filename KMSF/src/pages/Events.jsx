import React from 'react';
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import LazyImage from '../components/LazyImage';
import { API_BASE_URL } from '../config';

import { useGetEventsQuery } from '../store/api/apiSlice';

export default function EventsSection() {
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
  })) || [];

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
                  onClick={() => event.link && window.open(event.link, '_blank')}
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
    </section>
  );
}
