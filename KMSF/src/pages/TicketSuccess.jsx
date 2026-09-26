import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVerifyTicketSessionMutation } from '../store/api/apiSlice';

export default function TicketSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const hasVerified = useRef(false);

    const sessionId = searchParams.get('session_id');
    const [verifyTicketSession] = useVerifyTicketSessionMutation();

    useEffect(() => {
        if (!sessionId) {
            navigate('/events');
            return;
        }

        // Prevent double-fire in React StrictMode
        if (hasVerified.current) return;
        hasVerified.current = true;

        const verify = async () => {
            try {
                const result = await verifyTicketSession(sessionId).unwrap();
                setStatus('success');
                toast.success(result.message || 'Ticket confirmed!', { id: 'ticket-success' });
            } catch (err) {
                console.error('[TicketSuccess] Verification failed:', err);
                // If 401, the user is logged out — let the base query handler redirect
                if (err?.status === 401) return;

                setStatus('error');
                setErrorMsg(
                    err?.data?.message || 'Could not verify your ticket. Please contact support.'
                );
                toast.error('Ticket verification failed. Please contact support.', { id: 'ticket-error' });
            }
        };

        // Small delay to let webhook complete first
        const timer = setTimeout(verify, 2000);
        return () => clearTimeout(timer);
    }, [sessionId, navigate, verifyTicketSession]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                
                {status === 'verifying' ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-[#C8A441] mb-4 animate-spin" />
                        <h2 className="text-xl font-bold dark:text-white text-gray-900">Confirming Your Ticket...</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            Please wait while we verify your payment.
                        </p>
                    </div>
                ) : status === 'success' ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Your ticket has been confirmed. You can view your digital tickets in your profile.
                        </p>

                        <div className="flex flex-col w-full gap-4">
                            <Link
                                to="/profile?tab=tickets"
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#C8A441] to-[#F2AE02] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A441]"
                            >
                                View My Tickets
                            </Link>
                            <Link
                                to="/events"
                                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                            >
                                Back to Events
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-20 h-20 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Issue</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {errorMsg}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                            Your payment was received. If your ticket doesn't appear shortly, please contact us with your session ID.
                        </p>

                        <div className="flex flex-col w-full gap-4">
                            <Link
                                to="/profile?tab=tickets"
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#C8A441] to-[#F2AE02] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A441]"
                            >
                                Check My Tickets
                            </Link>
                            <Link
                                to="/contact"
                                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

