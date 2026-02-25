import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useMobile from '../hooks/useMobile';
import {
  useLoginMutation,
  useRequestVerificationMutation,
  useConfirmVerificationMutation,
  useStartSubscriptionMutation,
  useVerifySessionMutation
} from '../store/api/apiSlice';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { setCredentials, selectCurrentToken } from '../store/slices/authSlice';

const Membership = () => {
  const isMobile = useMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useSelector(selectCurrentToken);

  const sessionId = searchParams.get('session_id');

  const [isSignIn, setIsSignIn] = useState(true);
  const [step, setStep] = useState('INFO'); // INFO or VERIFY
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

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

  // Mutations
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [requestVerification, { isLoading: isRequestingOTP }] = useRequestVerificationMutation();
  const [confirmVerification, { isLoading: isConfirmingOTP }] = useConfirmVerificationMutation();
  const [startSubscription, { isLoading: isStartingSub }] = useStartSubscriptionMutation();
  const [verifySession] = useVerifySessionMutation();

  // ─── Handle Stripe Redirect Verification ─────────────────────────────────────
  useEffect(() => {
    const handleVerifySession = async () => {
      // Only verify if we have a sessionId and are not already logged in/verifying
      if (sessionId && !token && !isVerifyingPayment) {
        setIsVerifyingPayment(true);
        setErrorMsg('');
        try {
          const result = await verifySession(sessionId).unwrap();
          dispatch(setCredentials(result));
          setSuccessMsg('Payment verified! Your membership is now active.');
          // Clean up URL params from browser history
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setErrorMsg(err.data?.message || 'Payment verification failed. Please contact support.');
        } finally {
          setIsVerifyingPayment(false);
        }
      }
    };

    handleVerifySession();
  }, [sessionId, token, verifySession, dispatch, isVerifyingPayment]);

  // Redirect if already logged in and active
  useEffect(() => {
    if (token) {
      const status = localStorage.getItem('membershipStatus') || 'active'; // Fallback if local storage delay
      if (status === 'active') {
        const timer = setTimeout(() => navigate('/'), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!validatePassword(formData.password)) {
      setErrorMsg('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    try {
      // Step 1: Request OTP for email/password signups
      await requestVerification(formData.email).unwrap();
      setSuccessMsg(`Verification code sent to ${formData.email}`);
      setStep('VERIFY');
    } catch (err) {
      if (err.data?.errors) {
        const errors = err.data.errors.map(e => e.message).join(' ');
        setErrorMsg(`Verification Error: ${errors}`);
      } else {
        setErrorMsg(err.data?.message || 'Failed to send verification code.');
      }
    }
  };

  const handleConfirm = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Step 2: Confirm OTP
      await confirmVerification({ email: formData.email, code: verificationCode }).unwrap();

      // Step 3: Start Subscription (Get Stripe URL)
      const session = await startSubscription(formData).unwrap();

      // Step 4: Redirect to Stripe
      window.location.href = session.url;
    } catch (err) {
      if (err.status === 409) {
        setErrorMsg('An account with this email already exists. Please sign in instead.');
      } else if (err.data?.errors) {
        const errors = err.data.errors.map(e => e.message).join(' ');
        setErrorMsg(`Error: ${errors}`);
      } else {
        setErrorMsg(err.data?.message || 'Verification or Subscription failed. Please check the code and form.');
      }
    }
  };

  const handleSignIn = async () => {
    setErrorMsg('');
    try {
      const userData = await login({ email: formData.email, password: formData.password }).unwrap();
      dispatch(setCredentials(userData));
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (err.data?.errors) {
        const errors = err.data.errors.map(e => e.message).join(' ');
        setErrorMsg(`Login Error: ${errors}`);
      } else {
        setErrorMsg(err.data?.message || 'Login failed. Please check your credentials.');
      }
    }
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
        <AnimatePresence>
          {isVerifyingPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white">Verifying your payment...</h3>
                <p className="text-gray-400 mt-2">Please do not close this window.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0.1 : 0.3 }}
          className="bg-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => {
                setIsSignIn(true);
                setStep('INFO');
                setErrorMsg('');
                setSuccessMsg('');
                setFormData({
                  title: '', firstName: '', lastName: '', gender: '', organization: '',
                  email: '', password: '', speciality: '', branch: '', telephone: '', address: ''
                });
              }}
              className={`flex-1 py-6 text-lg font-semibold transition-all duration-300 ${isSignIn
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignIn(false);
                setStep('INFO');
                setErrorMsg('');
                setSuccessMsg('');
                setFormData({
                  title: '', firstName: '', lastName: '', gender: '', organization: '',
                  email: '', password: '', speciality: '', branch: '', telephone: '', address: ''
                });
              }}
              className={`flex-1 py-6 text-lg font-semibold transition-all duration-300 ${!isSignIn
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
            >
              Create New Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSignIn ? (
              /* Sign In Form */
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <div className="space-y-6">
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 mb-6 text-sm"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                    {successMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 mb-6 text-sm"
                      >
                        {successMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 accent-yellow-500"
                      />
                      Remember me
                    </label>
                    <button
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                    >
                      Forgot Password?
                    </button>
                  </div>


                  <button
                    onClick={handleSignIn}
                    disabled={isLoggingIn}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Registration Form / OTP Step */
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <AnimatePresence mode="wait">
                  {step === 'INFO' ? (
                    <motion.div
                      key="info-step"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <AnimatePresence>
                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 mb-6 text-sm"
                          >
                            {errorMsg}
                          </motion.div>
                        )}
                      </AnimatePresence>


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
                          <option value="KSA">KSA (Kurdistan Scientific Association)</option>
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
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
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
                        disabled={isRequestingOTP}
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRequestingOTP ? 'Sending Code...' : 'Create Account'}
                      </button>
                    </motion.div>
                  ) : (
                    /* VERIFY STEP */
                    <motion.div
                      key="verify-step"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-8 text-center"
                    >
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-4">Check Your Email</h3>
                        <p className="text-gray-400 text-lg">
                          We've sent a 6-digit verification code to:<br />
                          <span className="text-yellow-500 font-semibold">{formData.email}</span>
                        </p>
                      </div>

                      <AnimatePresence>
                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 text-sm"
                          >
                            {errorMsg}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="max-w-xs mx-auto">
                        <input
                          type="text"
                          maxLength="6"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full text-center text-4xl tracking-[0.5rem] bg-gray-700 text-white px-4 py-5 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 font-mono rounded"
                          placeholder="000000"
                        />
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={handleConfirm}
                          disabled={isConfirmingOTP || isStartingSub}
                          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 font-bold text-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConfirmingOTP ? 'Verifying...' : isStartingSub ? 'Preparing Payment...' : 'Verify & Pay'}
                        </button>

                        <button
                          onClick={() => { setStep('INFO'); setErrorMsg(''); }}
                          className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                        >
                          ← Back to edit profile
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </section>
  );
};

export default Membership;
