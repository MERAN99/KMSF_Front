import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser, selectCurrentToken } from '../store/slices/authSlice';
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
    useGetAdminDonationsQuery,
    useToggleDonationMessageMutation,
    useSendBulkReminderEmailMutation,
    useGetTeamMembersQuery,
    useCreateTeamMemberMutation,
    useDeleteTeamMemberMutation,
    useUpdateTeamMemberMutation,
    useSyncStripeMembersMutation,
} from '../store/api/apiSlice';
import {
    Users, Calendar, Plus, Edit, Trash2, X, CheckCircle,
    AlertCircle, Clock, MapPin, Mail, Loader2, LayoutDashboard, Search, ChevronLeft, ChevronRight, Ban, Briefcase, Heart, DollarSign, Tag, Eye, EyeOff, Images, Upload, FolderOpen, ImagePlus, ArrowLeft, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import AdminEditUserModal from '../components/AdminEditUserModal';
import AdminTickets from '../components/AdminTickets';
import { Ticket as TicketIcon } from 'lucide-react';

const AdminDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);

    const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
    const [bulkEmailForm, setBulkEmailForm] = useState({ title: '', message: '' });

    // Multi-image state for the event form
    const [existingImages, setExistingImages] = useState([]); // URLs already saved (edit mode)
    const [newImageFiles, setNewImageFiles] = useState([]);   // File objects to upload
    const [newImagePreviews, setNewImagePreviews] = useState([]); // Data URLs for preview
    const imageInputRef = useRef(null);
    
    // Gallery images
    const [existingGalleryImages, setExistingGalleryImages] = useState([]); 
    const [newGalleryFiles, setNewGalleryFiles] = useState([]);   
    const [newGalleryPreviews, setNewGalleryPreviews] = useState([]); 
    const galleryInputRef = useRef(null);

    // Team member form state
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingTeamMember, setEditingTeamMember] = useState(null);
    const [teamImageFile, setTeamImageFile] = useState(null);
    const [teamImagePreview, setTeamImagePreview] = useState('');
    const teamImageInputRef = useRef(null);

    // Event TBD checkbox state
    const [isEventTBD, setIsEventTBD] = useState(false);

    // When editing opens, seed existing images
    useEffect(() => {
        if (editingEvent) {
            setExistingImages(editingEvent.images || (editingEvent.image ? [editingEvent.image] : []));
            setExistingGalleryImages(editingEvent.galleryImages || []);
            setIsEventTBD(editingEvent.isTBD || false);
        } else {
            setExistingImages([]);
            setExistingGalleryImages([]);
            setIsEventTBD(false);
        }
        setNewImageFiles([]);
        setNewImagePreviews([]);
        setNewGalleryFiles([]);
        setNewGalleryPreviews([]);
    }, [editingEvent, isEventModalOpen]);

    // Pagination & Search specific to Users tab
    const [page, setPage] = useState(1);
    const limit = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [orgFilter, setOrgFilter] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    // Debounce search
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Reset selected users when filters change
    useEffect(() => {
        setSelectedUserIds([]);
        setPage(1);
    }, [statusFilter, orgFilter]);

    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ page, limit, search: debouncedSearch, status: statusFilter, organization: orgFilter });
    const { data: eventsData, isLoading: eventsLoading } = useAdminGetEventsQuery();
    const { data: donationsData, isLoading: donationsLoading } = useGetAdminDonationsQuery();
    const { data: teamData, isLoading: teamLoading } = useGetTeamMembersQuery();
    const [createTeamMember, { isLoading: isCreatingTeam }] = useCreateTeamMemberMutation();
    const [deleteTeamMember] = useDeleteTeamMemberMutation();
    const [updateTeamMember, { isLoading: isUpdatingTeam }] = useUpdateTeamMemberMutation();
    const [toggleDonationMsg] = useToggleDonationMessageMutation();

    const [createEvent, { isLoading: isCreatingEvent }] = useAdminCreateEventMutation();
    const [updateEvent, { isLoading: isUpdatingEvent }] = useAdminUpdateEventMutation();
    const [deleteEvent] = useAdminDeleteEventMutation();
    const [toggleBlockUser] = useToggleBlockUserMutation();
    const [deleteMember] = useDeleteMemberMutation();
    const [notifyEvent, { isLoading: isNotifying }] = useNotifyEventMutation();
    const [sendBulkReminderEmail] = useSendBulkReminderEmailMutation();
    const [notifyingId, setNotifyingId] = useState(null);
    const [isSendingBulk, setIsSendingBulk] = useState(false);
    const [syncStripeMembers] = useSyncStripeMembersMutation();

    // Automatically sync Stripe subscriptions in background when admin opens the dashboard
    useEffect(() => {
        syncStripeMembers()
            .unwrap()
            .then((res) => {
                console.log('[AutoSyncStripe] Background sync finished:', res?.message);
            })
            .catch((err) => {
                console.warn('[AutoSyncStripe] Background sync failed:', err);
            });
    }, [syncStripeMembers]);

    // Redirect if not admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();

        // Basic fields
        formData.set('title', form.title.value);
        formData.set('description', form.description.value);
        formData.set('date', isEventTBD ? '' : form.date.value);
        formData.set('time', form.time.value);
        formData.set('location', form.location.value);
        formData.set('category', form.category.value);
        formData.set('isTBD', isEventTBD);

        // Prices
        const prices = [
            { type: 'Student', amount: form.priceStudent.value },
            { type: 'Member', amount: form.priceMember.value },
            { type: 'Non-member', amount: form.priceNonMember.value },
        ];
        formData.set('prices', JSON.stringify(prices));

        // Existing images to keep (edit mode)
        formData.set('existingImages', JSON.stringify(existingImages));
        formData.set('existingGalleryImages', JSON.stringify(existingGalleryImages));

        // New image files to upload
        newImageFiles.forEach(file => formData.append('images', file));
        newGalleryFiles.forEach(file => formData.append('galleryImages', file));

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

    const handleImageFilesSelected = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const totalImages = existingImages.length + newImageFiles.length + files.length;
        if (totalImages > 3) {
            alert('You can only select up to 3 posters.');
            return;
        }
        const previews = files.map(f => URL.createObjectURL(f));
        setNewImageFiles(prev => [...prev, ...files]);
        setNewImagePreviews(prev => [...prev, ...previews]);
        // Reset input so same file can be added again if needed
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleGalleryFilesSelected = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        setNewGalleryFiles(prev => [...prev, ...files]);
        setNewGalleryPreviews(prev => [...prev, ...previews]);
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const removeExistingImage = (idx) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    const removeNewImage = (idx) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingGalleryImage = (idx) => {
        setExistingGalleryImages(prev => prev.filter((_, i) => i !== idx));
    };

    const removeNewGalleryImage = (idx) => {
        setNewGalleryFiles(prev => prev.filter((_, i) => i !== idx));
        setNewGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
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

    const handleCreateTeamMember = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();

        formData.set('name', form.memberName.value);
        formData.set('position', form.memberPosition.value);
        formData.set('bio', form.memberBio.value);
        formData.set('detail', form.memberDetail.value);
        formData.set('teamType', form.memberTeamType.value);
        formData.set('order', form.memberOrder.value || '0');

        if (teamImageFile) {
            formData.append('image', teamImageFile);
        } else if (!editingTeamMember) {
            alert('Please select an image/photo for the team member.');
            return;
        }

        try {
            if (editingTeamMember) {
                await updateTeamMember({ id: editingTeamMember._id, formData }).unwrap();
            } else {
                await createTeamMember(formData).unwrap();
            }
            setIsTeamModalOpen(false);
            setEditingTeamMember(null);
            setTeamImageFile(null);
            setTeamImagePreview('');
            form.reset();
        } catch (err) {
            console.error('Failed to save team member:', err);
            alert(err?.data?.message || 'Failed to save team member.');
        }
    };

    const handleDeleteTeamMember = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete team member ${name}?`)) {
            try {
                await deleteTeamMember(id).unwrap();
            } catch (err) {
                console.error('Failed to delete team member:', err);
                alert('Failed to delete team member.');
            }
        }
    };

    const handleTeamImageFileSelected = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setTeamImageFile(file);
        setTeamImagePreview(URL.createObjectURL(file));
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

    const handleSelectAllUsers = (e) => {
        if (e.target.checked) {
            const allIds = usersData?.data?.map(u => u._id) || [];
            setSelectedUserIds(allIds);
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
        );
    };

    const handleSendBulkReminder = () => {
        if (selectedUserIds.length === 0) return;
        setIsBulkEmailModalOpen(true);
    };

    const handleConfirmBulkEmail = async (e) => {
        e.preventDefault();
        if (selectedUserIds.length === 0) return;
        
        try {
            setIsSendingBulk(true);
            await sendBulkReminderEmail({ 
                userIds: selectedUserIds,
                title: bulkEmailForm.title,
                message: bulkEmailForm.message
            }).unwrap();
            alert('Emails are being sent in the background!');
            setSelectedUserIds([]);
            setIsBulkEmailModalOpen(false);
            setBulkEmailForm({ title: '', message: '' });
        } catch (error) {
            console.error('Failed to send bulk email:', error);
            alert(error?.data?.message || 'Failed to send emails. Please try again later.');
        } finally {
            setIsSendingBulk(false);
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
                        onClick={() => setActiveTab('team')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'team' ? 'text-amber-500 border-b-2 border-amber-500' : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800'
                            }`}
                    >
                        <Briefcase size={20} />
                        <span>Team</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'tickets' ? 'text-amber-500 border-b-2 border-amber-500' : 'dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800'
                            }`}
                    >
                        <TicketIcon size={20} />
                        <span>Tickets</span>
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

                    {activeTab === 'tickets' && (
                        <AdminTickets />
                    )}

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

                                        {/* Organization Pie Chart */}
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6">
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-6">Organization Distribution</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'KSA', value: statsData.data.organizationCounts?.find(o => o._id === 'KSA')?.count || 0 },
                                                                { name: 'KuMA', value: statsData.data.organizationCounts?.find(o => o._id === 'KuMA')?.count || 0 },
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

                                        {/* Top Regions Bar Chart */}
                                        <div className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-200 border rounded-xl p-6 lg:col-span-2 shadow-inner">
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-2"><MapPin size={20} className="text-amber-500" /> Top Locations (Regions)</h3>
                                            <div className="h-72">
                                                {statsData.data.regionCounts.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={statsData.data.regionCounts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                                            <XAxis type="number" stroke="#9CA3AF" />
                                                            <YAxis dataKey="_id" type="category" stroke="#9CA3AF" width={100} />
                                                            <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} cursor={{ fill: '#374151', opacity: 0.4 }} />
                                                            <Bar dataKey="count" name="Users" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={30}>
                                                                {statsData.data.regionCounts.map((entry, index) => (
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
                                            <div style={{ height: statsData.data.professionCounts ? Math.max(288, statsData.data.professionCounts.length * 45) : 288 }} className="w-full transition-all duration-300">
                                                {statsData.data.professionCounts && statsData.data.professionCounts.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={statsData.data.professionCounts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                                            <XAxis type="number" stroke="#9CA3AF" />
                                                            <YAxis dataKey="_id" type="category" stroke="#9CA3AF" width={150} interval={0} tick={{ fontSize: 12 }} />
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
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <select
                                        value={orgFilter}
                                        onChange={(e) => setOrgFilter(e.target.value)}
                                        className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-300 border rounded-lg px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 transition-colors"
                                    >
                                        <option value="">All Organizations</option>
                                        <option value="KSA">KSA</option>
                                        <option value="KuMA">KuMA</option>
                                    </select>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="dark:bg-gray-800 bg-white dark:border-gray-700 border-gray-300 border rounded-lg px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 transition-colors"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="registered">Registered</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
                                    {usersData?.pagination?.total || 0} Total Members
                                </div>
                            </div>

                            {selectedUserIds.length > 0 && (
                                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex justify-between items-center px-4">
                                    <span className="text-amber-500 font-medium text-sm">{selectedUserIds.length} user(s) selected</span>
                                    <button
                                        onClick={handleSendBulkReminder}
                                        disabled={isSendingBulk}
                                        className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {isSendingBulk ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                        Send Message
                                    </button>
                                </div>
                            )}

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
                                                <th className="px-6 py-4 font-semibold w-12">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 checked:bg-amber-500 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-900"
                                                        checked={usersData?.data?.length > 0 && selectedUserIds.length === usersData?.data?.length}
                                                        onChange={handleSelectAllUsers}
                                                    />
                                                </th>
                                                <th className="px-6 py-4 font-semibold">Name</th>
                                                <th className="px-6 py-4 font-semibold">Email</th>
                                                <th className="px-6 py-4 font-semibold">Phone</th>
                                                <th className="px-6 py-4 font-semibold">Profession</th>
                                                <th className="px-6 py-4 font-semibold">Org</th>
                                                <th className="px-6 py-4 font-semibold">Location</th>
                                                <th className="px-6 py-4 font-semibold">Status</th>
                                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/50 relative">
                                            {usersData?.data?.map((u) => (
                                                <tr key={u._id} onClick={() => setEditingUserId(u._id)} className={`dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors text-sm cursor-pointer ${u.isBlocked ? 'dark:bg-red-900/10 bg-red-50/50' : ''} ${selectedUserIds.includes(u._id) ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 checked:bg-amber-500 text-amber-500 focus:ring-amber-500 focus:ring-offset-gray-900"
                                                            checked={selectedUserIds.includes(u._id)}
                                                            onChange={(e) => { e.stopPropagation(); handleSelectUser(u._id); }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
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
                                                    <td className="px-6 py-4 dark:text-gray-400 text-gray-500">{u.telephone || '-'}</td>
                                                    <td className="px-6 py-4 dark:text-gray-400 text-gray-500">{u.profession || '-'}</td>
                                                    <td className="px-6 py-4 dark:text-gray-400 text-gray-500">
                                                        {u.organization ? <span className="bg-gray-500/10 text-gray-500 dark:text-gray-400 px-2 py-1 rounded text-xs font-medium border border-gray-500/20">{u.organization}</span> : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 dark:text-gray-400 text-gray-500">{u.countyRegion || '-'}, {u.country || '-'}</td>
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
                                                            onClick={(e) => { e.stopPropagation(); handleToggleBlock(u._id, u.isBlocked); }}
                                                            title={u.isBlocked ? 'Unblock User (Allow Login)' : 'Block User (Prevent Login)'}
                                                            className={`p-2 rounded-lg transition-all ${u.isBlocked ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'dark:bg-gray-800 bg-gray-100 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400'}`}
                                                        >
                                                            {u.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(u._id); }}
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
                                    (() => {
                                        const allEvents = eventsData?.data ? [...eventsData.data] : [];
                                        
                                        // Helper: check if past/finished
                                        const isFinishedEvent = (ev) => {
                                            if (ev.isTBD) return false;
                                            if (!ev.date) return false;
                                            const eventDate = new Date(ev.date);
                                            const threeDaysAfter = new Date(eventDate.getTime() + 3 * 24 * 60 * 60 * 1000);
                                            return new Date() > threeDaysAfter;
                                        };

                                        // Partition events
                                        const upcomingEvents = allEvents.filter(ev => !isFinishedEvent(ev)).sort((a, b) => {
                                            if (a.isTBD && !b.isTBD) return 1;
                                            if (!a.isTBD && b.isTBD) return -1;
                                            if (a.isTBD && b.isTBD) return 0;
                                            return new Date(a.date) - new Date(b.date);
                                        });

                                        const finishedEvents = allEvents.filter(ev => isFinishedEvent(ev)).sort((a, b) => new Date(b.date) - new Date(a.date));

                                        const renderEventCard = (ev) => (
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
                                                            <span className="truncate">{ev.isTBD ? 'TBD (To Be Decided)' : new Date(ev.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
                                        );

                                        return (
                                            <div className="space-y-10">
                                                {/* Upcoming Events Section */}
                                                <div>
                                                    <h3 className="text-lg font-bold dark:text-[#C8A441] text-amber-600 mb-4 flex items-center gap-2">
                                                        <Calendar size={20} />
                                                        <span>Upcoming &amp; Active Events ({upcomingEvents.length})</span>
                                                    </h3>
                                                    {upcomingEvents.length === 0 ? (
                                                        <div className="text-center py-10 dark:bg-gray-900/30 bg-gray-50 rounded-xl border dark:border-gray-800 border-gray-200 text-gray-500">No upcoming events.</div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                            {upcomingEvents.map(renderEventCard)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Finished Events Section */}
                                                <div>
                                                    <h3 className="text-lg font-bold dark:text-emerald-400 text-emerald-600 mb-4 flex items-center gap-2">
                                                        <CheckCircle size={20} />
                                                        <span>Finished Events ({finishedEvents.length})</span>
                                                    </h3>
                                                    {finishedEvents.length === 0 ? (
                                                        <div className="text-center py-10 dark:bg-gray-900/30 bg-gray-50 rounded-xl border dark:border-gray-800 border-gray-200 text-gray-500">No finished events.</div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                            {finishedEvents.map(renderEventCard)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()
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
                                                <th className="px-6 py-4 font-semibold">Message</th>
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
                                                    <td className="px-6 py-4 max-w-xs">
                                                        {d.message ? (
                                                            <div className="space-y-2">
                                                                <p className="text-sm dark:text-gray-300 text-gray-600 italic line-clamp-2 leading-relaxed">
                                                                    "{d.message}"
                                                                </p>
                                                                <button
                                                                    onClick={() => toggleDonationMsg(d._id)}
                                                                    title={d.showPublicly ? 'Click to hide from public page' : 'Click to feature on public page'}
                                                                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 ${
                                                                        d.showPublicly
                                                                            ? 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30'
                                                                            : 'bg-gray-700/50 text-gray-400 border-gray-600/50 hover:bg-green-500/15 hover:text-green-400 hover:border-green-500/30'
                                                                    }`}
                                                                >
                                                                    {d.showPublicly
                                                                        ? <><Eye size={12} /> Featured</>
                                                                        : <><EyeOff size={12} /> Hidden</>
                                                                    }
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs dark:text-gray-600 text-gray-400">—</span>
                                                        )}
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

                    {/* TEAM TAB */}
                    {activeTab === 'team' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
                                    <Users className="text-amber-500" /> Team Members
                                </h2>
                                <button
                                    onClick={() => {
                                        setTeamImagePreview('');
                                        setTeamImageFile(null);
                                        setIsTeamModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-amber-500/20 text-sm"
                                >
                                    <Plus size={16} />
                                    <span>Add Team Member</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto min-h-[400px]">
                                {teamLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="animate-spin text-amber-500" size={48} />
                                    </div>
                                ) : !teamData?.data || teamData.data.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                        <Users size={48} className="mb-4 opacity-20" />
                                        <p>No team members recorded yet.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Member</th>
                                                <th className="px-6 py-4 font-semibold">Position</th>
                                                <th className="px-6 py-4 font-semibold">Team Type</th>
                                                <th className="px-6 py-4 font-semibold text-center">Sort Order</th>
                                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/50 relative">
                                            {[...teamData.data]
                                                .sort((a, b) => {
                                                    if (a.teamType !== b.teamType) {
                                                        return a.teamType.localeCompare(b.teamType);
                                                    }
                                                    return (a.order || 0) - (b.order || 0);
                                                })
                                                .map((member) => (
                                                    <tr key={member._id} className="dark:hover:bg-gray-700/30 hover:bg-gray-50 transition-colors text-sm">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 rounded-full border border-gray-700 overflow-hidden flex-shrink-0">
                                                                    <img
                                                                        src={member.image || '/Team/user.png'}
                                                                        alt={member.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="dark:text-white text-gray-900 font-medium">
                                                                        {member.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 dark:text-gray-300 text-gray-700 max-w-xs truncate" title={member.position}>
                                                            {member.position}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                                member.teamType === 'kmsf'
                                                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                                    : member.teamType === 'ksa'
                                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                                    : member.teamType === 'kuma'
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                            }`}>
                                                                {member.teamType}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center dark:text-gray-300 text-gray-700 font-mono">
                                                            {member.order || 0}
                                                        </td>
                                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingTeamMember(member);
                                                                    setTeamImagePreview('');
                                                                    setTeamImageFile(null);
                                                                    setIsTeamModalOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-500 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                                                                title="Edit Member"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTeamMember(member._id, member.name)}
                                                                className="p-1.5 rounded-lg dark:bg-gray-800 bg-gray-100 dark:text-gray-400 text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                                                title="Delete Member"
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
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Event Posters <span className="text-gray-500 text-xs">(up to 3)</span></label>

                                        {/* Existing saved images (edit mode) */}
                                        {existingImages.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500 mb-2">Saved images — click ✕ to remove:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {existingImages.map((url, idx) => (
                                                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(idx)}
                                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                                <X size={16} className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* New image previews */}
                                        {newImagePreviews.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500 mb-2">New images to upload:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {newImagePreviews.map((url, idx) => (
                                                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(idx)}
                                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                                <X size={16} className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload button */}
                                        <div
                                            className="relative border-2 border-dashed border-gray-700 hover:border-amber-500/50 rounded-lg p-4 bg-gray-800/50 text-center transition-colors cursor-pointer"
                                            onClick={() => imageInputRef.current?.click()}
                                        >
                                            <input
                                                ref={imageInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageFilesSelected}
                                            />
                                            <div className="text-amber-500 mb-1"><Plus size={22} className="mx-auto" /></div>
                                            <span className="text-sm text-gray-400">Click to add images (multiple allowed)</span>
                                            <p className="text-xs text-gray-600 mt-0.5">{existingImages.length + newImagePreviews.length} / 3 selected</p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Gallery Images <span className="text-gray-500 text-xs">(unlimited)</span></label>

                                        {/* Existing saved gallery images (edit mode) */}
                                        {existingGalleryImages.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500 mb-2">Saved gallery images — click ✕ to remove:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {existingGalleryImages.map((url, idx) => (
                                                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingGalleryImage(idx)}
                                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                                <X size={16} className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* New gallery previews */}
                                        {newGalleryPreviews.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500 mb-2">New gallery images to upload:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {newGalleryPreviews.map((url, idx) => (
                                                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewGalleryImage(idx)}
                                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                                <X size={16} className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload button for Gallery Images */}
                                        <div
                                            className="relative border-2 border-dashed border-gray-700 hover:border-amber-500/50 rounded-lg p-4 bg-gray-800/50 text-center transition-colors cursor-pointer"
                                            onClick={() => galleryInputRef.current?.click()}
                                        >
                                            <input
                                                ref={galleryInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleGalleryFilesSelected}
                                            />
                                            <div className="text-amber-500 mb-1"><Plus size={22} className="mx-auto" /></div>
                                            <span className="text-sm text-gray-400">Click to add gallery images (unlimited allowed)</span>
                                            <p className="text-xs text-gray-600 mt-0.5">{existingGalleryImages.length + newGalleryPreviews.length} selected</p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                        <textarea name="description" defaultValue={editingEvent?.description} rows="4" className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-400">Date</label>
                                            <label className="flex items-center gap-2 cursor-pointer text-xs dark:text-gray-400 text-gray-500">
                                                <input
                                                    type="checkbox"
                                                    checked={isEventTBD}
                                                    onChange={(e) => setIsEventTBD(e.target.checked)}
                                                    className="rounded dark:bg-gray-800 border-gray-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                                                />
                                                <span>TBD (To Be Decided)</span>
                                            </label>
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            defaultValue={editingEvent?.date?.split('T')[0]}
                                            required={!isEventTBD}
                                            disabled={isEventTBD}
                                            className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
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
                                    <button 
                                        type="button" 
                                        disabled={isCreatingEvent || isUpdatingEvent}
                                        onClick={() => { setIsEventModalOpen(false); setEditingEvent(null); }} 
                                        className="px-6 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isCreatingEvent || isUpdatingEvent}
                                        className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        {(isCreatingEvent || isUpdatingEvent) ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>{editingEvent ? 'Saving...' : 'Publishing...'}</span>
                                            </>
                                        ) : (
                                            <span>{editingEvent ? 'Save Changes' : 'Publish Event'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isBulkEmailModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold dark:text-white text-gray-900">Send Bulk Message</h2>
                                <button onClick={() => setIsBulkEmailModalOpen(false)} className="dark:text-gray-400 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleConfirmBulkEmail} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Email Title / Subject</label>
                                        <input
                                            type="text"
                                            required
                                            value={bulkEmailForm.title}
                                            onChange={(e) => setBulkEmailForm({ ...bulkEmailForm, title: e.target.value })}
                                            placeholder="e.g. Important Update from KMSF"
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">Email Message</label>
                                        <textarea
                                            required
                                            rows="6"
                                            value={bulkEmailForm.message}
                                            onChange={(e) => setBulkEmailForm({ ...bulkEmailForm, message: e.target.value })}
                                            placeholder="Type your message here..."
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsBulkEmailModalOpen(false)} className="px-5 py-2 rounded-lg font-medium dark:text-gray-300 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSendingBulk} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 px-6 py-2 rounded-lg font-bold disabled:opacity-50">
                                        {isSendingBulk ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                        Send to {selectedUserIds.length} Users
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Team Member Modal */}
            <AnimatePresence>
                {isTeamModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { if (!isCreatingTeam && !isUpdatingTeam) { setIsTeamModalOpen(false); setEditingTeamMember(null); } }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <form key={editingTeamMember?._id || 'new'} onSubmit={handleCreateTeamMember} className="p-8">
                                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
                                    <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                                        {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
                                    </h2>
                                    <button
                                        type="button"
                                        disabled={isCreatingTeam || isUpdatingTeam}
                                        onClick={() => { setIsTeamModalOpen(false); setEditingTeamMember(null); }}
                                        className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Photo Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Member Photo {editingTeamMember ? '(optional)' : '*'}</label>
                                        {(teamImagePreview || editingTeamMember?.image) ? (
                                            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#C8A441] shadow-lg group">
                                                <img src={teamImagePreview || editingTeamMember?.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    disabled={isCreatingTeam || isUpdatingTeam}
                                                    onClick={() => {
                                                        setTeamImagePreview('');
                                                        setTeamImageFile(null);
                                                        if (editingTeamMember) {
                                                            // Temporarily clear local reference to force file selector to render
                                                            setEditingTeamMember(prev => ({ ...prev, image: '' }));
                                                        }
                                                    }}
                                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-red-400 font-bold"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="border-2 border-dashed border-gray-700 hover:border-[#C8A441]/50 rounded-xl p-6 bg-gray-800/40 text-center transition-colors cursor-pointer max-w-xs mx-auto"
                                                onClick={() => { if (!isCreatingTeam && !isUpdatingTeam) teamImageInputRef.current?.click(); }}
                                            >
                                                <input
                                                    ref={teamImageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleTeamImageFileSelected}
                                                    required={!editingTeamMember}
                                                />
                                                <Upload size={32} className="mx-auto text-amber-500 mb-2" />
                                                <span className="text-sm text-gray-400 font-medium">Select Photo</span>
                                                <p className="text-xs text-gray-500 mt-1">Accepts PNG, JPG, JPEG (will be compressed to WebP)</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                                            <input
                                                name="memberName"
                                                required
                                                defaultValue={editingTeamMember?.name}
                                                placeholder="e.g. Dr. Jane Doe"
                                                className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Position / Title *</label>
                                            <input
                                                name="memberPosition"
                                                required
                                                defaultValue={editingTeamMember?.position}
                                                placeholder="e.g. Secretary - Surgeon, Consultant"
                                                className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Team Group *</label>
                                            <select
                                                name="memberTeamType"
                                                required
                                                defaultValue={editingTeamMember?.teamType || 'kmsf'}
                                                className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                                            >
                                                <option value="kmsf">KMSF</option>
                                                <option value="ksa">KSA</option>
                                                <option value="kuma">KuMA</option>
                                                <option value="audioVisual">Audio Visual</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Sort Order Number</label>
                                            <input
                                                type="number"
                                                name="memberOrder"
                                                defaultValue={editingTeamMember?.order || '0'}
                                                min="0"
                                                className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-mono"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Brief Bio (1-2 sentences overview) *</label>
                                            <textarea
                                                name="memberBio"
                                                required
                                                defaultValue={editingTeamMember?.bio}
                                                rows="2"
                                                placeholder="Brief intro shown on grid card..."
                                                className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm resize-none"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Details (Shown in popup modal on read more) *</label>
                                            <textarea
                                                name="memberDetail"
                                                required
                                                defaultValue={editingTeamMember?.detail}
                                                rows="5"
                                                placeholder="Complete academic background, career highlights, and contributions..."
                                                className="w-full dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-300 border rounded-lg px-4 py-2.5 dark:text-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm resize-y"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        disabled={isCreatingTeam || isUpdatingTeam}
                                        onClick={() => { setIsTeamModalOpen(false); setEditingTeamMember(null); }}
                                        className="px-6 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreatingTeam || isUpdatingTeam}
                                        className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        {(isCreatingTeam || isUpdatingTeam) ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>{editingTeamMember ? 'Saving...' : 'Adding...'}</span>
                                            </>
                                        ) : (
                                            <span>{editingTeamMember ? 'Save Changes' : 'Add Member'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AdminEditUserModal isOpen={!!editingUserId} userId={editingUserId} onClose={() => setEditingUserId(null)} />
        </div>
    );
};


export default AdminDashboard;

