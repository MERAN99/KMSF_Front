import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useGetMemberQuery, useAdminUpdateMemberMutation } from '../store/api/apiSlice';

const InputField = ({ label, type = 'text', ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">{label}</label>
        <input
            type={type}
            className="w-full dark:bg-gray-800 bg-gray-50 dark:text-white text-gray-900 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            {...props}
        />
    </div>
);

const AdminEditUserModal = ({ isOpen, onClose, userId }) => {
    const { data, isLoading } = useGetMemberQuery(userId, { skip: !isOpen || !userId });
    const [updateMember, { isLoading: isUpdating }] = useAdminUpdateMemberMutation();

    const [form, setForm] = useState({
        title: '', firstName: '', lastName: '', gender: '',
        organization: '', profession: '', speciality: '', telephone: '',
        addressLine1: '', addressLine2: '', city: '', country: '', postCode: '',
        role: '', membershipStatus: '',
        customDuration: '', emailTitle: '', emailMessage: '',
        newPassword: ''
    });

    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (data?.data) {
            const u = data.data;
            setForm({
                title: u.title || '',
                firstName: u.firstName || '',
                lastName: u.lastName || '',
                gender: u.gender || '',
                organization: u.organization || '',
                profession: u.profession || '',
                speciality: u.speciality || '',
                telephone: u.telephone || '',
                addressLine1: u.addressLine1 || '',
                addressLine2: u.addressLine2 || '',
                city: u.city || '',
                country: u.country || '',
                postCode: u.postCode || '',
                role: u.role || 'member',
                membershipStatus: u.membershipStatus || 'registered',
                customDuration: '', emailTitle: '', emailMessage: '',
                newPassword: ''
            });
        }
    }, [data]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        try {
            await updateMember({ id: userId, ...form }).unwrap();
            showToast('success', 'User updated successfully!');
            setTimeout(onClose, 1500);
        } catch (err) {
            if (err?.data?.errors) {
                showToast('error', err.data.errors.map(e => e.message).join(' '));
            } else {
                showToast('error', err?.data?.message || 'Failed to update user.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                    <h2 className="text-xl font-bold dark:text-white text-gray-900">
                        Edit User: {data?.data?.firstName} {data?.data?.lastName}
                    </h2>
                    <button onClick={onClose} className="p-2 dark:text-gray-400 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {toast && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center text-sm font-medium ${toast.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                            {toast.message}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
                    ) : (
                        <div className="space-y-6">
                            
                            {/* Personal Details */}
                            <div>
                                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4 border-b dark:border-gray-800 pb-2">Personal & Professional</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InputField label="Title" name="title" value={form.title} onChange={handleFormChange} />
                                    <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleFormChange} />
                                    <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleFormChange} />
                                    
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">Gender</label>
                                        <select name="gender" value={form.gender} onChange={handleFormChange} className="w-full dark:bg-gray-800 bg-gray-50 dark:text-white text-gray-900 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">Organization</label>
                                        <select name="organization" value={form.organization} onChange={handleFormChange} className="w-full dark:bg-gray-800 bg-gray-50 dark:text-white text-gray-900 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all">
                                            <option value="KSA">KSA</option>
                                            <option value="KuMA">KuMA</option>
                                        </select>
                                    </div>
                                    <InputField label="Profession" name="profession" value={form.profession} onChange={handleFormChange} />
                                    <InputField label="Speciality" name="speciality" value={form.speciality} onChange={handleFormChange} />
                                    <InputField label="Phone Number" name="telephone" value={form.telephone} onChange={handleFormChange} type="tel" />
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div>
                                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4 border-b dark:border-gray-800 pb-2">Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleFormChange} />
                                    <InputField label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleFormChange} />
                                    <InputField label="City" name="city" value={form.city} onChange={handleFormChange} />
                                    <InputField label="Country" name="country" value={form.country} onChange={handleFormChange} />
                                    <InputField label="Post Code" name="postCode" value={form.postCode} onChange={handleFormChange} />
                                </div>
                            </div>

                            {/* Admin Controls */}
                            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
                                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">Admin Controls</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700">Membership Status</label>
                                        <select name="membershipStatus" value={form.membershipStatus} onChange={handleFormChange} className="w-full dark:bg-gray-800 bg-gray-50 dark:text-white text-gray-900 px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all">
                                            <option value="registered">Registered (Unpaid)</option>
                                            <option value="active">Active (Paid)</option>
                                            <option value="inactive">Inactive (Expired)</option>
                                        </select>
                                    </div>
                                    <InputField label="Custom Duration (Days)" name="customDuration" type="number" value={form.customDuration} onChange={handleFormChange} placeholder="e.g. 365" />
                                </div>
                                <div className="mt-4">
                                    <InputField label="Notification Email Title" name="emailTitle" value={form.emailTitle} onChange={handleFormChange} placeholder="e.g. Your membership has been updated" />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1.5">Email Message</label>
                                    <textarea name="emailMessage" value={form.emailMessage} onChange={handleFormChange} placeholder="Type your message here..." rows="3" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors resize-none"></textarea>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl p-5 mt-6">
                                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4 flex items-center gap-2">Security</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Change Password (Optional)" name="newPassword" value={form.newPassword} onChange={handleFormChange} type="text" placeholder="Enter new password..." />
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t dark:border-gray-800 border-gray-200 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg font-medium dark:text-gray-300 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isUpdating || isLoading} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50">
                        {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminEditUserModal;
