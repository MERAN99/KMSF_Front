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
  const kmsfMembers = [
    {
      id: 1,
      name: 'Dr Hero Xoshnaw',
      position: 'Consultant Physician & Chair of KMSF Executive Board',
      image: '/Team/DrHeroXoshnaw.jpg',
      bio: 'Consultant Physician and Geriatrician at Royal Surrey NHS Foundation Trust and Chair of the KMSF Executive Board.',
      detail: 'Dr Hiro Khoshnaw, MD, MA, FRCP, FAcadMEd, is a Consultant Physician and Geriatrician at the Royal Surrey NHS Foundation Trust (RSFT). She has special interest in medical education and she is currently the Director of Medical Education at RSFT.\n\nDr Khoshnaw is also a fellow and Council member of The Academy of Medical Educators (AoME).\n\nDr Khoshnaw has been an active member of the KMSF leadership for many years and is currently the chair of KMSF Executive Board.'
    },
    {
      id: 2,
      name: 'Tara Tofec',
      position: 'KMSF Secretary, Company Secretary',
      image: '/Team/DrTara.jpg',
      bio: 'Active KMSF-UK member since 2018, organising medical conferences and charitable fundraising initiatives for Kurdish healthcare.',
      detail: 'Tara Tofec is a Kurdish British professional with a BSc in Chemistry from the University of Salahaddin, Iraq. She has extensive experience in administration, management, and customer service, having held leadership roles including supervisor at Bally Heathrow, Company Secretary at Metropolitan International Service, and Managing Director of Café Sorrento.\n\nSince 2018, she has been an active member of the Kurdistan Medical Scientific Federation (KMSF-UK), contributing to the organization of medical and scientific conferences and seminars. She also organises charitable initiatives, including fundraising events for cancer hospitals in the Kurdistan Region, particularly in Erbil and Sulaymaniyah, demonstrating her strong commitment to community and healthcare support.'
    }
  ];

  const ksaMembers = [
    {
      id: 1,
      name: 'Dr Sayah Saied',
      position: 'Chair - Atomic Physicist',
      image: '/Team/Dr-Saya.jpeg',
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
      bio: 'Former Psychologist with a PhD in Applied Behaviour Analysis, now a property professional applying analytical skills to investment.',
      detail: 'Former Psychologist with a PhD in Applied Behaviour Analysis practiced in the field of traumatic brain injury. Clinical specialty in the assessment and treatment of complex and challenging behaviours. Research focus on behavioural interventions for adults with acquired brain injury, combining functional analyses with therapeutic applications. Prior clinical placements in private hospitals in Leeds and Northampton. Now a property professional, applying analytical and strategic skills to investment and development.\n\nHas 30 publications in peer reviewed journals with over 70 citations and is an international presenter in ISOUG and FMF.'
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
      bio: 'Technology Consultant at Oracle, supporting hospitals across the UK and Europe with digital transformation projects.',
      detail: 'Bayad Omar is a Technology Consultant at Oracle. The role involves supporting hospitals around the UK and Europe with their digital transformation projects. He holds a Masters degree in Medical Engineering from Cardiff University. His hobbies include learning languages, playing football and the Daf.'
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
      name: 'Dr Tahir Hassan',
      position: 'Research Fellow in Machine Learning',
      image: '/Team/Dr-Tahir.jpeg',
      bio: 'Senior Lecturer in AI and Data Science at Solent University and Executive Committee member of KSA, specializing in deep learning and healthcare.',
      detail: 'Dr Tahir Hassan is a Senior Lecturer in Artificial Intelligence and Data Science at Solent University and an Executive Committee member of the Kurdistan Scientific Association (KSA). With a PhD in Computing, his expertise lies at the intersection of deep learning and healthcare, specifically focusing on fairness-aware AI and medical image analysis.\n\nFormerly a Research Fellow at the University of Surrey, Tahir led critical work on the OPTIMAM mammography dataset to improve diagnostic equity. He is a passionate advocate for explainable, mathematically grounded AI systems and dedicated to leveraging his UK-based expertise to support Kurdistan’s healthcare and academic advancement.'
    },
    {
      id: 9,
      name: 'Dr Zana Hussain',
      position: 'Business Management',
      image: '/Team/Mr-Zana-Hussain.jpeg',
      bio: ''
    }
  ];

  const kumaMembers = [
    {
      id: 1,
      name: 'Zhyar Said',
      position: 'Chair - Pharmacist, Lecturer & Director',
      image: '/Team/Zhyar.jpg',
      bio: 'Chair of KuMA and founder of RevisePharma, the UK\'s largest private training company for foundation year pharmacists.',
      detail: 'Zhyar Said is the chair of KuMA but also runs the largest private training company in the UK for foundation year pharmacists, RevisePharma. After completing his MPharm at UEA, Zhyar pivoted into becoming a senior healthcare analyst, followed by becoming a senior lecturer all while building his own companies.\n\nAs well as RevisePharma, Zhyar runs a clinical services company, CliniTools, and also founded the charity, The PharmAssists\' Project where money is invested back into the local community to help those in need.\n\nZhyar is from Slemani, Kurdistan, and came to the UK at 10 months old. He is extremely proud of his Kurdish roots and you can always count on him to start the halperke line.'
    },
    {
      id: 2,
      name: 'Dr Chinar Osman',
      position: 'Secretary - Consultant Neurologist',
      image: '/Team/DrChinarOsman.jpg',
      bio: 'Consultant Neurologist at University of Southampton NHS Trust with special interest in peripheral nerve disorders and neuromuscular conditions.',
      detail: 'MBBS, BSc (Hons), MRCP\n\nDr Osman graduated at Barts and The London School of Medicine and Dentistry and attained first-class honours in Neuroscience Intercalated BSc. Dr Osman has completed a fellowship in neuromuscular disorders and appointed in 2019 as a consultant neurologist at the University of Southampton NHS Trust with a special interest in peripheral nerve disorders.\n\nShe established the UK\'s first Neurology led-outpatient Plasma Exchange Service and is the lead for the Neurology Immunoglobulin service in the South-East region. She is a member of the neuromuscular advisory board for the Association of British Neurologists and a member of the Neurology SCE question writing committee. She is involved in various international clinical trials for MMN and CIDP and research publications.\n\nShe is a Trustee for a non-profit charity KR-UK Impakt founded in 2020 committed to improving mental health provision in the KRI.'
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
      name: 'Dr Badenan Ibraheem Fathulla',
      position: 'Consultant Obstetrician & Gynaecologist',
      image: '/Team/Dr Badenan.jpeg',
      bio: 'Consultant Obstetrician and Gynaecologist at Royal Free London NHS Foundation Trust and Lead for Postnatal Services.',
      detail: 'Dr. Badenan Ibraheem Fathulla is a Consultant Obstetrician and Gynaecologist at the Royal Free London NHS Foundation Trust. She serves as Labour Ward Lead, Lead for Postnatal Services, and Lead for Postgraduate Medical Teaching and Education.\n\nDr. Fathulla grew up in Baghdad, Iraq, and graduated from Baghdad Medical School in 1984. Her clinical interests include high-risk pregnancies, gynaecological emergencies, and minimally invasive surgery.\n\nShe was awarded “Top Teacher” by University College Hospital London in recognition of her excellence in medical education. Dr. Fathulla is also a dedicated advocate for women’s health and rights.'
    },
    {
      id: 5,
      name: 'Dr Dlovan',
      position: 'General Practitioner',
      image: '/Team/Dr Dlovan.jpeg',
      bio: 'General Practitioner with a specialist interest in metabolic health and diabetes management, based in South Wales.',
      detail: 'Dr Dlovan is a General Practitioner based in South Wales, with a specialist interest in metabolic health and diabetes management. Holding a Postgraduate Diploma in Diabetes from the University of South Wales and an MSc in Diabetes from Cardiff University, they bring an evidence-based approach to complex long-term conditions.\n\nTheir practice is patient-centred, integrating mindfulness and self-awareness to support individuals in understanding and managing their health.\n\nDr Dlovan has also contributed to medical education as a Clinical Teaching Fellow in Neurology and Honorary Lecturer at Cardiff University, and is committed to providing compassionate, high-quality, personalised care.'
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
      name: 'Dr Sanaria. A. Raouf',
      position: 'Consultant Obstetrician & Maternal Medicine',
      image: '/Team/Dr-Sanaria.jpeg',
      bio: 'Senior Consultant in Obstetrics and Fetal Medicine at University Hospitals of Derby and Burton NHS Foundation Trust.',
      detail: 'MBChB, MRCOG, FRCOG\nSenior Consultant in Obstetrics and Fetal Medicine\nUniversity Hospitals of Derby and Burton NHS Foundation Trust.UK DE22-3NE\n\nHas 24 years experience of NHS in UK and 16 years as a consultant and subspecialist in Fetal medicine and prenatal invasive and noninvasive diagnosis \nNational UK Maternity Units Marvel Awardee 2025- for providing outstanding care through complications in pregnancy \nFormer Clinical Director for Obstetrics in the 5th largest Maternity Unit in UK\nEast Midlands Regional lead for Preterm Birth Prevention and Fetal growth Restriction'
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
      image: '/Team/Dr Teshk Nakshbandi.png',
      bio: 'General Practitioner based in rural Herefordshire with interests in exercise medicine, sports injuries, and rehabilitation.',
      detail: 'I am a General Practitioner based in rural Herefordshire. I graduated from Norwich Medical School in 2011, having previously completed a Pharmacy degree at University College London in 2003. I am originally from Sulaymania, Kurdistan, and was fortunate to spend part of my childhood between Sulaymania and Baghdad.\n\nI am married and the proud father of two beautiful daughters. My professional interests include exercise medicine, sports injuries, and rehabilitation, alongside a strong grounding in general medicine and gastroenterology.\n\nI hope to support KUMA and KSMF to the best of my ability.'
    }
  ];

  const [selectedMember, setSelectedMember] = useState(null);
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
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {kmsfMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200"
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
                  <p className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 flex-grow">{member.bio}</p>
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
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {ksaMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200"
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
                  <p className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 flex-grow">{member.bio}</p>
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
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {kumaMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="group relative dark:bg-gray-800 bg-white dark:bg-opacity-50 bg-opacity-100 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 shadow-gray-200 transition-all duration-500 flex flex-col border dark:border-gray-700/50 border-gray-200"
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
                  <p className="dark:text-gray-300 text-gray-600 text-sm leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4 flex-grow">{member.bio}</p>
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
