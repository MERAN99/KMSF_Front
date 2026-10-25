import React, { useState, useMemo } from 'react';
import { X, Search, Mail, Phone, MapPin, Building, Briefcase, ExternalLink, Copy, Check, Users } from 'lucide-react';

const ProfessionUsersModal = ({ isOpen, onClose, professionData, onSelectUser, onFilterInTable }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedEmails, setCopiedEmails] = useState(false);

    const users = professionData?.users || [];
    const professionTitle = professionData?._id || 'Specialty';
    const totalCount = professionData?.count || users.length;

    // Filter users based on local search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const q = searchTerm.toLowerCase();
        return users.filter((u) => {
            const fullName = `${u.title || ''} ${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
            const email = (u.email || '').toLowerCase();
            const memberId = (u.memberId || '').toLowerCase();
            const org = (u.organization || '').toLowerCase();
            const prof = (u.profession || '').toLowerCase();
            const spec = (u.speciality || '').toLowerCase();
            const loc = `${u.city || ''} ${u.country || ''}`.toLowerCase();
            return (
                fullName.includes(q) ||
                email.includes(q) ||
                memberId.includes(q) ||
                org.includes(q) ||
                prof.includes(q) ||
                spec.includes(q) ||
                loc.includes(q)
            );
        });
    }, [users, searchTerm]);

    // Organization summary counts
    const orgBreakdown = useMemo(() => {
        const counts = {};
        users.forEach((u) => {
            const org = u.organization || 'Other';
            counts[org] = (counts[org] || 0) + 1;
        });
        return counts;
    }, [users]);

    // Copy all member emails to clipboard
    const handleCopyAllEmails = () => {
        const emailList = users.map((u) => u.email).filter(Boolean).join(', ');
        if (!emailList) return;
        navigator.clipboard.writeText(emailList);
        setCopiedEmails(true);
        setTimeout(() => setCopiedEmails(false), 2500);
    };

    if (!isOpen || !professionData) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 bg-gray-900/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border dark:border-gray-800 border-gray-200">
                
                {/* Header */}
                <div className="px-6 py-5 border-b dark:border-gray-800 border-gray-200 bg-gradient-to-r dark:from-gray-900 dark:to-gray-800/80 from-amber-500/5 to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shadow-sm">
                            <Briefcase size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-xl font-bold dark:text-white text-gray-900">
                                    {professionTitle}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    {totalCount} {totalCount === 1 ? 'member' : 'members'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Users categorized under this specialty
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {users.length > 0 && (
                            <button
                                onClick={handleCopyAllEmails}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium dark:bg-gray-800 bg-gray-100 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 text-gray-700 dark:text-gray-300 transition-all border dark:border-gray-700 border-gray-300"
                                title="Copy all emails to clipboard"
                            >
                                {copiedEmails ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copiedEmails ? 'Copied!' : 'Copy Emails'}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 dark:text-gray-400 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Organization & Quick Stats Strip */}
                <div className="px-6 py-2.5 dark:bg-gray-800/40 bg-gray-50 border-b dark:border-gray-800/70 border-gray-200 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                        <Building size={13} /> Organizations:
                    </span>
                    {Object.entries(orgBreakdown).map(([org, count]) => (
                        <span
                            key={org}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700 border-gray-200 text-gray-700 dark:text-gray-300 font-medium"
                        >
                            {org}: <strong className="text-amber-500">{count}</strong>
                        </span>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-900">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder={`Search members by name, email, or exact entered profession...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border dark:border-gray-700 border-gray-300 dark:bg-gray-800/70 bg-gray-50 dark:text-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Users List / Table */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y dark:divide-gray-800/60 divide-gray-100">
                    {filteredUsers.length === 0 ? (
                        <div className="py-16 text-center">
                            <Users size={36} className="mx-auto text-gray-400 mb-2 opacity-50" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {searchTerm ? 'No members found matching your search.' : 'No members found in this specialty.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredUsers.map((user) => {
                                const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
                                const exactProfession = user.profession || user.speciality;
                                const isDifferentFromCanonical = exactProfession && exactProfession.toLowerCase() !== professionTitle.toLowerCase();

                                return (
                                    <div
                                        key={user._id}
                                        className="p-4 rounded-xl border dark:border-gray-800 border-gray-200/80 dark:bg-gray-800/40 bg-white hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                    >
                                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                            {/* Avatar Initials */}
                                            <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm tracking-wider flex-shrink-0 border border-amber-500/20">
                                                {initials}
                                            </div>

                                            {/* User Info */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-sm dark:text-white text-gray-900 truncate">
                                                        {user.title ? `${user.title} ` : ''}{user.firstName} {user.lastName}
                                                    </span>
                                                    {user.memberId && (
                                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border dark:border-gray-700 border-gray-200">
                                                            {user.memberId}
                                                        </span>
                                                    )}
                                                    {user.organization && (
                                                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                            {user.organization}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize border ${
                                                            user.membershipStatus === 'active'
                                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                : user.membershipStatus === 'registered'
                                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        }`}
                                                    >
                                                        {user.membershipStatus || 'registered'}
                                                    </span>
                                                </div>

                                                {/* What the user actually typed */}
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                                    {exactProfession && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Briefcase size={12} className="text-amber-500 flex-shrink-0" />
                                                            <span>Entered:</span>
                                                            <strong className={`${isDifferentFromCanonical ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                "{exactProfession}"
                                                            </strong>
                                                        </span>
                                                    )}
                                                    {(user.city || user.country) && (
                                                        <span className="inline-flex items-center gap-1 text-gray-400">
                                                            • <MapPin size={11} /> {user.city ? `${user.city}, ` : ''}{user.country || ''}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Contact Details */}
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                                    {user.email && (
                                                        <a
                                                            href={`mailto:${user.email}`}
                                                            className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Mail size={12} /> {user.email}
                                                        </a>
                                                    )}
                                                    {user.telephone && (
                                                        <a
                                                            href={`tel:${user.telephone}`}
                                                            className="flex items-center gap-1 hover:text-amber-500 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Phone size={12} /> {user.telephone}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action: Open User Edit Modal */}
                                        <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                                            {onSelectUser && (
                                                <button
                                                    onClick={() => {
                                                        onSelectUser(user._id);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white transition-all border border-amber-500/20"
                                                >
                                                    <span>View / Edit</span>
                                                    <ExternalLink size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t dark:border-gray-800 border-gray-200 bg-gray-50 dark:bg-gray-900/60 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Showing {filteredUsers.length} of {users.length} members
                    </p>
                    <div className="flex items-center gap-2">
                        {onFilterInTable && (
                            <button
                                onClick={() => {
                                    onFilterInTable(professionTitle);
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-medium dark:text-gray-300 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            >
                                Filter in Users Table
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfessionUsersModal;
