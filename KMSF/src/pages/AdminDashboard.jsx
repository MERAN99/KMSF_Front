import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../store/slices/authSlice';
import {
    useGetAllUsersQuery,
    useAdminGetEventsQuery,
    useAdminCreateEventMutation,
    useAdminUpdateEventMutation,
    useAdminDeleteEventMutation,
    useToggleBlockUserMutation,
    useDeleteMemberMutation,
    useNotifyEventMutation
} from '../store/api/apiSlice';
import {
    Users,
    Calendar,
    Plus,
    Edit,
    Trash2,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    MapPin,
    Tag,
    Mail,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const [activeTab, setActiveTab] = useState('users');
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
    const { data: eventsData, isLoading: eventsLoading } = useAdminGetEventsQuery();
    const [createEvent] = useAdminCreateEventMutation();
    const [updateEvent] = useAdminUpdateEventMutation();
    const [deleteEvent] = useAdminDeleteEventMutation();
    const [toggleBlockUser] = useToggleBlockUserMutation();
    const [deleteMember] = useDeleteMemberMutation();
    const [notifyEvent, { isLoading: isNotifying }] = useNotifyEventMutation();
    const [notifyingId, setNotifyingId] = useState(null);

    // Redirect if not admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        // Add prices as a JSON string for Multer/Backend
        const prices = [
            { type: 'Student', amount: formData.get('priceStudent') },
            { type: 'Member', amount: formData.get('priceMember') },
            { type: 'Non-member', amount: formData.get('priceNonMember') }
        ];
        formData.set('prices', JSON.stringify(prices));

        // Clean up price fields from formData to avoid confusion
        formData.delete('priceStudent');
        formData.delete('priceMember');
        formData.delete('priceNonMember');

        try {
            if (editingEvent) {
                await updateEvent({ id: editingEvent._id, formData }).unwrap();
            } else {
                await createEvent(formData).unwrap();
            }
            setIsEventModalOpen(false);
            setEditingEvent(null);
        } catch (err) {
            console.error('Failed to save event:', err);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id).unwrap();
            } catch (err) {
                console.error('Failed to delete event:', err);
            }
        }
    };

    const handleToggleBlock = async (id) => {
        try {
            await toggleBlockUser(id).unwrap();
        } catch (err) {
            console.error('Failed to toggle block status:', err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) {
            try {
                await deleteMember(id).unwrap();
            } catch (err) {
                console.error('Failed to delete user:', err);
            }
        }
    };

    const handleNotifyMembers = async (id) => {
        if (window.confirm('Send this event details to all active members via email?')) {
            setNotifyingId(id);
            try {
                await notifyEvent(id).unwrap();
                alert('Event notifications sent successfully!');
            } catch (err) {
                console.error('Failed to send notifications:', err);
                alert('Failed to send notifications. Please try again.');
            } finally {
                setNotifyingId(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage KMSF users and events</p>
                </header>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors ${activeTab === 'users' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Users size={20} />
                        <span>Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors ${activeTab === 'events' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Calendar size={20} />
                        <span>Events</span>
                    </button>
                </div>

                {/* Content */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
                    {activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            {usersLoading ? (
                                <div className="p-8 text-center text-gray-400">Loading users...</div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Name</th>
                                            <th className="px-6 py-4 font-semibold">Email</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Role</th>
                                            <th className="px-6 py-4 font-semibold">Created</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {usersData?.data?.map((u) => (
                                            <tr key={u._id} className={`hover:bg-gray-700/30 transition-colors text-sm ${u.isBlocked ? 'opacity-50' : ''}`}>
                                                <td className="px-6 py-4 text-white">
                                                    <div className="flex items-center space-x-2">
                                                        <span>{u.firstName} {u.lastName}</span>
                                                        {u.isBlocked && <span className="text-red-500 text-[10px] border border-red-500/50 px-1 rounded font-bold">BLOCKED</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.membershipStatus === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {u.membershipStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 capitalize">{u.role}</td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleToggleBlock(u._id)}
                                                        title={u.isBlocked ? 'Unblock User' : 'Block User'}
                                                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${u.isBlocked ? 'text-green-500' : 'text-amber-500'}`}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        title="Delete User"
                                                        className="p-1.5 rounded hover:bg-white/10 text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Events Management</h2>
                                <button
                                    onClick={() => setIsEventModalOpen(true)}
                                    className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-gray-900 px-4 py-2 rounded-lg font-bold transition-all"
                                >
                                    <Plus size={18} />
                                    <span>Add New Event</span>
                                </button>
                            </div>

                            {eventsLoading ? (
                                <div className="text-center text-gray-400">Loading events...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {eventsData?.data?.map((ev) => (
                                        <div key={ev._id} className="bg-gray-900 border border-gray-800 rounded-lg p-5 group hover:border-amber-500/50 transition-all">
                                            <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-800">
                                                {ev.image ? (
                                                    <img
                                                        src={ev.image.startsWith('/uploads') ? `http://localhost:5000${ev.image}` : ev.image}
                                                        alt={ev.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                                                )}
                                            </div>
                                            <h3 className="text-white font-bold text-lg mb-2">{ev.title}</h3>
                                            <div className="space-y-2 text-sm text-gray-400 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={14} className="text-amber-500" />
                                                    <span>{new Date(ev.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock size={14} className="text-amber-500" />
                                                    <span>{ev.time}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin size={14} className="text-amber-500" />
                                                    <span>{ev.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleNotifyMembers(ev._id)}
                                                    disabled={isNotifying}
                                                    title="Notify All Members"
                                                    className="p-2 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50"
                                                >
                                                    {notifyingId === ev._id ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => { setEditingEvent(ev); setIsEventModalOpen(true); }}
                                                    className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(ev._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Event Modal */}
            <AnimatePresence>
                {isEventModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleCreateEvent} className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                                    </h2>
                                    <button type="button" onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }} className="text-gray-400 hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Event Title</label>
                                        <input name="title" defaultValue={editingEvent?.title} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Event Image</label>
                                        <input type="file" name="image" accept="image/*" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 file:bg-gray-700 file:text-white file:border-0 file:mr-4 file:py-1 file:px-4 file:rounded file:hover:bg-gray-600" />
                                        {editingEvent?.image && <p className="mt-1 text-[10px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">Current: {editingEvent.image}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                        <textarea name="description" defaultValue={editingEvent?.description} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                                        <input type="date" name="date" defaultValue={editingEvent?.date?.split('T')[0]} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Time (e.g., 9:00 AM - 5:00 PM)</label>
                                        <input name="time" defaultValue={editingEvent?.time} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                        <input name="location" defaultValue={editingEvent?.location} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Category (e.g., Conference, Seminar)</label>
                                        <input name="category" defaultValue={editingEvent?.category} required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Student Price</label>
                                            <input name="priceStudent" defaultValue={editingEvent?.prices?.find(p => p.type === 'Student')?.amount} placeholder="e.g., Free" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Member Price</label>
                                            <input name="priceMember" defaultValue={editingEvent?.prices?.find(p => p.type === 'Member')?.amount} placeholder="e.g., £20" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Non-member Price</label>
                                            <input name="priceNonMember" defaultValue={editingEvent?.prices?.find(p => p.type === 'Non-member')?.amount} placeholder="e.g., £40" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3 rounded-lg transition-all">
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
