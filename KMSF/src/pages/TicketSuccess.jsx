import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TicketSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            navigate('/events');
            return;
        }
        
        // In a real app, we might want to verify the session with the backend here.
        // For now, webhooks handle fulfillment, so we just show success.
        setStatus('success');
        toast.success('Ticket bought successfully!', { id: 'ticket-success' });
        
    }, [sessionId, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                
                {status === 'verifying' ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C8A441] mb-4"></div>
                        <h2 className="text-xl font-bold dark:text-white text-gray-900">Verifying Ticket Purchase...</h2>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
