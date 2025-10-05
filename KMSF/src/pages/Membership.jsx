import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useMobile from '../hooks/useMobile';

const Membership = () => {
  const isMobile = useMobile();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    organization: '',
    email: '',
    password: '',
    speciality: '',
    branch: '',
    telephone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Account created successfully!');
  };

  const handleSignIn = () => {
    console.log('Sign in attempted');
    alert('Sign in functionality would go here');
  };

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
            transition={{ duration: isMobile ? 0.5 : 0.8 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: isMobile ? 0.1 : 0.2, duration: 0.6 }}
              className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4"
            >
              Join Our Community
            </motion.span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                Membership
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Become a part of KMSF and contribute to advancing Kurdish healthcare and medical sciences
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mt-3 mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0.1 : 0.3 }}
          className="bg-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-6 text-lg font-semibold transition-all duration-300 ${
                isSignIn
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-6 text-lg font-semibold transition-all duration-300 ${
                !isSignIn
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Sign In Form */}
          {isSignIn ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: isMobile ? 0.2 : 0.3 }}
              className="p-8 md:p-12"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      className="mr-2 w-4 h-4 accent-yellow-500"
                    />
                    Remember me
                  </label>
                  <button className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300">
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          ) : (
            /* Registration Form */
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: isMobile ? 0.2 : 0.3 }}
              className="p-8 md:p-12"
            >
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Title *
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  >
                    <option value="">Select Title</option>
                    <option value="Dr">Dr</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                  </select>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Organization *
                  </label>
                  <select
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                  >
                    <option value="">Select Organization</option>
                    <option value="KSA">KSA (Kurdish Students Association)</option>
                    <option value="KuMA">KuMA (Kurdish Medical Association)</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Create a password"
                  />
                </div>

                {/* Speciality */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Speciality *
                  </label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your speciality"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Branch *
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your branch"
                  />
                </div>

                {/* Telephone */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your telephone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-3 w-4 h-4 accent-yellow-500"
                  />
                  <label className="text-gray-300 text-sm">
                    I agree to the <button className="text-yellow-500 hover:text-yellow-400 underline">Terms and Conditions</button> and <button className="text-yellow-500 hover:text-yellow-400 underline">Privacy Policy</button>
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Membership;
