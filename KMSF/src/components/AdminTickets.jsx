import React, { useState } from 'react';
import { useAdminGetEventsQuery, useGetAdminEventTicketsQuery } from '../store/api/apiSlice';
import { Loader2, Calendar, Users, Printer, MapPin, Search, ChevronLeft } from 'lucide-react';

export default function AdminTickets() {
    const { data: eventsData, isLoading: eventsLoading } = useAdminGetEventsQuery();
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: ticketsData, isLoading: ticketsLoading } = useGetAdminEventTicketsQuery(selectedEventId, { skip: !selectedEventId });

    const selectedEvent = eventsData?.data?.find(e => e._id === selectedEventId);
    
    // Sort events by date descending
    const eventsList = [...(eventsData?.data || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

    const handlePrint = () => {
        const printContent = document.getElementById('printable-area').innerHTML;
        const printWindow = window.open('', '', 'width=900,height=650');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Attendee List</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f4f4f4; }
                        .print-hidden { display: none !important; }
                    </style>
                </head>
                <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    if (eventsLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
    }

    if (!selectedEventId) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="text-amber-500" />
                    Select an Event to View Attendees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsList.map(event => (
                        <div 
                            key={event._id} 
                            onClick={() => setSelectedEventId(event._id)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition-colors shadow-sm hover:shadow-md group"
                        >
                            <h3 className="font-bold text-lg dark:text-white group-hover:text-amber-500 transition-colors mb-2 truncate">{event.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <Calendar size={14} className="mr-2 text-amber-500" />
                                {event.isTBD ? 'TBD' : new Date(event.date).toLocaleDateString()} at {event.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <MapPin size={14} className="mr-2 text-amber-500" />
                                <span className="truncate">{event.location}</span>
                            </div>
                            <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm py-2 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                View Tickets
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const filteredTickets = ticketsData?.data?.filter(t => {
        const firstName = t.user?.firstName || '';
        const lastName = t.user?.lastName || '';
        const email = t.user?.email || '';
        const code = t.ticketCode || '';
        const term = searchTerm.toLowerCase();
        return firstName.toLowerCase().includes(term) || 
               lastName.toLowerCase().includes(term) ||
               email.toLowerCase().includes(term) ||
               code.toLowerCase().includes(term);
    }) || [];

    return (
        <div className="p-6" id="printable-area">
            {/* Header / Print specific styles */}
            <div className="print-hidden mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button 
                        onClick={() => setSelectedEventId(null)}
                        className="text-gray-500 hover:text-amber-500 flex items-center text-sm font-medium mb-3 transition-colors"
                    >
                        <ChevronLeft size={16} className="mr-1" /> Back to Events
                    </button>
                    <h2 className="text-2xl font-bold dark:text-white text-gray-900">{selectedEvent?.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center">
                        <Calendar size={14} className="mr-2" /> {selectedEvent?.isTBD ? 'TBD' : new Date(selectedEvent?.date).toLocaleDateString()} | {filteredTickets.length} Attendees
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search attendees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500 dark:text-white"
                        />
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        <Printer size={16} /> Print List
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="hidden print:block mb-8 text-black">
                <h1 className="text-2xl font-bold mb-2 text-black">Attendee List: {selectedEvent?.title}</h1>
                <p className="text-sm">Date: {selectedEvent?.isTBD ? 'TBD' : new Date(selectedEvent?.date).toLocaleDateString()} | Total Attendees: {ticketsData?.data?.length || 0}</p>
                <hr className="my-4 border-black" />
            </div>

            {/* Data Table */}
            {ticketsLoading ? (
                 <div className="flex justify-center py-20 print-hidden"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
            ) : filteredTickets.length === 0 ? (
                <div className="text-center py-20 text-gray-500 border border-dashed rounded-xl dark:border-gray-700 print-hidden">
                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                    No attendees found for this event.
                </div>
            ) : (
                <div className="overflow-x-auto print:overflow-visible rounded-xl border border-gray-200 dark:border-gray-700 print:border-none">
                    <table className="w-full text-left text-sm print:text-black">
                        <thead className="bg-gray-50 dark:bg-gray-800 print:bg-transparent text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700 print:border-black">
                            <tr>
                                <th className="px-6 py-4 print:px-2">#</th>
                                <th className="px-6 py-4 print:px-2">Ticket ID</th>
                                <th className="px-6 py-4 print:px-2">Name</th>
                                <th className="px-6 py-4 print:px-2">Email</th>
                                <th className="px-6 py-4 print:px-2">Type</th>
                                <th className="px-6 py-4 print:px-2">Profession</th>
                                <th className="px-6 py-4 print:px-2">Bought On</th>
                                <th className="px-6 py-4 print:px-2 print-hidden">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-300">
                            {filteredTickets.map((ticket, index) => (
                                <tr key={ticket._id} className={`dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 print:hover:bg-transparent ${!ticket.user ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-3 print:px-2">{index + 1}</td>
                                    <td className="px-6 py-3 print:px-2 font-mono font-medium">{ticket.ticketCode}</td>
                                    <td className="px-6 py-3 print:px-2 font-medium dark:text-white print:text-black">
                                        {ticket.user ? `${ticket.user.firstName} ${ticket.user.lastName}` : <span className="italic text-gray-400">Deleted User</span>}
                                    </td>
                                    <td className="px-6 py-3 print:px-2 text-gray-500 dark:text-gray-400 print:text-gray-700">{ticket.user?.email || '—'}</td>
                                    <td className="px-6 py-3 print:px-2">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs font-medium print:bg-transparent print:p-0">
                                            {ticket.ticketType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 print:px-2 text-gray-500 dark:text-gray-400 print:text-gray-700">{ticket.user?.profession || '-'}</td>
                                    <td className="px-6 py-3 print:px-2 text-gray-500 dark:text-gray-400 print:text-gray-700">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 print:px-2 print-hidden">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            ticket.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            ticket.paymentStatus === 'free' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            {ticket.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
