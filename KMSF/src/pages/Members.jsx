import React from 'react';
import { motion } from 'framer-motion';

const Members = () => {
  const ksaMembers = [
    {
      id: 1,
      name: 'Dr Sayah Saied',
      position: 'Chair - Atomic Physicist',
      image: '',
      bio: ''
    },
    {
      id: 2,
      name: 'Taban Hawezy',
      position: 'Secretary - Data Analyst',
      image: '',
      bio: ''
    },
    {
      id: 3,
      name: 'Dr Barzan Rahman',
      position: 'Treasurer - Psychologist',
      image: '',
      bio: ''
    },
    {
      id: 4,
      name: 'Dr Aras Asaad',
      position: 'Machine Learning Scientist',
      image: '/Team/Dr - Aras.jpg',
      bio: ''
    },
    {
      id: 5,
      name: 'Araz Agha',
      position: 'Architect, Academic & Researcher',
      image: '',
      bio: ''
    },
    {
      id: 6,
      name: 'Bayad Omar',
      position: 'Technology Consultant',
      image: '',
      bio: ''
    },
    {
      id: 7,
      name: 'Niga S. Nawroly',
      position: 'Scientist, Immunologist',
      image: '',
      bio: ''
    },
    {
      id: 8,
      name: 'Soma Hadad',
      position: 'Architect, Academic & CEO of S.A.',
      image: '',
      bio: ''
    },
    {
      id: 9,
      name: 'Dr Tahir Hassan',
      position: 'Research Fellow in Machine Learning',
      image: '',
      bio: ''
    },
    {
      id: 10,
      name: 'Dr Zana Hussain',
      position: 'Business Management',
      image: '',
      bio: ''
    }
  ];

  const kumaMembers = [
    {
      id: 1,
      name: 'Zhyar Said',
      position: 'Chair - Pharmacist, Lecturer & Director',
      image: '',
      bio: ''
    },
    {
      id: 2,
      name: 'Dr Chinar Osman',
      position: 'Secretary - Consultant Neurologist',
      image: '',
      bio: ''
    },
    {
      id: 3,
      name: 'Yar Ameen',
      position: 'Treasurer - Senior Paralegal',
      image: '',
      bio: ''
    },
    {
      id: 4,
      name: 'Dr Badenan Fathulla',
      position: 'Consultant Obstetrician & Gynaecologist',
      image: '',
      bio: ''
    },
    {
      id: 5,
      name: 'Dr Dlovan Taha',
      position: 'General Practitioner',
      image: '',
      bio: ''
    },
    {
      id: 6,
      name: 'Dr Firiad Hiwaizi',
      position: 'Consultant Haematologist',
      image: '',
      bio: ''
    },
    {
      id: 7,
      name: 'Dr Hama Attar',
      position: 'Consultant Urological Surgeon',
      image: '',
      bio: ''
    },
    {
      id: 8,
      name: 'Dr Sanaria Raouf',
      position: 'Consultant Obstetrician & Maternal Medicine',
      image: '',
      bio: ''
    },
    {
      id: 9,
      name: 'Shilan Ghafoor',
      position: 'Pharmacist, Healthcare Policy Advisor',
      image: '',
      bio: ''
    },
    {
      id: 10,
      name: 'Dr Teshk Nakshbandi',
      position: 'General Practitioner',
      image: '',
      bio: ''
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

  const MemberCard = ({ member }) => (
    <motion.div
      variants={cardVariants}
      className="group relative bg-gray-800 bg-opacity-50 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-opacity-70"
      whileHover={{ y: -10 }}
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={member.image || '/Team/user.png'}
          alt={member.name}
          className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none"
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
        <p className="text-gray-300 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {member.bio}
        </p>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-[#C8A441]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#C8A441]"></div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A441]/50 transition-all duration-300"></div>
    </motion.div>
  );

  return (
    <section className="py-16 w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
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
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {ksaMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
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
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {kumaMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
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
          <div className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Team</h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Interested in contributing to Kurdish healthcare and scientific advancement?
              We welcome passionate professionals to join our growing community.
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 font-semibold hover:bg-gray-100 transition-colors duration-300">
              Learn About Membership
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Members;
