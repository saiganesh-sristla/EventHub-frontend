import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { createBooking } from '../../services/bookingService';
import { AuthContext } from '../../contexts/AuthContext';
import PaymentForm from '../bookings/PaymentForm';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Could not load event details.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    // if (!isAuthenticated) {
    //   navigate('/login', { state: { from: `/events/${id}` } });
    //   return;
    // }
    
    try {
      const createdBooking = await createBooking({
        eventId: event._id,
        ticketCount
      });
      setBooking(createdBooking);
      setShowPayment(true);
      
      // Smooth scroll to payment form
      setTimeout(() => {
        document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to book tickets. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-blue-800 rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-800 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded shadow-md max-w-lg">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded transition duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="bg-gray-50 border-l-4 border-gray-500 text-gray-700 p-6 rounded shadow-md max-w-lg">
          <p className="font-medium">Event not found.</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center text-blue-800 hover:text-blue-600 font-medium transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Events
        </button>
        
        {/* Main content */}
        <div className="bg-white rounded-xl overflow-hidden shadow-xl">
          <div className="relative">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-2/3 px-4">
                {/* Event details */}
                <div className="flex flex-wrap mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{event.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Tickets Available</p>
                        <p className="font-medium">{event.availableTickets}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Event</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{event.description}</p>
                  </div>
                </div>
                
                {/* Additional details could go here */}
              </div>
              
              <div className="w-full lg:w-1/3 px-4">
                <div className="sticky top-6">
                  <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md">
                    <div className="bg-blue-800 text-white p-6">
                      <h3 className="text-xl font-bold mb-1">Tickets</h3>
                      <p className="text-3xl font-bold">₹{event.ticketPrice.toFixed(2)}</p>
                      <p className="text-sm opacity-80">per ticket</p>
                    </div>
                    
                    <div className="p-6">
                      {event.availableTickets > 0 ? (
                        <>
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Number of tickets
                            </label>
                            <select
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-800 focus:border-blue-800 transition duration-200"
                              value={ticketCount}
                              onChange={(e) => setTicketCount(parseInt(e.target.value))}
                            >
                              {[...Array(Math.min(10, event.availableTickets)).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="mb-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">Price ({ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'})</span>
                              <span>₹{(event.ticketPrice * ticketCount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                              <span>Total</span>
                              <span>₹{(event.ticketPrice * ticketCount).toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleBooking}
                            className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-900 transition duration-200 flex items-center justify-center"
                          >
                            <span>Book Now</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="font-medium">Sold Out</p>
                          </div>
                          <p className="mt-2 text-sm">
                            Sign up for notifications when more tickets become available.
                          </p>
                          <button className="mt-3 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200 font-medium">
                            Notify Me
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment section */}
        {showPayment && booking && (
          <div id="payment-section" className="mt-8 bg-white rounded-xl shadow-xl p-8 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Booking</h2>
            <PaymentForm booking={booking} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;