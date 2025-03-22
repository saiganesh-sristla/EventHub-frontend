import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import OrganizerDashboard from '../../components/dashboard/OrganizerDashboard';
import EventsDashboard from '../../components/dashboard/EventsDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  const renderDashboardContent = () => {
    switch(user?.role) {
      case 'admin':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
            <p>Welcome to the admin dashboard. Here you can manage users and events.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border p-4 rounded">
                <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                <p>View and manage all system users.</p>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  View Users
                </button>
              </div>
              
              <div className="border p-4 rounded">
                <h3 className="text-xl font-semibold mb-2">Manage Events</h3>
                <p>View and manage all events.</p>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  View Events
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'organizer':
        return (
          <div>
            <OrganizerDashboard/>
          </div>
        );
      
      case 'attendee':
      default:
        return (
          <div>
            <EventsDashboard/>
          </div>
        );
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;