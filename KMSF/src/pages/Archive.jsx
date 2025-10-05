import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Archives = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('All');

  const events = [
    {
      id: 1,
      title: 'Medical Conference 2024',
      date: 'March 15, 2024',
      location: 'Sulaymaniyah Medical Center',
      description: 'A comprehensive conference bringing together medical professionals from across the region to discuss the latest advancements in healthcare.',
      image: '/Events/Eve-1.jpg',
      category: 'Conference',
      attendees: '200+',
      highlights: ['Keynote speeches', 'Workshop sessions', 'Networking opportunities']
    },
    {
      id: 2,
      title: 'Health Awareness Campaign',
      date: 'February 20, 2024',
      location: 'Kurdistan Community Center',
      description: 'Community outreach program focused on promoting health awareness and preventive care practices.',
      image: '/Events/Eve-2.jpg',
      category: 'Campaign',
      attendees: '500+',
      highlights: ['Free health screenings', 'Educational materials', 'Community engagement']
    },
    {
      id: 3,
      title: 'Scientific Research Symposium',
      date: 'January 10, 2024',
      location: 'University of Sulaymaniyah',
      description: 'Annual symposium showcasing groundbreaking research in medical sciences and healthcare innovation.',
      image: '/Events/Eve-3.jpg',
      category: 'Symposium',
      attendees: '150+',
      highlights: ['Research presentations', 'Panel discussions', 'Poster sessions']
    },
    {
      id: 4,
      title: 'Medical Training Workshop',
      date: 'December 5, 2023',
      location: 'KMSF Training Center',
      description: 'Intensive training program for healthcare professionals on advanced medical procedures and techniques.',
      image: '/Events/Eve-4.jpg',
      category: 'Workshop',
      attendees: '75+',
      highlights: ['Hands-on training', 'Expert instructors', 'Certification program']
    },
    {
      id: 5,
      title: 'Charity Medical Camp',
      date: 'November 18, 2023',
      location: 'Rural Kurdistan',
      description: 'Free medical camp providing healthcare services to underserved communities in rural areas.',
      image: '/Events/Eve-1.jpg',
      category: 'Campaign',
      attendees: '300+',
      highlights: ['Free consultations', 'Medicine distribution', 'Health education']
    },
    {
      id: 6,
      title: 'Annual General Assembly',
      date: 'October 25, 2023',
      location: 'KMSF Headquarters',
      description: 'Annual meeting to discuss organizational achievements, challenges, and future strategic directions.',
      image: '/Events/Eve-2.jpg',
      category: 'Conference',
      attendees: '100+',
      highlights: ['Annual report', 'Strategic planning', 'Member voting']
    },
    {
      id: 7,
      title: 'Emergency Medicine Training',
      date: 'September 12, 2023',
      location: 'Emergency Response Center',
      description: 'Specialized training program focused on emergency medical response and crisis management.',
      image: '/Events/Eve-3.jpg',
      category: 'Workshop',
      attendees: '60+',
      highlights: ['Emergency protocols', 'Simulation exercises', 'Team coordination']
    },
    {
      id: 8,
      title: 'Public Health Forum',
      date: 'August 8, 2023',
      location: 'Sulaymaniyah Convention Center',
      description: 'Forum addressing public health challenges and collaborative solutions for community wellbeing.',
      image: '/Events/Eve-4.jpg',
      category: 'Symposium',
      attendees: '250+',
      highlights: ['Expert panels', 'Policy discussions', 'Community feedback']
    }
  ];

  const categories = ['All', 'Conference', 'Campaign', 'Symposium', 'Workshop'];

  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(event => event.category === filter);

  return (
    <section className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500 blur-3xl"></div>
          <div className="absolute top-40 right-1/3 w-80 h-80 bg-yellow-600 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4"
            >
              Past Events & Activities
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                Archives
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our journey through past events, conferences, and community initiatives that shaped our mission
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-8 py-3 mt-3 font-semibold transition-all duration-300 cursor-pointer  ${
                filter === category
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white '
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Events Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-gray-800 overflow-hidden hover:bg-gray-750 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-2/5 h-64 lg:h-auto relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800 opacity-60 lg:opacity-100"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 bg-yellow-500 text-gray-900 px-4 py-2 font-bold text-sm">
                    {event.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-6 text-gray-400 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors duration-300">
                    {event.title}
                  </h2>

                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {event.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-700 text-gray-300 px-4 py-2 text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-yellow-500 font-semibold group-hover:gap-4 transition-all duration-300">
                    <span>View Details</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-l-4 border-transparent group-hover:border-yellow-500 transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-4xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 overflow-hidden shadow-2xl">
              {/* Modal Header Image */}
              <div className="relative h-96">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="inline-block bg-yellow-500 text-gray-900 px-4 py-2 font-bold text-sm mb-4">
                    {selectedEvent.category}
                  </span>
                  <h2 className="text-4xl font-bold text-white">{selectedEvent.title}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex flex-wrap gap-6 text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{selectedEvent.attendees} Attendees</span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <h3 className="text-2xl font-bold text-white mb-4">Event Highlights</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedEvent.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-700 text-gray-300 px-4 py-3 text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white p-3 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 p-12 md:p-16 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white blur-3xl"></div>
          </div>
          <div className="relative text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Stay Updated on Upcoming Events
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Don't miss out on future conferences, workshops, and community initiatives. Join our mailing list today.
            </p>
            <button className="bg-white text-gray-900 px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Subscribe to Updates
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Archives;