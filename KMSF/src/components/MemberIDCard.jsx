import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Calendar, Briefcase, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MemberIDCard = ({ user }) => {
    const { isDark } = useTheme();
    if (!user) return null;

    return (
        <div className={`relative w-full max-w-md mx-auto aspect-[1.6/1] overflow-hidden shadow-2xl border ${isDark
                ? 'bg-gray-900 border-yellow-500/30'
                : 'bg-white border-yellow-500/50 shadow-gray-200'
            }`}>
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-600/10 blur-3xl -ml-16 -mb-16"></div>

            {/* Card Header */}
            <div className={`relative flex items-center justify-between p-6 border-b border-yellow-500/20 ${isDark
                    ? 'bg-gradient-to-r from-gray-800 to-gray-900'
                    : 'bg-gradient-to-r from-gray-100 to-gray-50'
                }`}>
                <div className="flex items-center gap-3">
                    <img src="/KMSF_logo.png" className="w-10 h-10" alt="KMSF Logo" />
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent leading-none">
                            KMSF
                        </h2>
                        <p className={`text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Member Official ID
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-[10px] uppercase tracking-tighter ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Status</div>
                    {user.membershipStatus === 'active' ? (
                        <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                            <Star size={12} className="fill-green-500" />
                            PAID MEMBER
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                            <Shield size={12} />
                            FREE
                        </div>
                    )}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex gap-6">
                {/* Profile Image Placeholder */}
                <div className={`w-24 h-28 border-2 border-yellow-500/50 flex items-center justify-center shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                    <User size={48} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                </div>

                {/* User Details */}
                <div className="flex-1 space-y-3">
                    <div>
                        <div className={`text-[10px] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Full Name</div>
                        <div className={`text-lg font-bold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.title} {user.firstName} {user.lastName}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className={`text-[10px] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Member ID</div>
                            <div className="text-xs font-mono text-yellow-500 font-bold">{user.memberId || 'PENDING'}</div>
                        </div>
                        <div>
                            <div className={`text-[10px] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Organization</div>
                            <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{user.organization || 'KMSF'}</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Briefcase size={12} className="text-yellow-600" />
                            <span className="text-[10px]">{user.speciality || 'Medical Professional'}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Calendar size={12} className="text-yellow-600" />
                            <span className="text-[10px]">Exp: {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Footer - paid member banner */}
            {user.membershipStatus === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-700 flex items-center justify-center gap-1">
                    <Star size={10} className="fill-white text-white" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">Full Paid Member</span>
                    <Star size={10} className="fill-white text-white" />
                </div>
            )}
            {/* Bottom line decor */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
        </div>
    );
};

export default MemberIDCard;
