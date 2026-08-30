import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Download, Ticket as TicketIcon, AlertTriangle } from 'lucide-react';
import { useGetUserTicketsQuery } from '../store/api/apiSlice';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

// Helper: check if an event's date is in the past
const isEventExpired = (ticket) => {
  if (!ticket.event) return true; // event deleted from DB
  if (ticket.event.isTBD) return false; // TBD events are never "expired"
  if (!ticket.event.date) return false;
  const eventDate = new Date(ticket.event.date);
  // Consider expired if the event date is before today (start of day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

// Safe getters so we never crash on null event
const getEventTitle = (ticket) => ticket.event?.title || 'Deleted Event';
const getEventCategory = (ticket) => ticket.event?.category || 'N/A';
const getEventDate = (ticket) => {
  if (!ticket.event) return 'N/A';
  if (ticket.event.isTBD) return 'TBD';
  return ticket.event.date ? new Date(ticket.event.date).toLocaleDateString() : 'N/A';
};
const getEventTime = (ticket) => ticket.event?.time || 'N/A';
const getEventLocation = (ticket) => ticket.event?.location || 'N/A';

export default function MyTicketsModal({ isOpen, onClose }) {
  const { data: ticketsData, isLoading } = useGetUserTicketsQuery(undefined, { skip: !isOpen });
  const allTickets = ticketsData?.data || [];

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'expired'

  // Separate active and expired
  const activeTickets = allTickets.filter(t => !isEventExpired(t));
  const expiredTickets = allTickets.filter(t => isEventExpired(t));

  const displayedTickets = filter === 'active' ? activeTickets
                         : filter === 'expired' ? expiredTickets
                         : allTickets;

  const downloadTicket = async (ticketId) => {
    const ticketElement = document.getElementById(`ticket-${ticketId}`);
    if (!ticketElement) return;
    
    try {
      const dataUrl = await toPng(ticketElement, { 
          backgroundColor: '#ffffff',
          pixelRatio: 2
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ticket-${ticketId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading ticket', err);
      alert('Failed to download ticket. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
            <TicketIcon className="text-[#C8A441]" />
            My Tickets
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Filter Tabs */}
        {allTickets.length > 0 && (
          <div className="px-6 pt-4 flex gap-2">
            {[
              { key: 'all', label: `All (${allTickets.length})` },
              { key: 'active', label: `Active (${activeTickets.length})` },
              { key: 'expired', label: `Expired (${expiredTickets.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); setSelectedTicket(null); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-[#C8A441] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-grow flex flex-col md:flex-row gap-6">
          {isLoading ? (
            <div className="w-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A441]"></div>
            </div>
          ) : allTickets.length === 0 ? (
            <div className="w-full text-center py-12 text-gray-500 dark:text-gray-400">
              You haven't acquired any event tickets yet.
            </div>
          ) : displayedTickets.length === 0 ? (
            <div className="w-full text-center py-12 text-gray-500 dark:text-gray-400">
              No {filter} tickets found.
            </div>
          ) : (
            <>
              {/* Ticket List */}
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                {displayedTickets.map((ticket) => {
                  const expired = isEventExpired(ticket);
                  const eventDeleted = !ticket.event;
                  return (
                    <div
                      key={ticket._id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all relative ${
                        expired ? 'opacity-70' : ''
                      } ${
                        selectedTicket?._id === ticket._id
                          ? 'border-[#C8A441] bg-amber-50 dark:bg-amber-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {expired && (
                        <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-semibold">
                          {eventDeleted ? 'Event Removed' : 'Expired'}
                        </span>
                      )}
                      <p className={`font-bold text-sm truncate pr-16 ${expired ? 'text-gray-400 dark:text-gray-500' : 'dark:text-white'}`}>
                        {getEventTitle(ticket)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Event: {getEventDate(ticket)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Bought: {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{ticket.ticketType}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ticket.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ticket.paymentStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ticket Details / Digital View */}
              <div className="w-full md:w-2/3 border-l border-gray-200 dark:border-gray-800 md:pl-6">
                {selectedTicket ? (
                  <div className="flex flex-col items-center">
                    {/* Expired Banner */}
                    {isEventExpired(selectedTicket) && (
                      <div className="w-full max-w-sm mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-3">
                        <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                            {!selectedTicket.event ? 'Event Removed' : 'Event Has Ended'}
                          </p>
                          <p className="text-xs text-red-500 dark:text-red-400/80">
                            {!selectedTicket.event
                              ? 'This event has been removed from the system. Your ticket purchase is recorded below.'
                              : 'This event has already taken place. Your ticket is kept as a record.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* The Ticket Itself */}
                    <div id={`ticket-${selectedTicket._id}`} className={`w-full max-w-sm bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden mb-6 ${isEventExpired(selectedTicket) ? 'grayscale-[40%]' : ''}`}>
                      <div className={`${isEventExpired(selectedTicket) ? 'bg-gray-500' : 'bg-[#C8A441]'} text-white p-6 text-center`}>
                        <h3 className="text-lg font-bold leading-tight mb-1">{getEventTitle(selectedTicket)}</h3>
                        <p className="text-sm opacity-90">{getEventCategory(selectedTicket)}</p>
                        {isEventExpired(selectedTicket) && (
                          <p className="text-xs mt-2 bg-white/20 inline-block px-3 py-0.5 rounded-full uppercase tracking-widest font-semibold">
                            {!selectedTicket.event ? 'Removed' : 'Expired'}
                          </p>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-center mb-6">
                           {/* QR Code representing the unique ticket ID */}
                           <div className="p-2 border-2 border-gray-100 rounded-xl">
                             <QRCode value={selectedTicket.ticketCode} size={150} />
                           </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-700 text-sm">
                            <Calendar className="w-4 h-4 mr-3 text-[#C8A441]" />
                            <span>{getEventDate(selectedTicket)}</span>
                          </div>
                          <div className="flex items-center text-gray-700 text-sm">
                            <Clock className="w-4 h-4 mr-3 text-[#C8A441]" />
                            <span>{getEventTime(selectedTicket)}</span>
                          </div>
                          <div className="flex items-start text-gray-700 text-sm">
                            <MapPin className="w-4 h-4 mr-3 text-[#C8A441] mt-0.5" />
                            <span className="leading-tight">{getEventLocation(selectedTicket)}</span>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Ticket Type</p>
                                <p className="font-bold text-gray-800 mb-3">{selectedTicket.ticketType}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Bought On</p>
                                <p className="font-bold text-gray-800">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex flex-col justify-end">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Ticket ID</p>
                                <p className="font-mono text-gray-600 font-bold">{selectedTicket.ticketCode}</p>
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => downloadTicket(selectedTicket._id)}
                      className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <Download size={18} />
                      Download to your device
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    Select a ticket to view details
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
