import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../../services/eventService';

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to check if event has already passed
  const isEventPassed = (eventDate) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to beginning of today
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(0, 0, 0, 0); // Set to beginning of event day
    return eventDateTime < currentDate;
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort events with custom logic for 'date' option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      // Get the passed status for both events
      const isAPassed = isEventPassed(a.date);
      const isBPassed = isEventPassed(b.date);
      
      // If one is passed and one is upcoming, prioritize upcoming
      if (isAPassed && !isBPassed) return 1;
      if (!isAPassed && isBPassed) return -1;
      
      // If both are in the same category (both passed or both upcoming), sort by date
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'price') {
      return a.ticketPrice - b.ticketPrice;
    } else if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Function to get event status
  const getEventStatus = (event) => {
    if (isEventPassed(event.date)) {
      return { text: "Event Ended", class: "bg-gray-300 text-gray-600 cursor-not-allowed" };
    } else if (event.availableTickets <= 0) {
      return { text: "Sold Out", class: "bg-gray-300 text-gray-600 cursor-not-allowed" };
    } else {
      return { text: "Book Now", class: "bg-blue-900 text-white hover:bg-blue-800" };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Count upcoming events
  const upcomingCount = sortedEvents.filter(event => !isEventPassed(event.date)).length;
  const pastCount = sortedEvents.length - upcomingCount;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
            <Link 
              to="/bookings/my-bookings" 
              className="bg-blue-900 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition duration-300 shadow-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              My Bookings
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search events by name, description or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-1/5">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\" fill=\"%236B7280\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
              >
                <option value="date">Upcoming First</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
        
        {sortedEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No events found matching your search.</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                {sortedEvents.length} events found 
                {upcomingCount > 0 && pastCount > 0 && ` (${upcomingCount} upcoming, ${pastCount} past)`}
              </p>
              {pastCount > 0 && upcomingCount > 0 && (
                <button 
                  onClick={() => setSortBy('date')}
                  className="text-blue-900 hover:text-blue-700 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Show upcoming first
                </button>
              )}
            </div>

            {upcomingCount > 0 && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {sortedEvents.map((event, index) => {
                const eventStatus = getEventStatus(event);
                const isPast = isEventPassed(event.date);
                
                // Skip past events in the first section
                if (isPast && upcomingCount > 0) return null;
                
                return (
                  <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl transform hover:-translate-y-1">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={event.imageUrl || 'https://via.placeholder.com/400x200'} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                      {event.category && (
                        <span className="absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full bg-blue-900 text-white shadow-md">
                          {event.category}
                        </span>
                      )}
                      {isPast && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="px-4 py-2 bg-gray-800 text-white rounded-md font-semibold">Past Event</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h2>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {isPast && <span className="ml-2 text-red-500">(Past)</span>}
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ₹{event.ticketPrice.toFixed(2)}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`inline-block w-3 h-3 rounded-full mr-1 ${
                            isPast ? 'bg-gray-500' : 
                            event.availableTickets > 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className="text-sm text-gray-500">
                            {isPast ? 'Event has ended' : 
                             `${event.availableTickets} of ${event.totalTickets} tickets left`}
                          </span>
                        </div>
                        
                        <Link 
                          to={isPast ? '#' : `/events/${event._id}`}
                          onClick={(e) => isPast && e.preventDefault()}
                          className={`px-5 py-2 rounded-md shadow transition duration-300 ${eventStatus.class}`}
                        >
                          {eventStatus.text}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pastCount > 0 && upcomingCount > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedEvents.map(event => {
                    const eventStatus = getEventStatus(event);
                    const isPast = isEventPassed(event.date);
                    
                    // Only show past events in this section
                    if (!isPast) return null;
                    
                    return (
                      <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl transform hover:-translate-y-1 opacity-80">
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={event.imageUrl || 'https://via.placeholder.com/400x200'} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                          {event.category && (
                            <span className="absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full bg-blue-900 text-white shadow-md">
                              {event.category}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="px-4 py-2 bg-gray-800 text-white rounded-md font-semibold">Past Event</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h2>
                          <div className="flex items-center text-gray-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            <span className="ml-2 text-red-500">(Past)</span>
                          </div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                          <div className="flex items-center text-gray-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ₹{event.ticketPrice.toFixed(2)}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="inline-block w-3 h-3 rounded-full mr-1 bg-gray-500"></span>
                              <span className="text-sm text-gray-500">Event has ended</span>
                            </div>
                            
                            <Link 
                              to="#"
                              onClick={(e) => e.preventDefault()}
                              className="px-5 py-2 rounded-md shadow transition duration-300 bg-gray-300 text-gray-600 cursor-not-allowed"
                            >
                              Event Ended
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsDashboard;