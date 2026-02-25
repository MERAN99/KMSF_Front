import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Calendar, MapPin, Briefcase } from 'lucide-react';

const MemberIDCard = ({ user }) => {
    if (!user) return null;

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[1.6/1] bg-gray-900 overflow-hidden shadow-2xl border border-yellow-500/30">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-600/10 blur-3xl -ml-16 -mb-16"></div>

            {/* Card Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-yellow-500/20 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="flex items-center gap-3">
                    <img src="/KMSF_logo.png" className="w-10 h-10" alt="KMSF Logo" />
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent leading-none">
                            KMSF
                        </h2>
                        <p className="text-[10px] text-gray-400 tracking-widest uppercase">Member Official ID</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Status</div>
                    <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                        <Shield size={12} />
                        ACTIVE
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex gap-6">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-28 bg-gray-800 border-2 border-yellow-500/50 flex items-center justify-center shrink-0">
                    <User size={48} className="text-gray-600" />
                </div>

                {/* User Details */}
                <div className="flex-1 space-y-3">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase">FullName</div>
                        <div className="text-lg font-bold text-white leading-none">
                            {user.title} {user.firstName} {user.lastName}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Member ID</div>
                            <div className="text-xs font-mono text-yellow-500 font-bold">{user.memberId || 'PENDING'}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Organization</div>
                            <div className="text-xs text-white font-medium">{user.organization || 'KMSF'}</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Briefcase size={12} className="text-yellow-600" />
                            <span className="text-[10px]">{user.speciality || 'Medical Professional'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Calendar size={12} className="text-yellow-600" />
                            <span className="text-[10px]">Exp: {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Footer Decor */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
        </div>
    );
};

export default MemberIDCard;
