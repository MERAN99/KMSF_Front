import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../store/slices/authSlice';
import { API_BASE_URL } from '../config';
import {
    useGetAllUsersQuery,
    useAdminGetEventsQuery,
    useAdminCreateEventMutation,
    useAdminUpdateEventMutation,
    useAdminDeleteEventMutation,
    useToggleBlockUserMutation,
    useDeleteMemberMutation,
    useNotifyEventMutation,
    useGetAdminStatsQuery,
    useGetAdminDonationsQuery
} from '../store/api/apiSlice';
import {
    Users, Calendar, Plus, Edit, Trash2, X, CheckCircle,
    AlertCircle, Clock, MapPin, Mail, Loader2, LayoutDashboard, Search, ChevronLeft, ChevronRight, Ban, Briefcase, Heart, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const AdminDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Pagination & Search specific to Users tab
    const [page, setPage] = useState(1);
    const limit = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ page, limit, search: debouncedSearch });
    const { data: eventsData, isLoading: eventsLoading } = useAdminGetEventsQuery();
    const { data: donationsData, isLoading: donationsLoading } = useGetAdminDonationsQuery();

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

        const prices = [
            { type: 'Student', amount: formData.get('priceStudent') },
            { type: 'Member', amount: formData.get('priceMember') },
            { type: 'Non-member', amount: formData.get('priceNonMember') }
        ];
        formData.set('prices', JSON.stringify(prices));

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

    const handleToggleBlock = async (id, isBlocked) => {
        if (window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user? Blocked users cannot log in.`)) {
            try {
                await toggleBlockUser(id).unwrap();
            } catch (err) {
                console.error('Failed to toggle block status:', err);
            }
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

    // Chart Colors
    const COLORS = ['#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

    return (
        <div className="min-h-screen dark:bg-gray-900 bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-2">Admin Control Panel</h1>
                    <p className="dark:text-gray-400 text-gray-500">Manage KMSF statistics, users, and events</p>
                </header>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b dark:border-gray-800 border-gray-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'text-amber-500 border-b-2 border-amber-500' : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Statistics</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'users' ? 'text-amber-500 border-b-2 border-amber-500' : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800'
                            }`}
                    >
                        <Users size={20} />
                        <span>User Directory</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'events' ? 'text-amber-500 border-b-2 border-amber-500' : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800'
                            }`}
                    >
                        <Calendar size={20} />
                        <span>Events</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('donations')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'donations' ? 'text-amber-500 border-b-2 border-amber-500' : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800'
                            }`}
                    >
                        <Heart size={20} />
                        <span>Donations</span>
                    </button>
                </div>

                {/* Content */}
                <div className="dark:bg-gray-800/50 bg-white dark:border-gray-700/50 border-gray-200 border rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">

                    {/* STATS VIEW */}
                    {activeTab === 'dashboard' && (
                        <div className="p-6">
                            {statsLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                            ) : statsData?.data ? (
                                <div className="space-y-8">
                                    {/* Top Metric Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={64} /></div>
                                            <h3 className="dark:text-gray-400 text-gray-500 font-medium text-sm mb-1">Total Users</h3>
                                            <p className="text-4xl font-bold dark:text-white text-gray-900">{statsData.data.totalUsers}</p>
                                        </div>
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle size={64} className="text-green-500" /></div>
                                            <h3 className="dark:text-gray-400 text-gray-500 font-medium text-sm mb-1">Active Subscriptions</h3>
                                            <p className="text-4xl font-bold text-green-500">{statsData.data.statusCounts.active || 0}</p>
                                        </div>
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Clock size={64} className="text-amber-500" /></div>
                                            <h3 className="dark:text-gray-400 text-gray-500 font-medium text-sm mb-1">Registered</h3>
                                            <p className="text-4xl font-bold text-amber-500">{statsData.data.statusCounts.registered || 0}</p>
                                        </div>
                                        <div className="dark:bg-gray-800 bg-white dark:border-red-900/50 border-red-200/70 border rounded-xl p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Ban size={64} className="text-red-500" /></div>
                                            <h3 className="dark:text-gray-400 text-gray-500 font-medium text-sm mb-1">Blocked Users</h3>
                                            <p className="text-4xl font-bold text-red-500">{statsData.data.blockCounts.blocked || 0}</p>
                                        </div>
                                    </div>

                                    {/* Charts */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                        {/* Status Pie Chart */}
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6">
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-6">Membership Status Distribution</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Active Users', value: statsData.data.statusCounts.active || 0 },
                                                                { name: 'Registered Users', value: statsData.data.statusCounts.registered || 0 },
                                                            ]}
                                                            cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                                            paddingAngle={5} dataKey="value"
                                                        >
                                                            <Cell fill="#10B981" />
                                                            <Cell fill="#F59E0B" />
                                                        </Pie>
                                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Role Pie Chart */}
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6">
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-6">Role Distribution</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Admins', value: statsData.data.roleCounts.admin || 0 },
                                                                { name: 'Members', value: statsData.data.roleCounts.member || 0 },
                                                            ]}
                                                            cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                                            paddingAngle={5} dataKey="value"
                                                        >
                                                            <Cell fill="#8B5CF6" />
                                                            <Cell fill="#3B82F6" />
                                                        </Pie>
                                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Top Countries Bar Chart */}
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6 lg:col-span-2 shadow-inner">
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-2"><MapPin size={20} className="text-amber-500" /> Top Locations (Countries)</h3>
                                            <div className="h-72">
                                                {statsData.data.countryCounts.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={statsData.data.countryCounts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                                            <XAxis type="number" stroke="#9CA3AF" />
                                                            <YAxis dataKey="_id" type="category" stroke="#9CA3AF" width={100} />
                                                            <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} cursor={{ fill: '#374151', opacity: 0.4 }} />
                                                            <Bar dataKey="count" name="Users" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={30}>
                                                                {statsData.data.countryCounts.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : <p className="text-gray-500 text-center mt-10">Not enough geographic data to display yet.</p>}
                                            </div>
                                        </div>

                                        {/* Top Professions Bar Chart */}
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6 lg:col-span-3 shadow-inner">
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-2"><Briefcase size={20} className="text-amber-500" /> Top Professions</h3>
                                            <div className="h-72">
                                                {statsData.data.professionCounts && statsData.data.professionCounts.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={statsData.data.professionCounts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                                            <XAxis type="number" stroke="#9CA3AF" />
                                                            <YAxis dataKey="_id" type="category" stroke="#9CA3AF" width={100} />
                                                            <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} cursor={{ fill: '#374151', opacity: 0.4 }} />
                                                            <Bar dataKey="count" name="Professionals" fill="#10B981" radius={[0, 4, 4, 0]} barSize={30}>
                                                                {statsData.data.professionCounts.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : <p className="text-gray-500 text-center mt-10">Not enough profession data to display yet.</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-amber-500 text-center py-20">Could not load statistics at this time.</div>
                            )}
                        </div>
                    )}



                    {/* USERS VIEW */}
                    {activeTab === 'users' && (
                        <div>
                            {/* Toolbar */}
                            <div className="p-4 border-b dark:border-gray-700/50 border-gray-200 dark:bg-gray-900/30 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="relative w-full sm:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or member ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-300 border rounded-lg pl-10 pr-4 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="text-sm text-gray-400 font-medium">
                                    {usersData?.pagination?.total || 0} Total Members
                                </div>
                            </div>

                            <div className="overflow-x-auto min-h-[400px]">
                                {usersLoading ? (
                                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                                ) : usersData?.data?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                        <Users size={48} className="mb-4 opacity-20" />
                                        <p>No users found matching your search.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Name</th>
                                                <th className="px-6 py-4 font-semibold">Email</th>
                                                <th className="px-6 py-4 font-semibold">Location</th>
                                                <th className="px-6 py-4 font-semibold">Status</th>
                                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/50 relative">
                                            {usersData?.data?.map((u) => (
                                                <tr key={u._id} className={`dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors text-sm ${u.isBlocked ? 'dark:bg-red-900/10 bg-red-50/50' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold tracking-wider">
                                                                {u.firstName?.[0]}{u.lastName?.[0]}
                                                            </div>
                                                            <div>
                                                                <div className="dark:text-white text-gray-900 font-medium flex items-center gap-2">
                                                                    {u.firstName} {u.lastName}
                                                                    {u.isBlocked && <span className="bg-red-500/20 text-red-500 border border-red-500/30 text-[9px] uppercase px-1.5 py-0.5 rounded font-bold tracking-wider">Blocked</span>}
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-0.5">{u.memberId || 'N/A'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 dark:text-gray-400 text-gray-500">{u.email}</td>
                                                    <td className="px-6 py-4 dark:text-gray-400 text-gray-500">{u.city || '-'}, {u.country || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${u.membershipStatus === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                            u.membershipStatus === 'registered' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                                            }`}>
                                                            {u.membershipStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                                                            title={u.isBlocked ? 'Unblock User (Allow Login)' : 'Block User (Prevent Login)'}
                                                            className={`p-2 rounded-lg transition-all ${u.isBlocked ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'dark:bg-gray-800 bg-gray-100 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400'}`}
                                                        >
                                                            {u.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            title="Permanently Delete User"
                                                            className="p-2 rounded-lg dark:bg-gray-800 bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-all"
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

                            {/* Pagination Controls */}
                            {usersData?.pagination?.pages > 1 && (
                                <div className="p-4 border-t dark:border-gray-700/50 border-gray-200 dark:bg-gray-900/50 bg-gray-50 flex justify-between items-center">
                                    <div className="text-sm dark:text-gray-400 text-gray-500">
                                        Showing page <span className="dark:text-white text-gray-900 font-medium">{usersData.pagination.page}</span> of <span className="dark:text-white text-gray-900 font-medium">{usersData.pagination.pages}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(usersData.pagination.pages, p + 1))}
                                            disabled={page === usersData.pagination.pages}
                                            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}



                    {/* EVENTS VIEW */}
                    {activeTab === 'events' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold dark:text-white text-gray-900">Events Management</h2>
                                <button
                                    onClick={() => setIsEventModalOpen(true)}
                                    className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-gray-900 px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-amber-500/20"
                                >
                                    <Plus size={18} />
                                    <span>Add New Event</span>
                                </button>
                            </div>

                            {eventsLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                            ) : eventsData?.data?.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">No events created yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {eventsData?.data?.map((ev) => (
                                        <div key={ev._id} className="dark:bg-gray-900 bg-white dark:border-gray-700/50 border-gray-200 border rounded-xl p-5 flex flex-col sm:flex-row gap-5 group hover:border-amber-500/50 transition-all shadow-lg hover:shadow-amber-500/5">
                                            <div className="relative w-full sm:w-48 h-48 sm:h-full shrink-0 rounded-lg overflow-hidden bg-gray-800">
                                                {ev.image ? (
                                                    <img
                                                        src={ev.image.startsWith('/uploads') ? `${API_BASE_URL}${ev.image}` : ev.image}
                                                        alt={ev.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                                        <Calendar size={32} className="mb-2 opacity-50" />
                                                        <span className="text-xs">No Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/20">
                                                    {ev.category || 'Event'}
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col py-1">
                                                <h3 className="dark:text-white text-gray-900 font-bold text-lg mb-2 line-clamp-2">{ev.title}</h3>
                                                <div className="space-y-2 text-sm dark:text-gray-400 text-gray-500 mb-4 flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar size={14} className="text-amber-500 shrink-0" />
                                                        <span className="truncate">{new Date(ev.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock size={14} className="text-amber-500 shrink-0" />
                                                        <span className="truncate">{ev.time}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin size={14} className="text-amber-500 shrink-0" />
                                                        <span className="truncate">{ev.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-800 border-gray-200">
                                                    <button
                                                        onClick={() => handleNotifyMembers(ev._id)}
                                                        disabled={isNotifying}
                                                        title="Email to All Members"
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                                                    >
                                                        {notifyingId === ev._id ? <Loader2 size={14} className="animate-spin text-amber-500" /> : <Mail size={14} className="text-blue-400" />}
                                                        <span>Notify</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingEvent(ev); setIsEventModalOpen(true); }}
                                                        className="p-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-500 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(ev._id)}
                                                        className="p-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* DONATIONS VIEW */}
                    {activeTab === 'donations' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold dark:text-white text-gray-900 flex items-center gap-2"><Heart className="text-amber-500" /> Donations & Contributions</h2>
                            </div>

                            <div className="overflow-x-auto min-h-[400px]">
                                {donationsLoading ? (
                                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
                                ) : donationsData?.data?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                        <Heart size={48} className="mb-4 opacity-20" />
                                        <p>No donations recorded yet.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Date</th>
                                                <th className="px-6 py-4 font-semibold">Donor</th>
                                                <th className="px-6 py-4 font-semibold">Amount</th>
                                                <th className="px-6 py-4 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/50 relative">
                                            {donationsData?.data?.map((d) => (
                                                <tr key={d._id} className="dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors text-sm">
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {new Date(d.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold tracking-wider">
                                                                {d.donorName === 'Anonymous' ? 'A' : (d.userId?.firstName?.[0] || d.donorName?.[0])}
                                                            </div>
                                                            <div>
                                                                <div className="dark:text-white text-gray-900 font-medium flex items-center gap-2">
                                                                    {d.userId ? `${d.userId.firstName} ${d.userId.lastName}` : d.donorName}
                                                                </div>
                                                                <div className="text-gray-500 text-xs mt-0.5">
                                                                    {d.userId ? d.userId.email : 'Unknown / Guest'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-green-500">
                                                        {d.currency === 'USD' ? '$' : d.currency === 'GBP' ? '£' : ''}{d.amount.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${d.paymentStatus === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                            {d.paymentStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <form onSubmit={handleCreateEvent} className="p-8">
                                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                                        {editingEvent ? 'Edit Event' : 'Create New Event'}
                                    </h2>
                                    <button type="button" onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Event Title</label>
                                        <input name="title" defaultValue={editingEvent?.title} required className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Event Image</label>
                                        <div className="relative border-2 border-dashed border-gray-700 hover:border-amber-500/50 rounded-lg p-4 bg-gray-800/50 text-center transition-colors">
                                            <input type="file" name="image" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <div className="text-amber-500 mb-2"><Plus size={24} className="mx-auto" /></div>
                                            <span className="text-sm text-gray-400">Click to upload or drag and drop</span>
                                        </div>
                                        {editingEvent?.image && <p className="mt-2 text-xs text-amber-500/70 overflow-hidden text-ellipsis whitespace-nowrap">Current: {editingEvent.image}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                        <textarea name="description" defaultValue={editingEvent?.description} rows="4" className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                                        <input type="date" name="date" defaultValue={editingEvent?.date?.split('T')[0]} required className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Time Frame</label>
                                        <input name="time" defaultValue={editingEvent?.time} placeholder="e.g., 9:00 AM - 5:00 PM" required className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                        <input name="location" defaultValue={editingEvent?.location} required className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                        <input name="category" defaultValue={editingEvent?.category} placeholder="e.g., Conference, Training" required className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                                    </div>

                                    <div className="md:col-span-2 mt-4 p-5 bg-gray-800/80 rounded-xl border border-gray-700">
                                        <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Tag size={16} className="text-amber-500" /> Ticketing Prices</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Student</label>
                                                <input name="priceStudent" defaultValue={editingEvent?.prices?.find(p => p.type === 'Student')?.amount} placeholder="e.g., Free" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Member</label>
                                                <input name="priceMember" defaultValue={editingEvent?.prices?.find(p => p.type === 'Member')?.amount} placeholder="e.g., £20" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">Non-member</label>
                                                <input name="priceNonMember" defaultValue={editingEvent?.prices?.find(p => p.type === 'Non-member')?.amount} placeholder="e.g., £40" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end gap-4">
                                    <button type="button" onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }} className="px-6 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-amber-500/20">
                                        {editingEvent ? 'Save Changes' : 'Publish Event'}
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
