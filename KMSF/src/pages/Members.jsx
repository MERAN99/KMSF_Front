import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
      image: '/Team/Taban.jpg',
      bio: ''
    },
    {
      id: 3,
      name: 'Dr Barzan Rahman',
      position: 'Treasurer - Psychologist',
      image: '/Team/Dr-Barzan.jpg',
      bio: ''
    },
    {
      id: 4,
      name: 'Dr Aras Asaad',
      position: 'Machine Learning Scientist',
      image: '/Team/Dr - Aras.jpg',
      bio: 'Machine Learning Scientist at Oxford Innovation Centre and Honorary Research Fellow at Buckingham.',
      detail: 'Dr. Aras is a Machine Learning Scientist at Oxford Innovation Centre and Honorary Research Fellow at the University of Buckingham, UK. His research spans artificial intelligence, drug discovery, topological data analysis, medical image analysis, computer-aided diagnostics, and DeepFake detection. He supervises PhD and MSc students at Oxford, Durham, and Buckingham universities. His academic excellence has earned him multiple prestigious awards, including best paper honours from the IWDW Conference (2017), the London Mathematical Society (2019), and a Springer Award, with one publication ranked 2nd among 42,000 papers by Kscien. He is also CEO and Co-founder of DAAR AI, a UK-based health-tech startup company.'
    },
    {
      id: 5,
      name: 'Araz Agha',
      position: 'Architect, Academic & Researcher',
      image: '/Team/araz agha.jpeg',
      bio: 'Architect, academic leader, and sustainability advocate integrating high-level design with international education.',
      detail: 'Architect, academic leader, and sustainability advocate Araz Agha integrates high-level design with international education. As a Fellow of CABE, Araz specialises in sustainable retrofitting and residential architecture. He currently serves as Head of Built Environment Courses and International Programme Leader at Coventry University, while also acting as Regional Manager (Europe & Central Asia).\n\nIn these roles, he oversees academic excellence across six universities in five countries. A prolific researcher with two books and over 27 articles, Araz is a leading voice in the transition to net-zero. His expertise in MMC, BREEAM, and Passive design ensures that he doesn’t just design buildings; he shapes the global academic standards defining the future of the construction industry.'
    },
    {
      id: 6,
      name: 'Bayad Omar',
      position: 'Technology Consultant',
      image: '/Team/Dr-Bayad.jpg',
      bio: ''
    },
    {
      id: 7,
      name: 'Niga S. Nawroly',
      position: 'Scientist, Immunologist',
      image: '/Team/Niga.jpg',
      bio: 'Experienced Immunologist, Biotechnologist, and Flow Cytometry Expert with 25+ years supporting scientists across the UK, Europe, Africa, and the Middle East.',
      detail: 'Niga Sirwan Nawroly is an experienced Immunologist, Biotechnologist, and Flow Cytometry Expert with a career spanning scientific research, the biotechnology industry, and pharmaceutical institutions.\n\nShe began her career as a researcher at several prestigious institutions, including Imperial College London, the Institute of Child Health, Queen Mary University of London, and the Kennedy Institute of Rheumatology.\n\nNiga is widely recognised within the international cytometry community as a scientific leader, speaker, and mentor. Over the past 25 years, she has trained and supported scientists and clinical researchers across the UK, Europe, Africa, and the Middle East in cytometry, immunophenotyping, business development and immunology.\n\nShe is also a passionate advocate for scientific leadership and diversity and is the Co-Founder and Chair of the HERizon Leadership Network, which supports under-represented women in drug discovery and scientific innovation.\n\nNiga has played an active role in shaping the scientific community through long-term professional service. She served as Secretary and Committee Member of the London Cytometry Club and has been involved with several scientific organisations, including the Cytometry Section of the Royal Microscopical Society (RMS). She also contributes to ELRIG (European Laboratory Research & Innovation Group) as a Scientific Programme Work Group Member and Scientific Director for High Content Imaging in Drug Discovery, and serves as a Committee Member of Augmented Health.'
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
      image: '/Team/Dr-Tahir.jpg',
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
      image: '/Team/Zhyar.jpg',
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

  const [selectedMember, setSelectedMember] = useState(null);
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
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="group relative bg-gray-800 bg-opacity-50 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-opacity-70 flex flex-col"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={member.image || '/Team/user.png'} alt={member.name} className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="relative p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C8A441] transition-colors duration-300">{member.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-3 text-sm">{member.position}</p>
                  <p className="text-gray-300 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 flex-grow">{member.bio}</p>
                  <button onClick={() => setSelectedMember(member)} className="mt-auto self-start text-sm font-semibold text-white border border-[#C8A441] px-4 py-2 hover:bg-[#C8A441] hover:text-gray-900 transition-colors z-10">Read More</button>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#C8A441]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 bg-[#C8A441]"></div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A441]/50 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
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
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="group relative bg-gray-800 bg-opacity-50 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-opacity-70 flex flex-col"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={member.image || '/Team/user.png'} alt={member.name} className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="relative p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C8A441] transition-colors duration-300">{member.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-3 text-sm">{member.position}</p>
                  <p className="text-gray-300 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 flex-grow">{member.bio}</p>
                  <button onClick={() => setSelectedMember(member)} className="mt-auto self-start text-sm font-semibold text-white border border-[#C8A441] px-4 py-2 hover:bg-[#C8A441] hover:text-gray-900 transition-colors z-10">Read More</button>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#C8A441]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 bg-[#C8A441]"></div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A441]/50 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
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

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/80 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* gold top bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] z-10"></div>

              {/* close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-20 p-1 bg-gray-900/60 hover:bg-gray-700 rounded"
              >
                <X size={22} />
              </button>

              {/* body — stacks vertically on mobile, side-by-side on md+ */}
              <div className="flex flex-col md:flex-row min-h-0 flex-1 overflow-hidden">

                {/* Image panel */}
                <div className="w-full md:w-2/5 flex-shrink-0 h-64 sm:h-72 md:h-auto relative bg-gray-900 flex items-center justify-center">
                  <img
                    src={selectedMember?.image || '/Team/user.png'}
                    alt={selectedMember?.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content panel — scrollable */}
                <div className="flex-1 p-5 sm:p-7 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 pr-8">{selectedMember?.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-4 text-xs sm:text-sm bg-[#C8A441]/10 self-start px-2 py-1 border border-[#C8A441]/20">
                    {selectedMember?.position}
                  </p>

                  <div className="text-gray-300 text-sm leading-relaxed space-y-3">
                    {selectedMember?.detail ? (
                      selectedMember.detail.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No details yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Members;
