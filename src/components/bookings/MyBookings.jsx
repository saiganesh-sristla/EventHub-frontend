import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings, cancelBooking, confirmBooking } from '../../services/bookingService';
import { saveAs } from 'file-saver';
import { QRCodeCanvas } from 'qrcode.react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load your bookings.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ));
      } catch (error) {
        console.error('Error cancelling booking:', error);
        setError('Failed to cancel booking.');
      }
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'confirmed' } 
          : booking
      ));
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError('Failed to confirm booking.');
    }
  };

  const generateTicket = (booking) => {
    // Create a canvas element to draw the ticket
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set ticket dimensions
    canvas.width = 800;
    canvas.height = 350;

    // Draw ticket background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Add header
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, canvas.width, 70);
    
    // Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('EVENT TICKET', 30, 45);
    
    // Add event details
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(booking.event.title, 30, 110);
    
    ctx.font = '18px Arial';
    ctx.fillText(`Location: ${booking.event.location}`, 30, 150);
    
    const eventDate = new Date(booking.event.date).toLocaleDateString();
    ctx.fillText(`Date: ${eventDate}`, 30, 180);
    ctx.fillText(`Time: ${booking.event.time}`, 30, 210);
    ctx.fillText(`Tickets: ${booking.ticketCount}`, 30, 240);
    ctx.fillText(`Booking ID: ${booking._id.substring(0, 8)}`, 30, 270);
    ctx.fillText(`Status: CONFIRMED`, 30, 300);

    // Get the QR code canvas element
    if (qrCodeRef.current) {
      const qrCanvas = qrCodeRef.current.querySelector('canvas');
      if (qrCanvas) {
        // Draw QR code on main canvas
        ctx.drawImage(qrCanvas, canvas.width - 150, 100, 120, 120);
        
        // Convert canvas to blob and download
        canvas.toBlob(function(blob) {
          saveAs(blob, `event-ticket-${booking._id.substring(0, 8)}.png`);
        });
      }
    }
  };

  const downloadTicket = (booking) => {
    try {
      // First set QR code value
      setTicketBooking(booking);
      
      // Use setTimeout to ensure QR code is rendered before generating ticket
      setTimeout(() => {
        generateTicket(booking);
      }, 100);
    } catch (error) {
      console.error('Error generating ticket:', error);
      setError('Failed to generate ticket.');
    }
  };

  // State to hold the current booking for ticket generation
  const [ticketBooking, setTicketBooking] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>
      
      {/* Hidden QR code for ticket generation */}
      <div ref={qrCodeRef} style={{ display: 'none' }}>
        {ticketBooking && (
          <QRCodeCanvas 
            value={ticketBooking._id} 
            size={120}
          />
        )}
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 shadow-sm">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center shadow-md border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">You haven't booked any events yet.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Browse events
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.event.title}</div>
                          <div className="text-sm text-gray-500">{booking.event.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{new Date(booking.event.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{booking.event.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.ticketCount} {booking.ticketCount === 1 ? 'ticket' : 'tickets'}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ${booking.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Confirm
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition duration-150"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <button 
                          onClick={() => downloadTicket(booking)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Download Ticket
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;