// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/LoginForm';
import Register from './components/auth/RegisterForm';

// Event Components
import EventList from './components/events/EventList';
import EventDetail from './components/events/EventDetail';
import EventForm from './components/events/EventForm';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard';

// Booking Components
import MyBookings from './components/bookings/MyBookings';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/Home';
import EventBookings from './pages/EventBookings';

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = React.useContext(AuthContext);
  
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return element;
};

function App() {
  return (
      <Router>
    <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route
                path="/organizer/events"
                element={<ProtectedRoute element={<OrganizerDashboard />} requiredRole="organizer" />}
              />
              <Route
                path="/organizer/events/new"
                element={<ProtectedRoute element={<EventForm />} requiredRole="organizer" />}
              />
              <Route
                path="/bookings/my-bookings"
                element={<ProtectedRoute element={<MyBookings />} requiredRole={null} />}
              />
              <Route
                path="/bookings/:eventId"
                element={<ProtectedRoute element={<EventBookings />} requiredRole={null} />}
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
    </AuthProvider>
      </Router>
  );
}

export default App;