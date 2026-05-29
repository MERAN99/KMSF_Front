import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import { useGetTeamMembersQuery } from '../store/api/apiSlice';

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
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);

  const { data: teamData, isLoading } = useGetTeamMembersQuery();

  const { kmsfMembers, ksaMembers, kumaMembers, audioVisualMembers } = React.useMemo(() => {
    const list = teamData?.data || [];
    const kmsf = list.filter(m => m.teamType === 'kmsf').sort((a, b) => (a.order || 0) - (b.order || 0));
    const ksa = list.filter(m => m.teamType === 'ksa').sort((a, b) => (a.order || 0) - (b.order || 0));
    const kuma = list.filter(m => m.teamType === 'kuma').sort((a, b) => (a.order || 0) - (b.order || 0));
    const audiovisual = list.filter(m => m.teamType === 'audiovisual').sort((a, b) => (a.order || 0) - (b.order || 0));
    return { kmsfMembers: kmsf, ksaMembers: ksa, kumaMembers: kuma, audioVisualMembers: audiovisual };
  }, [teamData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] dark:bg-gray-900 bg-white">
        <Loader2 className="animate-spin text-amber-500 mb-4 animate-duration-1000" size={48} />
        <p className="text-gray-500 dark:text-gray-400 animate-pulse text-sm font-medium">Loading our amazing members...</p>
      </div>
    );
  }
  return (
    <section className="py-16 w-full dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-6">
            Meet Our <span className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Members</span>
          </h2>
          <p className="text-xl dark:text-gray-300 text-gray-600 max-w-3xl mx-auto">
            Our dedicated team of professionals from KMSF, KSA and KuMA working together to advance Kurdish healthcare and scientific excellence.
          </p>
        </motion.div>

        {/* KMSF Members */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Kurdistan Medical Scientific Federation (KMSF)</h3>
            <p className="dark:text-gray-400 text-gray-500 max-w-2xl mx-auto">
              The umbrella organization coordinating medical and scientific excellence
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            {kmsfMembers.map((member) => (
              <motion.div
                key={member._id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200 w-[calc(50%-8px)] sm:w-[280px]"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={member.image || '/Team/user.png'} alt={member.name} className="w-full h-full object-cover object-[center_20%] filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="relative p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2 group-hover:text-[#C8A441] transition-colors duration-300">{member.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-3 text-sm">{member.position}</p>
                  <p className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{member.bio}</p>
                  <button onClick={() => setSelectedMember(member)} className="mt-auto self-start text-sm font-semibold dark:text-white text-gray-800 border border-[#C8A441] px-4 py-2 hover:bg-[#C8A441] hover:text-gray-900 transition-colors z-10">Read More</button>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#C8A441]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 bg-[#C8A441]"></div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A441]/50 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* KSA Members */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Kurdistan Scientific Association (KSA)</h3>
            <p className="dark:text-gray-400 text-gray-500 max-w-2xl mx-auto">
              Advancing scientific research and academic excellence in Kurdistan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
          >
            {ksaMembers.map((member) => (
              <motion.div
                key={member._id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={member.image || '/Team/user.png'} alt={member.name} className="w-full h-full object-cover object-[center_20%] filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="relative p-3 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-sm sm:text-xl font-bold dark:text-white text-gray-900 mb-1 sm:mb-2 group-hover:text-[#C8A441] transition-colors duration-300 leading-tight">{member.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-2 sm:mb-3 text-xs leading-tight">{member.position}</p>
                  <p className="dark:text-gray-300 text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow line-clamp-3 sm:line-clamp-none">{member.bio}</p>
                  <button onClick={() => setSelectedMember(member)} className="mt-auto self-start text-xs sm:text-sm font-semibold dark:text-white text-gray-800 border border-[#C8A441] px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-[#C8A441] hover:text-gray-900 transition-colors z-10">Read More</button>
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
            <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Kurdish Medical Association (KuMA)</h3>
            <p className="dark:text-gray-400 text-gray-500 max-w-2xl mx-auto">
              Advancing medical practice and healthcare standards across Kurdistan
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8"
          >
            {kumaMembers.map((member) => (
              <motion.div
                key={member._id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={member.image || '/Team/user.png'} alt={member.name} className="w-full h-full object-cover object-[center_20%] filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="relative p-3 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-sm sm:text-xl font-bold dark:text-white text-gray-900 mb-1 sm:mb-2 group-hover:text-[#C8A441] transition-colors duration-300 leading-tight">{member.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-2 sm:mb-3 text-xs leading-tight">{member.position}</p>
                  <p className="dark:text-gray-300 text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow line-clamp-3 sm:line-clamp-none">{member.bio}</p>
                  <button onClick={() => setSelectedMember(member)} className="mt-auto self-start text-xs sm:text-sm font-semibold dark:text-white text-gray-800 border border-[#C8A441] px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-[#C8A441] hover:text-gray-900 transition-colors z-10">Read More</button>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#C8A441]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 bg-[#C8A441]"></div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C8A441]/50 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Audio Visual Specialist */}
        <div className="mb-16 mt-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Audio Visual Specialist</h3>
            <p className="dark:text-gray-400 text-gray-500 max-w-2xl mx-auto">
              Our dedicated audio and visual production team
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center"
          >
            {audioVisualMembers.map((member) => (
              <motion.div
                key={member._id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200 max-w-sm w-full mx-auto"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A441]/20 to-[#F2AE02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={member.image || '/Team/user.png'} alt={member.name} className="w-full h-full object-cover object-[center_20%] filter grayscale transition-all duration-500 group-hover:scale-110 group-hover:filter-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                </div>
                <div className="relative p-3 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-sm sm:text-xl font-bold dark:text-white text-gray-900 mb-1 sm:mb-2 group-hover:text-[#C8A441] transition-colors duration-300 leading-tight">{member.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-2 sm:mb-3 text-xs leading-tight">{member.position}</p>
                  <p className="dark:text-gray-300 text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow">{member.bio}</p>
                  <button onClick={() => setSelectedMember(member)} className="mt-auto self-start text-xs sm:text-sm font-semibold dark:text-white text-gray-800 border border-[#C8A441] px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-[#C8A441] hover:text-gray-900 transition-colors z-10">Read More</button>
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
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Interested in contributing to Kurdish healthcare and scientific advancement?
              We welcome passionate professionals to join our growing community.
            </p>
            <button
              onClick={() => navigate('/membership')}
              className="bg-white text-gray-900 px-8 py-3 font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
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
              className="relative w-full max-w-2xl dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
                  <h3 className="text-xl sm:text-2xl font-bold dark:text-white text-gray-900 mb-1 pr-8">{selectedMember?.name}</h3>
                  <p className="text-[#C8A441] font-medium mb-4 text-xs sm:text-sm bg-[#C8A441]/10 self-start px-2 py-1 border border-[#C8A441]/20">
                    {selectedMember?.position}
                  </p>

                  <div className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed space-y-3">
                    {selectedMember?.detail ? (
                      selectedMember.detail.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p className="italic dark:text-gray-500 text-gray-400">No details yet.</p>
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
