import React from 'react';
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import LazyImage from '../components/LazyImage';

export default function EventsSection() {
  const events = [
    {
      id: 1,
      title: "Annual Medical Conference 2025",
      date: "March 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Erbil Convention Center",
      description: "Join leading medical professionals for groundbreaking research presentations and networking opportunities.",
      category: "Conference",
      image: "/Events/Eve-1.jpg"
    },
    {
      id: 2,
      title: "Healthcare Innovation Summit",
      date: "April 22, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Sulaymaniyah Medical Center",
      description: "Exploring cutting-edge medical technologies and their impact on healthcare delivery in Kurdistan.",
      category: "Summit",
      image: "/Events/Eve-2.jpg"
    },
    {
      id: 3,
      title: "Medical Training Workshop",
      date: "May 8, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Duhok University Hospital",
      description: "Hands-on training session for medical practitioners focusing on advanced surgical techniques.",
      category: "Workshop",
      image: "/Events/Eve-3.jpg"
    },
    {
      id: 4,
      title: "Public Health Symposium",
      date: "June 12, 2025",
      time: "11:00 AM - 3:00 PM",
      location: "Kurdistan Medical Institute",
      description: "Addressing public health challenges and developing community healthcare strategies.",
      category: "Symposium",
      image: "/Events/Eve-4.jpg"
    }
  ];

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
    <section className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 sm:py-20 lg:py-24 overflow-hidden">
    

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
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
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
              className="group relative bg-gradient-to-br from-[#C8A441]/10 to-[#F2AE02]/10 backdrop-blur-sm overflow-hidden border border-white/10 hover:border-[#C8A441]/50 transition-all duration-300 shadow-xl hover:shadow-2xl"
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
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#C8A441] transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center text-gray-400 text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-[#C8A441]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="w-3.5 h-3.5 mr-2 text-[#C8A441]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-[#C8A441]" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Learn More Button */}
                <button className="w-full bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white py-2 font-semibold flex items-center justify-center gap-2 hover:from-[#C8A441] hover:to-[#F2AE02] transition-all duration-300 group-hover:gap-3 text-sm">
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
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
          <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 inline-flex items-center gap-2">
            View All Events
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
    </section>
  );
}
