import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useChangePasswordMutation } from '../store/api/apiSlice';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            await changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }).unwrap();
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.data?.message || 'Failed to update password. Please check your current password.');
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
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
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
                                <h2 className="text-xl font-bold text-white">Change Password</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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
                                    <h3 className="text-lg font-bold text-white mb-2">Password Updated!</h3>
                                    <p className="text-gray-400">Your security settings have been updated successfully.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-500 text-sm">
                                            <AlertCircle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                name="currentPassword"
                                                value={passwords.currentPassword}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 pr-10 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-800 my-4"></div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={passwords.newPassword}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 pr-10 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                placeholder="••••••••"
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
                                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={passwords.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 pr-10 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                                placeholder="••••••••"
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
                                        disabled={isLoading}
                                        className="w-full mt-6 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 text-gray-900 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <span>Update Password</span>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ChangePasswordModal;
