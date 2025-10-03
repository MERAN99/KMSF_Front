import React from 'react';
import { motion } from 'framer-motion';

const Members = () => {
  const ksaMembers = [
    {
      id: 1,
      name: 'Dr. Ahmed Hassan',
      position: 'Scientific Director',
      image: '/Team/Team-1.jpg',
      bio: 'Leading research in medical sciences with over 15 years of experience in academic research.'
    },
    {
      id: 2,
      name: 'Dr. Fatima Al-Rashid',
      position: 'Research Coordinator',
      image: '/Team/Team-1.jpg',
      bio: 'Specialized in scientific methodology and data analysis for medical research projects.'
    },
    {
      id: 3,
      name: 'Prof. Omar Al-Zahra',
      position: 'Senior Researcher',
      image: '/Team/Team-1.jpg',
      bio: 'Expert in scientific publishing and peer review processes in medical literature.'
    }
  ];

  const kumaMembers = [
    {
      id: 1,
      name: 'Dr. Layla Mahmoud',
      position: 'Medical Director',
      image: '/Team/Team-1.jpg',
      bio: 'Board-certified physician with extensive experience in clinical practice and medical education.'
    },
    {
      id: 2,
      name: 'Dr. Karim Al-Sayed',
      position: 'Clinical Coordinator',
      image: '/Team/Team-1.jpg',
      bio: 'Specialist in internal medicine with focus on community health programs.'
    },
    {
      id: 3,
      name: 'Dr. Nour Al-Hassan',
      position: 'Medical Educator',
      image: '/Team/Team-1.jpg',
      bio: 'Dedicated to medical training and continuing education for healthcare professionals.'
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
    visible: { opacity: 1, y: 0 }
  };

  const MemberCard = ({ member, index }: { member: typeof ksaMembers[0], index: number }) => (
    <motion.div
      variants={cardVariants}
      className="group relative bg-gray-800 bg-opacity-50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-opacity-70"
      whileHover={{ y: -10 }}
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C8A441] transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-[#C8A441] font-medium mb-3 text-sm">
          {member.position}
        </p>
        <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {member.bio}
        </p>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-[#C8A441]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#C8A441] rounded-full"></div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A441]/50 rounded-2xl transition-all duration-300"></div>
    </motion.div>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our <span className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Members</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our dedicated team of professionals from KSA and KuMA working together to advance Kurdish healthcare and scientific excellence.
          </p>
        </motion.div>

        {/* KSA Members */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Kurdistan Scientific Association (KSA)</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Leading scientific research and academic excellence in Kurdistan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {ksaMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </motion.div>
        </div>

        {/* KuMA Members */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Kurdish Medical Association (KuMA)</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advancing medical practice and healthcare standards across Kurdistan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {kumaMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Team</h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Interested in contributing to Kurdish healthcare and scientific advancement?
              We welcome passionate professionals to join our growing community.
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Learn About Membership
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Members;
