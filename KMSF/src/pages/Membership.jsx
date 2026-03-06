import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, Star, Lock, Users, Image, Bell, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useMobile from '../hooks/useMobile';
import {
  useLoginMutation,
  useRegisterMutation,
  useStartSubscriptionMutation,
  useVerifySessionMutation,
  useRequestVerificationMutation,
  useConfirmVerificationMutation,
} from '../store/api/apiSlice';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { setCredentials, selectCurrentToken, selectCurrentUser } from '../store/slices/authSlice';

// ─── Constants ───────────────────────────────────────────────────────────────
const KUMA_PROFESSIONS = [
  'Dental Hygienist', 'Dental Nurse', 'Dental Technician',
  'Dentist', 'Dietitian', 'Doctor', 'Healthcare Assistant', 'Midwife', 'Nurse',
  'Occupational Therapist', 'Orthodontist', 'Osteopath', 'Paramedic', 'Pharmacist',
  'Pharmacy Technician', 'Phlebotomist', 'Physiotherapist', 'Podiatrist',
  'Prosthetist', 'Psychologist', 'Psychotherapist', 'Radiographer',
  'Speech and Language Therapist', 'Other'
];

const KSA_PROFESSIONS = [
  'Biochemist', 'Biologist', 'Biomedical Scientist', 'Biotechnologist',
  'Chemist', 'Computer Scientist', 'Data Scientist', 'Earth Scientist', 'Ecologist',
  'Environmental Scientist', 'Epidemiologist', 'Geneticist', 'Geologist',
  'Materials Scientist', 'Mathematician', 'Microbiologist', 'Neuroscientist',
  'Oceanographer', 'Physicist', 'Psychologist', 'Statistician', 'Other'
];

const DEFAULT_PROFESSIONS = [
  'Doctor', 'Dentist', 'Pharmacist', 'Nurse', 'Engineer', 'Teacher',
  'Professor', 'Scientist', 'Physicist', 'Biologist', 'Other'
];

// ─── Tier benefits config ────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'public',
    label: 'Public',
    icon: Users,
    color: 'text-gray-400',
    bg: 'bg-gray-800/50',
    border: 'border-gray-700',
    benefits: [
      'Browse the website surface',
      'Read about KMSF mission & team',
      'Contact & donations pages',
    ],
  },
  {
    id: 'registered',
    label: 'Registered (Free)',
    icon: Bell,
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-500/40',
    benefits: [
      'Everything in Public',
      'View photo gallery',
      'Get notified of upcoming events',
      'See full events list with prices',
    ],
  },
  {
    id: 'active',
    label: 'Paying Member',
    icon: Star,
    color: 'text-amber-400',
    bg: 'bg-amber-900/20',
    border: 'border-amber-500/60',
    benefits: [
      'Everything in Registered',
      'Free webinar access',
      'Exclusive member discounts',
      'Access full archive',
      'Priority event registration',
    ],
  },
];

const Membership = () => {
  const isMobile = useMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const sessionId = searchParams.get('session_id');

  const [isSignIn, setIsSignIn] = useState(true);
  const formRef = React.useRef(null);
  // Register steps: 'INFO' | 'OTP'
  const [registerStep, setRegisterStep] = useState('INFO');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const emptyForm = {
    title: '', firstName: '', lastName: '', gender: '', organization: '', profession: '', customProfession: '',
    email: '', password: '', confirmPassword: '',
    speciality: '', telephone: '',
    addressLine1: '', addressLine2: '', city: '', country: '', postCode: '',
  };
  const [formData, setFormData] = useState(emptyForm);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [startSubscription, { isLoading: isStartingSub }] = useStartSubscriptionMutation();
  const [verifySession] = useVerifySessionMutation();
  const [requestVerification, { isLoading: isSendingOTP }] = useRequestVerificationMutation();
  const [confirmVerification, { isLoading: isConfirmingOTP }] = useConfirmVerificationMutation();

  // ─── Handle Stripe redirect ─────────────────────────────────────────────────
  useEffect(() => {
    const handleVerifySession = async () => {
      // Run for ANY user who lands here with a session_id (including already-logged-in registered users upgrading)
      if (sessionId && !isVerifyingPayment) {
        setIsVerifyingPayment(true);
        setErrorMsg('');
        try {
          const result = await verifySession(sessionId).unwrap();
          dispatch(setCredentials(result));
          setSuccessMsg('Payment verified! Your membership is now active.');
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setErrorMsg(err.data?.message || 'Payment verification failed. Please contact support.');
        } finally {
          setIsVerifyingPayment(false);
        }
      }
    };
    handleVerifySession();
  }, [sessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If user changes organization, reset their profession choice
    if (name === 'organization' && value !== formData.organization) {
      setFormData(prev => ({ ...prev, [name]: value, profession: '', customProfession: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validatePassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw);

  // ─── Step 1: Validate form & send OTP ──────────────────────────────────────
  const handleRequestOTP = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // Validate required fields upfront before any API call
    const resolvedProfession = formData.profession === 'Other'
      ? formData.customProfession.trim()
      : formData.profession;

    if (!resolvedProfession) {
      setErrorMsg('Please select your profession before continuing.');
      return;
    }
    if (!formData.title || !formData.firstName || !formData.lastName || !formData.gender) {
      setErrorMsg('Please fill in all required personal details (Title, Name, Gender).');
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMsg('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    const submissionData = { ...formData };
    submissionData.profession = resolvedProfession;
    // Backend uses 'speciality' field name
    submissionData.speciality = resolvedProfession;

    try {
      await requestVerification(submissionData.email).unwrap();
      setSuccessMsg(`Verification code sent to ${formData.email}`);
      setRegisterStep('OTP');
      if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      if (err.data?.errors) setErrorMsg(err.data.errors.map(e => e.message).join(' '));
      else setErrorMsg(err.data?.message || 'Failed to send verification code.');
    }
  };

  // ─── Step 2: Confirm OTP then create account ────────────────────────────────
  const handleConfirmAndRegister = async () => {
    setErrorMsg('');

    const resolvedProfession = formData.profession === 'Other'
      ? formData.customProfession.trim()
      : formData.profession;

    const submissionData = { ...formData };
    submissionData.profession = resolvedProfession;
    // Backend uses 'speciality' field name
    submissionData.speciality = resolvedProfession;

    try {
      await confirmVerification({ email: submissionData.email, code: otpCode }).unwrap();
      const result = await register(submissionData).unwrap();
      dispatch(setCredentials(result));
      setSuccessMsg('Account created! You are now logged in.');
      setFormData(emptyForm);
      setOtpCode('');
      setRegisterStep('INFO');
      if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      if (err.status === 409) {
        setErrorMsg('An account with this email already exists. Please sign in instead.');
      } else if (err.data?.errors) {
        setErrorMsg(err.data.errors.map(e => e.message).join(' '));
      } else {
        setErrorMsg(err.data?.message || 'Verification or registration failed. Please try again.');
      }
    }
  };

  // ─── Sign in ────────────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    setErrorMsg('');
    try {
      const userData = await login({ email: formData.email, password: formData.password }).unwrap();
      dispatch(setCredentials(userData));
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (err.data?.errors) {
        setErrorMsg(err.data.errors.map(e => e.message).join(' '));
      } else {
        setErrorMsg(err.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  // ─── Upgrade to paid membership ─────────────────────────────────────────────
  const handleUpgrade = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const session = await startSubscription().unwrap();
      window.location.href = session.url;
    } catch (err) {
      setErrorMsg(err.data?.message || 'Failed to start checkout. Please try again.');
    }
  };

  // ─── Logged-in upgrade panel (shown when user is registered but not active) ─
  if (token && currentUser?.membershipStatus === 'registered') {
    return (
      <section className="min-h-screen bg-gray-900 pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-3">Free Account Active</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome, <span className="text-yellow-400">{currentUser.firstName}</span>!
            </h1>
            <p className="text-gray-400 text-lg">
              You're registered as a free member. Upgrade to unlock the full KMSF experience.
            </p>
          </motion.div>

          {/* Benefits comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {TIERS.map((tier) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={` border p-5 ${tier.bg} ${tier.border} ${currentUser.membershipStatus === tier.id || (tier.id === 'public') ? 'ring-2 ring-yellow-500/30' : ''}`}
              >
                <div className={`flex items-center gap-2 mb-3 ${tier.color}`}>
                  <tier.icon size={20} />
                  <span className="font-bold">{tier.label}</span>
                  {(tier.id === 'registered') && (
                    <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5  border border-yellow-500/30">Current</span>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className={`mt-0.5 flex-shrink-0 ${tier.id === 'public' ? 'text-gray-500' : tier.color}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3  mb-4 text-sm">{errorMsg}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpgrade}
            disabled={isStartingSub}
            className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 text-gray-900 py-4 font-bold text-lg  shadow-xl hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            {isStartingSub ? 'Preparing checkout…' : 'Upgrade to Full Membership'}
          </motion.button>
          <p className="text-center text-gray-500 text-sm mt-3">Secure payment powered by Stripe. Cancel anytime.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-2 py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Skip for now → Go to Homepage
          </button>
        </div>
      </section>
    );
  }

  // ─── Active paying member ───────────────────────────────────────────────────
  if (token && currentUser?.membershipStatus === 'active') {
    return (
      <section className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-4">
          <div className="w-20 h-20 bg-amber-500/10  flex items-center justify-center mx-auto mb-6">
            <Star size={40} className="text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">You're a Paying Member!</h1>
          <p className="text-gray-400 text-lg mb-6">You have full access to everything KMSF has to offer.</p>
          <button onClick={() => navigate('/')} className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-8 py-3  transition-all">
            Go to Homepage
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-900">
      {/* Hero */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500 blur-3xl" />
          <div className="absolute top-40 right-1/3 w-80 h-80 bg-yellow-600 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block text-yellow-500 font-semibold text-sm uppercase tracking-widest mb-4"
          >
            Join Our Community
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">Membership</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Register for free or upgrade to a paying membership to unlock the full KMSF experience.
          </motion.p>
        </div>
      </div>

      {/* Tier overview */}
      {(!isSignIn && registerStep !== 'OTP') && (
        <div className="max-w-6xl mx-auto px-4 mb-14 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* ── Public ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className=" border border-gray-700 bg-gray-800/60 overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4 border-b border-gray-700/60">
                <div className="flex items-center gap-2 mb-1 text-gray-400">
                  <Users size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Public</span>
                </div>
                <p className="text-white font-bold text-2xl">Free</p>
                <p className="text-gray-500 text-sm mt-0.5">No registration needed</p>
              </div>
              <ul className="px-6 py-5 space-y-3">
                {['Browse the website surface', 'Read about KMSF mission & team', 'Contact & donations pages'].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle size={15} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Registered ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className=" border border-yellow-500/40 bg-yellow-900/10 overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4 border-b border-yellow-500/20">
                <div className="flex items-center gap-2 mb-1 text-yellow-400">
                  <Bell size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Registered</span>
                </div>
                <p className="text-white font-bold text-2xl">Free</p>
                <p className="text-yellow-500/70 text-sm mt-0.5">Create a free account</p>
              </div>
              <ul className="px-6 py-5 space-y-3">
                {[
                  'Everything in Public',
                  'View the photo gallery',
                  'Get notified of upcoming events',
                  'See full events list with prices',
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle size={15} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Paying Member ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className=" border border-amber-500/60 bg-gradient-to-br from-amber-900/30 to-yellow-900/10 overflow-hidden relative"
            >
              <div className="absolute top-3 right-3">
                <span className="bg-amber-500 text-gray-900 text-xs font-bold px-2.5 py-1 ">FULL ACCESS</span>
              </div>
              <div className="px-6 pt-6 pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2 mb-1 text-amber-400">
                  <Star size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Paying Member</span>
                </div>
                <p className="text-white font-bold text-2xl">Subscription</p>
                <p className="text-amber-400/70 text-sm mt-0.5">via Stripe — cancel anytime</p>
              </div>
              <ul className="px-6 py-5 space-y-3">
                {[
                  'Everything in Registered',
                  'Free webinar access',
                  'Exclusive member discounts',
                  'Access full archive',
                  'Priority event registration',
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                    <CheckCircle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      )}

      {/* Auth Form */}
      <div className={`max-w-2xl mx-auto px-4 pb-20 ${!(!isSignIn && registerStep !== 'OTP') ? 'mt-20' : ''}`}>
        <AnimatePresence>
          {isVerifyingPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent  animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Verifying your payment…</h3>
                <p className="text-gray-400 mt-2">Please do not close this window.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => { setIsSignIn(true); setErrorMsg(''); setSuccessMsg(''); setFormData(emptyForm); }}
              className={`flex-1 py-5 text-base font-semibold transition-all ${isSignIn ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignIn(false); setErrorMsg(''); setSuccessMsg(''); setFormData(emptyForm); setRegisterStep('INFO'); setOtpCode(''); }}
              className={`flex-1 py-5 text-base font-semibold transition-all ${!isSignIn ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              Register Free
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSignIn ? (
              /* ── Sign In ── */
              <motion.div key="signin" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-8 md:p-10 space-y-5">
                {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3  text-sm">{errorMsg}</div>}
                {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3  text-sm">{successMsg}</div>}

                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Email *</label>
                  <input type="email" name="email" onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1.5">Password *</label>
                  <div className="relative">
                    <input type={showSignInPassword ? 'text' : 'password'} name="password" onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3 pr-12  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowSignInPassword(!showSignInPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setIsForgotModalOpen(true)} className="text-yellow-500 hover:text-yellow-400 text-sm transition-colors">Forgot Password?</button>
                </div>
                <button onClick={handleSignIn} disabled={isLoggingIn} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-base  hover:from-yellow-500 hover:to-yellow-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoggingIn ? 'Signing In…' : 'Sign In'}
                </button>
              </motion.div>
            ) : (
              /* ── Register Free ── */
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 md:p-10 space-y-5">
                {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3  text-sm">{errorMsg}</div>}
                {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3  text-sm">{successMsg}</div>}

                {/* ── OTP Step ── */}
                {registerStep === 'OTP' ? (
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-yellow-500/10  flex items-center justify-center mx-auto">
                      <CheckCircle size={32} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">Check your email</h3>
                      <p className="text-gray-400 text-sm">We sent a 6-digit verification code to</p>
                      <p className="text-yellow-400 font-semibold text-sm mt-1">{formData.email}</p>
                    </div>
                    <div className="text-left">
                      <label className="block text-gray-300 font-medium mb-1.5">Verification Code *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-700 text-white px-4 py-4  text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                        placeholder="000000"
                      />
                    </div>
                    <button
                      onClick={handleConfirmAndRegister}
                      disabled={isConfirmingOTP || isRegistering || otpCode.length < 6}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-base  hover:from-yellow-500 hover:to-yellow-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConfirmingOTP || isRegistering ? 'Verifying & Creating Account…' : 'Confirm & Create Account'}
                    </button>
                    <button
                      onClick={() => { setRegisterStep('INFO'); setOtpCode(''); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      ← Back to form
                    </button>
                  </div>
                ) : (
                  <>{/* ── INFO Step (full form) ── */}</>
                )}

                {/* The form is always mounted but hidden during OTP step for state preservation */}
                <div className={`space-y-5 pb-8 ${registerStep === 'OTP' ? 'hidden' : ''}`}>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Title *</label>
                    <select name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all">
                      <option value="">Select Title</option>
                      <option>Dr</option><option>Mr</option><option>Mrs</option><option>Miss</option><option>Ms</option>
                    </select>
                  </div>

                  {/* First / Last */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="First name" />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Last name" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all">
                      <option value="">Select Gender</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Organization */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">Organization *</label>
                      <select name="organization" value={formData.organization} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all">
                        <option value="">Select Organization</option>
                        <option value="KSA">KSA (Kurdistan Scientific Association)</option>
                        <option value="KuMA">KuMA (Kurdish Medical Association)</option>
                      </select>
                    </div>

                    {/* Profession */}
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">Profession *</label>
                      <select name="profession" value={formData.profession} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all">
                        <option value="">Select Profession</option>
                        {formData.organization === 'KuMA'
                          ? KUMA_PROFESSIONS.map((prof) => <option key={prof} value={prof}>{prof}</option>)
                          : formData.organization === 'KSA'
                            ? KSA_PROFESSIONS.map((prof) => <option key={prof} value={prof}>{prof}</option>)
                            : DEFAULT_PROFESSIONS.map((prof) => <option key={prof} value={prof}>{prof}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  {/* Custom Profession */}
                  <AnimatePresence>
                    {formData.profession === 'Other' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <label className="block text-gray-300 font-medium mb-1.5">Please Specify Your Profession *</label>
                        <input type="text" name="customProfession" value={formData.customProfession} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Enter your profession" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Enter your email" />
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">Password *</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Create a strong password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">Min 8 chars — uppercase, lowercase, number & special char</p>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">Confirm Password *</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Re-enter your password" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Speciality */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Speciality *</label>
                    <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Your medical speciality e.g. Cardiology" />
                  </div>

                  {/* Telephone */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Telephone *</label>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Phone number" />
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Address Line 1 *</label>
                    <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Street address, P.O. box, company name" />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Address Line 2</label>
                    <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Apartment, suite, unit, building, etc." />
                  </div>

                  {/* City + Post Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-1.5">Post Code *</label>
                      <input type="text" name="postCode" value={formData.postCode} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" placeholder="Post / Zip code" />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-1.5">Country *</label>
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-gray-700 text-white px-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all">
                      <option value="">Select Country</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Norway">Norway</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Finland">Finland</option>
                      <option value="Ireland">Ireland</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Kurdistan Region">Kurdistan Region</option>
                      <option value="Iraq">Iraq</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 accent-yellow-500" required />
                    <label htmlFor="terms" className="text-gray-400 text-sm">
                      I agree to the <span className="text-yellow-500 underline cursor-pointer">Terms and Conditions</span> and <span className="text-yellow-500 underline cursor-pointer">Privacy Policy</span>
                    </label>
                  </div>

                  <button
                    onClick={handleRequestOTP}
                    disabled={isSendingOTP}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-4 font-bold text-base  hover:from-yellow-500 hover:to-yellow-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingOTP ? 'Sending verification code…' : 'Continue → Verify Email'}
                  </button>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-500 text-xs flex items-center gap-1"><Lock size={12} /> Want full access?</span>
                    <div className="flex-1 h-px bg-gray-700" />
                  </div>
                  <p className="text-center text-gray-500 text-sm">
                    After registering, you can upgrade to a{' '}
                    <span className="text-yellow-400 font-semibold">Paying Membership</span> from your account page for full access.
                  </p>
                </div>{/* end hidden-during-OTP wrapper */}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </section >
  );
};

export default Membership;
