import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Welcome to Event Management System';
  
  useEffect(() => {
    if (isTyping) {
      if (text.length < fullText.length) {
        const timeout = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, 100);
        
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        // Start blinking cursor effect after typing is complete
        const timeout = setTimeout(() => {
          setIsTyping(true);
        }, 2000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [text, isTyping]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 min-h-16">
              {text}
              {/* <span className={`inline-block w-2 bg-white ml-1 ${isTyping && text.length === fullText.length ? 'animate-pulse' : ''}`} style={{ height: '1.2em' }}></span> */}
            </h1>
            <p className="text-xl mb-10 text-blue-100">Find and book amazing events or create your own!</p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/register" 
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-1"
              >
                Join Now
              </a>
              
              <a 
                href="/login" 
                className="bg-transparent hover:bg-blue-800 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-1"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Experience seamless event management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Browse Events</h3>
            <p className="text-gray-600">Discover amazing events happening around you with our powerful search tools.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Events</h3>
            <p className="text-gray-600">Organize and manage your own events with our intuitive creation tools.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Book Tickets</h3>
            <p className="text-gray-600">Secure your spot at your favorite events with our fast booking system.</p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to explore amazing events?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">Join thousands of users who are already enjoying the best events in their area.</p>
          <a 
            href="/register" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition duration-300 shadow-lg"
          >
            Get Started Now
          </a>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-600">&copy; 2025 Event Management System. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/about" className="text-gray-600 hover:text-blue-800">About</a>
              <a href="/contact" className="text-gray-600 hover:text-blue-800">Contact</a>
              <a href="/privacy" className="text-gray-600 hover:text-blue-800">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-blue-800">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;