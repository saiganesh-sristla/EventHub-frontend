import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user)
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'border-b-2 border-white' : '';
  };

  return (
    <header className="bg-blue-900 shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-xl text-white tracking-tight">EventHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4 mr-6">
              <Link to="/" className={`text-white hover:text-gray-200 px-3 py-2 rounded-md font-medium transition duration-200 ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/dashboard" className={`text-white hover:text-gray-200 px-3 py-2 rounded-md font-medium transition duration-200 ${isActive('/events')}`}>
                Dashboard
              </Link>
              {user?.role == "attendee" && (
                <Link to="/bookings/my-bookings" className={`text-white hover:text-gray-200 px-3 py-2 rounded-md font-medium transition duration-200 ${isActive('/my-bookings')}`}>
                  My Bookings
                </Link>
              )}
              {user?.role == "organizer" && (
                <Link to="/organizer/events/new" className={`text-white hover:text-gray-200 px-3 py-2 rounded-md font-medium transition duration-200 ${isActive('/my-bookings')}`}>
                  Create Event
                </Link>
              )}
              
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center text-white hover:text-gray-200 rounded-md p-2 transition duration-200">
                    <div className="mr-2">
                      <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                    <div className="py-1">
                    <div className="font-semibold block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200">
                        {user.role}
                      </div>
                      <button 
                        onClick={logout}
                        className="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-100 transition duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-white hover:text-gray-200 px-3 py-2 rounded-md font-medium transition duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-900 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition duration-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-800">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          {user && (
            <Link 
              to="/bookings/my-bookings" 
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Bookings
            </Link>
          )}
          <Link 
            to="/contact" 
            className="block px-3 py-2 rounded-md text-white font-medium hover:bg-blue-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {user ? (
            <>
              <div className="border-t border-blue-700 pt-2">
                <div className="px-3 py-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-2">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-white font-medium hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-blue-700 pt-2 flex space-x-2 px-3">
              <Link 
                to="/login" 
                className="flex-1 px-3 py-2 text-center rounded-md text-white font-medium border border-white hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="flex-1 px-3 py-2 text-center rounded-md bg-white text-blue-900 font-medium hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;