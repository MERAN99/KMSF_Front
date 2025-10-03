import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4">
          <img
            src="/KMSF_logo.png"
            alt="KMSF Logo"
            className="w-32 h-32 mb-8 rounded-full shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl leading-relaxed">
            Get in touch with the Kurdistan Medical and Scientific Federation
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(/WorldMapPattern.png)' }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Get In Touch</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We're here to help you connect with our community of Kurdish medical and scientific professionals.
                Reach out to us for inquiries, partnerships, or membership information.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 text-[#C8A441] mr-4" />
                  <h3 className="text-xl font-semibold">Email Us</h3>
                </div>
                <p className="text-gray-300 mb-2">info@kmsf.org</p>
                <p className="text-sm text-gray-400">We respond within 24 hours</p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center mb-4">
                  <Phone className="w-8 h-8 text-[#C8A441] mr-4" />
                  <h3 className="text-xl font-semibold">Call Us</h3>
                </div>
                <p className="text-gray-300 mb-2">+44 20 1234 5678</p>
                <p className="text-sm text-gray-400">Mon-Fri, 9 AM - 6 PM GMT</p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center mb-4">
                  <MapPin className="w-8 h-8 text-[#C8A441] mr-4" />
                  <h3 className="text-xl font-semibold">Visit Us</h3>
                </div>
                <p className="text-gray-300 mb-2">London, United Kingdom</p>
                <p className="text-sm text-gray-400">Headquarters Office</p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-r from-[#C8A441] to-[#F2AE02] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-white mr-4" />
                <h3 className="text-xl font-semibold text-white">Office Hours</h3>
              </div>
              <div className="space-y-2 text-gray-200">
                <p>Monday - Friday: 9:00 AM - 6:00 PM GMT</p>
                <p>Saturday: 10:00 AM - 4:00 PM GMT</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8A441] to-[#F2AE02] bg-clip-text text-transparent">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#C8A441] focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#C8A441] focus:border-transparent text-white placeholder-gray-400"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#C8A441] focus:border-transparent text-white"
                >
                  <option value="">Select a subject</option>
                  <option value="membership">Membership Inquiry</option>
                  <option value="events">Events & Conferences</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="support">Support & Donations</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#C8A441] focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white py-4 px-6 rounded-lg font-semibold hover:from-[#C8A441] hover:to-[#F2AE02] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gray-800 bg-opacity-50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <Users className="w-12 h-12 text-[#C8A441] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Become part of a network of over 120 Kurdish medical and scientific professionals working together
              to advance healthcare and scientific excellence in Kurdistan and beyond.
            </p>
            <button className="mt-6 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-white py-3 px-8 rounded-lg font-semibold hover:from-[#C8A441] hover:to-[#F2AE02] transition-all duration-300">
              Learn About Membership
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Contact;
