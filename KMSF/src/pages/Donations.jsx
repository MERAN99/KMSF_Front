import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Stethoscope, GraduationCap, CreditCard, Building2, Smartphone, DollarSign, Check } from 'lucide-react';

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];
  
  const impactAreas = [
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: 'Medical Equipment',
      description: 'Support the purchase of essential medical equipment for Kurdish healthcare facilities.',
      color: 'from-blue-600 to-blue-500'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Education & Training',
      description: 'Fund educational programs and training for medical professionals and students.',
      color: 'from-green-600 to-green-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Health',
      description: 'Enable community health initiatives and outreach programs across Kurdistan.',
      color: 'from-purple-600 to-purple-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Research & Innovation',
      description: 'Advance medical research and innovative healthcare solutions in the region.',
      color: 'from-red-600 to-red-500'
    }
  ];

  const achievements = [
    { number: '10,000+', label: 'Lives Impacted' },
    { number: '50+', label: 'Healthcare Projects' },
    { number: '25', label: 'Partner Institutions' },
    { number: '$2M+', label: 'Funds Raised' }
  ];

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    alert(`Thank you for your ${selectedFrequency} donation of $${amount}!`);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 blur-3xl"></div>
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
              Make a Difference
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                Support Our Mission
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your generosity empowers Kurdish healthcare excellence and transforms lives across the region
            </p>
          </motion.div>
        </div>
      </div>

      {/* Impact Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Impact
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every donation directly supports critical areas of our healthcare mission
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {impactAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 p-6 relative overflow-hidden group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${area.color} text-white mb-4`}>
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Donation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 bg-gray-800 p-8 md:p-10"
          >
            <h3 className="text-3xl font-bold text-white mb-8">Make Your Donation</h3>

            

            {/* Amount Selection */}
            <div className="mb-8">
              <label className="block text-gray-300 font-semibold mb-4">Select Amount (USD)</label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`py-4 px-6 font-bold text-lg transition-all duration-300 ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="w-full bg-gray-700 text-white py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <label className="block text-gray-300 font-semibold mb-4">Payment Method</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-4 px-4 font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`py-4 px-4 font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${
                    paymentMethod === 'bank'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm">Bank</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`py-4 px-4 font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${
                    paymentMethod === 'mobile'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm">Mobile</span>
                </button>
              </div>
            </div>

            {/* Donate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white py-5 px-8 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
            >
              Donate ${customAmount || selectedAmount} {selectedFrequency === 'monthly' ? '/ Month' : 'Now'}
            </motion.button>

            <p className="text-gray-400 text-sm text-center mt-6">
              Your donation is secure and tax-deductible. We respect your privacy.
            </p>
          </motion.div>

          {/* Sidebar - Impact Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Quick Impact */}
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-500 p-8">
              <Heart className="w-12 h-12 text-white mb-4" />
              <h4 className="text-2xl font-bold text-white mb-3">Your Impact Today</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {customAmount || selectedAmount >= 100 ? 
                  'Your generous donation will provide essential medical equipment for a healthcare facility.' :
                  customAmount || selectedAmount >= 50 ?
                  'Your contribution will support medical training for healthcare professionals.' :
                  'Your gift will help provide vital medical supplies to those in need.'}
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-800 p-6">
              <h4 className="text-xl font-bold text-white mb-4">Why Donate?</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">100% transparent use of funds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Direct impact on Kurdish healthcare</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Regular updates on your contribution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 p-1 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Tax-deductible donations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="bg-gray-800 p-6">
              <h4 className="text-xl font-bold text-white mb-6">Our Achievements</h4>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-yellow-500 mb-1">
                      {achievement.number}
                    </div>
                    <div className="text-xs text-gray-400">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonial Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="bg-gray-800 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500 opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500 opacity-10 blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-yellow-500 text-6xl font-serif mb-4">"</div>
            <blockquote className="text-xl md:text-2xl text-white font-medium mb-6 leading-relaxed">
              Thanks to the generous support of our donors, we've been able to establish state-of-the-art medical facilities that serve thousands of Kurdish families every year.
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">DR</span>
              </div>
              <div>
                <p className="text-white font-bold">Dr. Ahmed Hassan</p>
                <p className="text-gray-400 text-sm">Director of Medical Programs</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other Ways to Help */}
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
              Other Ways to Support
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Can't donate right now? Share our mission, volunteer your time, or partner with us to make a lasting impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-gray-900 px-8 py-4 font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Volunteer
              </button>
              <button className="bg-white text-gray-900 px-8 py-4 font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DonationPage;