import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { getEventBookings } from '../services/bookingService';

// Import Lucide icons instead of heroicons
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Ticket, 
  CheckCircle,
  Download,
  FilterX,
  AlertTriangle
} from 'lucide-react';

const EventBookings = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalTickets: 0,
    totalRevenue: 0,
    confirmedBookings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Show loading state
        setLoading(true);
        
        // Fetch event details
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
        // Fetch bookings
        const bookingsData = await getEventBookings(eventId);
        setBookings(bookingsData);
        
        // Calculate stats
        const totalBookings = bookingsData.length;
        const totalTickets = bookingsData.reduce((sum, booking) => sum + booking.ticketCount, 0);
        const totalRevenue = bookingsData.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const confirmedBookings = bookingsData.filter(booking => booking.status === 'confirmed').length;
        
        setStats({
          totalBookings,
          totalTickets,
          totalRevenue,
          confirmedBookings
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load event bookings.');
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-800 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading event bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-md mb-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
        <Link to="/organizer/events" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to my events
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Link to="/organizer/events" className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to my events
          </Link>
          
          {event && (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <h2 className="text-xl md:text-2xl font-medium text-blue-200 mb-4">Bookings Management</h2>
              <div className="flex flex-wrap items-center gap-6 text-blue-100 mt-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-800" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-800">Total Bookings</h3>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Ticket className="h-6 w-6 text-green-800" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-800">Total Tickets</h3>
            </div>
            <p className="text-3xl font-bold text-green-800">{stats.totalTickets}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-800" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-800">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-purple-900">₹{stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-amber-800" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-800">Confirmed</h3>
            </div>
            <p className="text-3xl font-bold text-amber-800">{stats.confirmedBookings}</p>
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-12 text-center shadow-inner">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">No one has booked tickets for this event yet. When bookings come in, they'll appear here.</p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
              <div className="flex items-center">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mr-2">
                  <FilterX className="w-4 h-4 mr-1" />
                  Filter
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Attendee
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tickets
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Booking Date
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800">
                          #{booking._id.substring(booking._id.length - 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {booking.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{booking.user.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-800 rounded-full">
                            {booking.ticketCount} {booking.ticketCount === 1 ? 'ticket' : 'tickets'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{booking.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(booking.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">View</button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">Email</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {bookings.length > 10 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">{bookings.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
                          2
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          3
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBookings;