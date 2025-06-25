import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';

const EventForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: '',
    ticketPrice: '',
    totalTickets: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState('');
  
  useEffect(() => {
    // Set minimum date as today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() === '' ? 'Event title is required' : '';
      case 'description':
        return value.trim() === '' ? 'Description is required' : 
               value.length < 20 ? 'Description must be at least 20 characters' : '';
      case 'date':
        if (value === '') return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today ? 'Cannot select a past date' : '';
      case 'time':
        return value === '' ? 'Time is required' : '';
      case 'location':
        return value.trim() === '' ? 'Location is required' : '';
      case 'ticketPrice':
        return value === '' ? 'Ticket price is required' : 
               isNaN(parseFloat(value)) || parseFloat(value) < 0 ? 'Must be a positive number' : '';
      case 'totalTickets':
        return value === '' ? 'Total tickets is required' : 
               isNaN(parseInt(value)) || parseInt(value) < 1 ? 'Must be at least 1 ticket' : '';
      case 'imageUrl':
        if (value.trim() === '') return '';
        const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
        return !urlPattern.test(value) ? 'Please enter a valid URL' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate the field and update errors
    const errorMessage = validateField(name, value);
    setErrors({
      ...errors,
      [name]: errorMessage
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const errorMessage = validateField(key, formData[key]);
      if (errorMessage) {
        newErrors[key] = errorMessage;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await createEvent({
        ...formData,
        ticketPrice: parseFloat(formData.ticketPrice),
        totalTickets: parseInt(formData.totalTickets)
      });
      navigate('/organizer/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({
        form: 'Failed to create event. Please try again.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Event</h1>
      
      {errors.form && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter event title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter event location"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={minDate}
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Price ($)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.ticketPrice ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
            />
            {errors.ticketPrice && <p className="mt-1 text-sm text-red-600">{errors.ticketPrice}</p>}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Tickets<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="1"
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.totalTickets ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="100"
            />
            {errors.totalTickets && <p className="mt-1 text-sm text-red-600">{errors.totalTickets}</p>}
          </div>
          
          <div className="md:col-span-2 form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
            <p className="mt-1 text-xs text-gray-500">Leave blank to use default event image</p>
          </div>
          
          <div className="md:col-span-2 form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full border rounded-md shadow-sm p-2.5 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Provide details about your event"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/organizer/events')}
            className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;