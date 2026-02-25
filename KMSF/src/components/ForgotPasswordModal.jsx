import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useForgotPasswordMutation, useVerifyResetCodeMutation, useResetPasswordMutation } from '../store/api/apiSlice';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('EMAIL'); // EMAIL, CODE, NEW_PASSWORD
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
    const [verifyResetCode, { isLoading: isVerifyingCode }] = useVerifyResetCodeMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await forgotPassword({ email }).unwrap();
            setStep('CODE');
        } catch (err) {
            setError(err.data?.message || 'Failed to send reset code.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await verifyResetCode({ email, code }).unwrap();
            setStep('NEW_PASSWORD');
        } catch (err) {
            setError(err.data?.message || 'Invalid or expired code.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setError('');
        try {
            await resetPassword({ email, code, newPassword }).unwrap();
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setStep('EMAIL');
                setEmail('');
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                onClose();
            }, 3000);
        } catch (err) {
            setError(err.data?.message || 'Reset failed. Please try again.');
        }
    };

    const handleModalClose = () => {
        if (!isSendingCode && !isResetting) {
            setStep('EMAIL');
            setError('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleModalClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Lock size={20} className="text-amber-500" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Reset Password</h2>
                            </div>
                            <button onClick={handleModalClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-8 flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 size={32} className="text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Password Reset Successful!</h3>
                                    <p className="text-gray-400">You can now sign in with your new password.</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-500 text-sm">
                                            <AlertCircle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {step === 'EMAIL' && (
                                        <form onSubmit={handleSendCode} className="space-y-4">
                                            <p className="text-gray-400 text-sm">Enter your email address and we'll send you a 6-digit code to reset your password.</p>
                                            <div>
                                                <div className="relative">
                                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        placeholder="email@example.com"
                                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSendingCode}
                                                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 text-gray-900 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                {isSendingCode ? <Loader2 size={20} className="animate-spin" /> : <span>Send Reset Code</span>}
                                            </button>
                                        </form>
                                    )}

                                    {step === 'CODE' && (
                                        <form onSubmit={handleVerifyCode} className="space-y-4 text-center">
                                            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Key size={24} className="text-amber-500" />
                                            </div>
                                            <p className="text-white font-medium">Verification Code</p>
                                            <p className="text-gray-400 text-sm">Enter the code sent to <span className="text-amber-500">{email}</span></p>

                                            <input
                                                type="text"
                                                maxLength="6"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                placeholder="000000"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-center text-3xl font-mono tracking-widest text-white focus:outline-none focus:border-amber-500"
                                            />

                                            <button
                                                type="submit"
                                                disabled={isVerifyingCode}
                                                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 text-gray-900 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                {isVerifyingCode ? <Loader2 size={20} className="animate-spin" /> : <span>Verify Code</span>}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStep('EMAIL')}
                                                className="text-gray-500 hover:text-white text-xs"
                                            >
                                                Didn't receive code? Try again
                                            </button>
                                        </form>
                                    )}

                                    {step === 'NEW_PASSWORD' && (
                                        <form onSubmit={handleResetPassword} className="space-y-4">
                                            <p className="text-gray-400 text-sm">Create a strong new password for your account.</p>
                                            <div>
                                                <label className="block text-gray-500 text-xs mb-1">New Password</label>
                                                <div className="relative">
                                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-gray-500 text-xs mb-1">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isResetting}
                                                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                {isResetting ? <Loader2 size={20} className="animate-spin" /> : <span>Reset Password</span>}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;
