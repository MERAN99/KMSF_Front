import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Shield, Loader2, CheckCircle, AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useRequestEmailChangeMutation,
    useConfirmEmailChangeMutation,
    useChangePasswordMutation,
} from '../store/api/apiSlice';
import { updateUser } from '../store/slices/authSlice';

const TABS = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
];

const InputField = ({ label, name, value, onChange, type = 'text', required = false, disabled = false, children }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}{required && <span className="text-[#C8A441] ml-1">*</span>}</label>
        {children || (
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-gray-700/60 border border-gray-600 text-white px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#C8A441] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
        )}
    </div>
);

const Toast = ({ type, message }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-2 px-4 py-3 rounded text-sm font-medium mb-4 ${type === 'success' ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-red-500/20 border border-red-500/40 text-red-400'}`}
    >
        {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
        {message}
    </motion.div>
);

const EditProfileModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('personal');
    const [toast, setToast] = useState(null);

    // ── Personal / Address state
    const [form, setForm] = useState({
        title: '', firstName: '', lastName: '', gender: '',
        organization: '', profession: '', speciality: '',
        addressLine1: '', addressLine2: '', city: '', country: '', postCode: '',
    });

    // ── Email change state
    const [emailStep, setEmailStep] = useState('input'); // 'input' | 'otp'
    const [newEmail, setNewEmail] = useState('');
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
    const otpRefs = useRef([]);

    // ── Password state
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

    const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(undefined, { skip: !isOpen });
    const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
    const [requestEmailChange, { isLoading: sendingOtp }] = useRequestEmailChangeMutation();
    const [confirmEmailChange, { isLoading: verifyingOtp }] = useConfirmEmailChangeMutation();
    const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();

    useEffect(() => {
        if (profileData?.user) {
            const u = profileData.user;
            setForm({
                title: u.title || '',
                firstName: u.firstName || '',
                lastName: u.lastName || '',
                gender: u.gender || '',
                organization: u.organization || '',
                profession: u.profession || '',
                speciality: u.speciality || '',
                addressLine1: u.addressLine1 || '',
                addressLine2: u.addressLine2 || '',
                city: u.city || '',
                country: u.country || '',
                postCode: u.postCode || '',
            });
        }
    }, [profileData]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSaveProfile = async () => {
        try {
            const result = await updateProfile(form).unwrap();
            dispatch(updateUser(result.user));
            showToast('success', 'Profile updated successfully!');
        } catch (err) {
            showToast('error', err?.data?.message || 'Failed to update profile.');
        }
    };

    const handleRequestOtp = async () => {
        if (!newEmail) return showToast('error', 'Please enter a new email address.');
        try {
            await requestEmailChange({ newEmail }).unwrap();
            setEmailStep('otp');
            showToast('success', 'OTP sent! Check your new email inbox.');
        } catch (err) {
            showToast('error', err?.data?.message || 'Failed to send OTP.');
        }
    };

    const handleConfirmEmail = async () => {
        const otpCode = otpDigits.join('');
        if (otpCode.length < 6) return showToast('error', 'Please enter the full 6-digit code.');
        try {
            const result = await confirmEmailChange({ newEmail, code: otpCode }).unwrap();
            dispatch(updateUser({ email: result.user.email }));
            showToast('success', 'Email updated successfully!');
            setEmailStep('input');
            setNewEmail('');
            setOtpDigits(Array(6).fill(''));
        } catch (err) {
            showToast('error', err?.data?.message || 'Invalid or expired code.');
        }
    };

    const handleChangePassword = async () => {
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            return showToast('error', 'All password fields are required.');
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return showToast('error', 'New passwords do not match.');
        }
        if (pwForm.newPassword.length < 6) {
            return showToast('error', 'New password must be at least 6 characters.');
        }
        try {
            await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }).unwrap();
            showToast('success', 'Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showToast('error', err?.data?.message || 'Failed to change password.');
        }
    };

    const handleClose = () => {
        setToast(null);
        setEmailStep('input');
        setNewEmail('');
        setOtpDigits(Array(6).fill(''));
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
    };

    const handleOtpChange = (index, value) => {
        // Only allow single digit
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [...otpDigits];
        next[index] = digit;
        setOtpDigits(next);
        // Auto-advance focus
        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (otpDigits[index]) {
                // Clear current box
                const next = [...otpDigits];
                next[index] = '';
                setOtpDigits(next);
            } else if (index > 0) {
                // Move to previous box
                otpRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const next = Array(6).fill('');
        pasted.split('').forEach((ch, i) => { next[i] = ch; });
        setOtpDigits(next);
        // Focus the last filled box or the next empty one
        const focusIdx = Math.min(pasted.length, 5);
        otpRefs.current[focusIdx]?.focus();
    };

    const SELECT_CLS = "w-full bg-gray-700/60 border border-gray-600 text-white px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#C8A441] transition-colors";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/80 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-gray-800 border border-gray-700 shadow-2xl rounded-lg overflow-hidden max-h-[95vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Gold top bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] z-10" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 sm:px-7 pt-6 pb-4 flex-shrink-0">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-white">Edit Profile</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Update your account details</p>
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 flex-shrink-0 px-5 sm:px-7">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => { setActiveTab(id); setToast(null); }}
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === id ? 'border-[#C8A441] text-[#C8A441]' : 'border-transparent text-gray-400 hover:text-white'}`}
                                >
                                    <Icon size={14} />
                                    <span className="hidden xs:inline sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5">
                            {profileLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 size={28} className="animate-spin text-[#C8A441]" />
                                </div>
                            ) : (
                                <>
                                    <AnimatePresence mode="wait">
                                        {toast && <Toast key="toast" type={toast.type} message={toast.message} />}
                                    </AnimatePresence>

                                    {/* ── Personal Info Tab ─────────────────────────── */}
                                    {activeTab === 'personal' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputField label="Title" name="title" value={form.title} onChange={handleFormChange} required>
                                                    <select name="title" value={form.title} onChange={handleFormChange} className={SELECT_CLS}>
                                                        <option value="">Select title</option>
                                                        {['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'].map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </InputField>
                                                <InputField label="Gender" name="gender" value={form.gender} onChange={handleFormChange} required>
                                                    <select name="gender" value={form.gender} onChange={handleFormChange} className={SELECT_CLS}>
                                                        <option value="">Select gender</option>
                                                        {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => <option key={g} value={g}>{g}</option>)}
                                                    </select>
                                                </InputField>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleFormChange} required />
                                                <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleFormChange} required />
                                            </div>
                                            <InputField label="Organisation" name="organization" value={form.organization} onChange={handleFormChange} required />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputField label="Profession" name="profession" value={form.profession} onChange={handleFormChange} required />
                                                <InputField label="Speciality" name="speciality" value={form.speciality} onChange={handleFormChange} required />
                                            </div>
                                            <div className="pt-2">
                                                <button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-gray-900 font-bold px-6 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-60">
                                                    {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Address Tab ───────────────────────────────── */}
                                    {activeTab === 'address' && (
                                        <div className="space-y-4">
                                            <InputField label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleFormChange} required />
                                            <InputField label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleFormChange} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputField label="City" name="city" value={form.city} onChange={handleFormChange} required />
                                                <InputField label="Post Code" name="postCode" value={form.postCode} onChange={handleFormChange} required />
                                            </div>
                                            <InputField label="Country" name="country" value={form.country} onChange={handleFormChange} required />
                                            <div className="pt-2">
                                                <button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-gray-900 font-bold px-6 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-60">
                                                    {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                    {saving ? 'Saving...' : 'Save Address'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Security Tab ──────────────────────────────── */}
                                    {activeTab === 'security' && (
                                        <div className="space-y-6">

                                            {/* Change Email section */}
                                            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Mail size={16} className="text-[#C8A441]" />
                                                    <h3 className="text-sm font-bold text-white">Change Email Address</h3>
                                                </div>
                                                {emailStep === 'input' ? (
                                                    <div className="space-y-3">
                                                        <InputField label="New Email Address" name="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" required />
                                                        <button onClick={handleRequestOtp} disabled={sendingOtp} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold text-sm px-4 py-2.5 rounded transition-colors disabled:opacity-60">
                                                            {sendingOtp ? <Loader2 size={14} className="animate-spin" /> : null}
                                                            {sendingOtp ? 'Sending...' : 'Send Verification Code'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <p className="text-xs text-gray-400">A 6-digit code was sent to <span className="text-white font-medium">{newEmail}</span></p>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Verification Code</label>
                                                            <div className="flex gap-2" onPaste={handleOtpPaste}>
                                                                {otpDigits.map((digit, i) => (
                                                                    <input
                                                                        key={i}
                                                                        ref={(el) => (otpRefs.current[i] = el)}
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        maxLength={1}
                                                                        value={digit}
                                                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                                        className="w-10 h-12 text-center text-lg font-bold bg-gray-700/60 border-2 border-gray-600 text-white rounded focus:outline-none focus:border-[#C8A441] transition-colors caret-transparent"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 flex-wrap">
                                                            <button onClick={handleConfirmEmail} disabled={verifyingOtp} className="flex items-center gap-2 bg-gradient-to-r from-[#C8A441] to-[#F2AE02] text-gray-900 font-bold text-sm px-4 py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-60">
                                                                {verifyingOtp ? <Loader2 size={14} className="animate-spin" /> : null}
                                                                {verifyingOtp ? 'Verifying...' : 'Verify & Update Email'}
                                                            </button>
                                                            <button onClick={() => { setEmailStep('input'); setOtpDigits(Array(6).fill('')); }} className="text-sm text-gray-400 hover:text-white px-3 py-2.5 rounded border border-gray-600 hover:border-gray-500 transition-colors">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Change Password section */}
                                            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Lock size={16} className="text-[#C8A441]" />
                                                    <h3 className="text-sm font-bold text-white">Change Password</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { key: 'currentPassword', label: 'Current Password', field: 'current' },
                                                        { key: 'newPassword', label: 'New Password', field: 'new' },
                                                        { key: 'confirmPassword', label: 'Confirm New Password', field: 'confirm' },
                                                    ].map(({ key, label, field }) => (
                                                        <InputField key={key} label={label} name={key} value={pwForm[key]} required>
                                                            <div className="relative">
                                                                <input
                                                                    type={showPw[field] ? 'text' : 'password'}
                                                                    name={key}
                                                                    value={pwForm[key]}
                                                                    onChange={(e) => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                                                                    className="w-full bg-gray-700/60 border border-gray-600 text-white px-3 py-2.5 pr-10 text-sm rounded focus:outline-none focus:border-[#C8A441] transition-colors"
                                                                />
                                                                <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                                                    {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                                                                </button>
                                                            </div>
                                                        </InputField>
                                                    ))}
                                                    <button onClick={handleChangePassword} disabled={changingPw} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold text-sm px-4 py-2.5 rounded transition-colors disabled:opacity-60 mt-1">
                                                        {changingPw ? <Loader2 size={14} className="animate-spin" /> : null}
                                                        {changingPw ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
