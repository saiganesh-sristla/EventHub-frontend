// client/src/services/bookingService.js
import axios from 'axios';

const API_URL = 'https://eventhub-backend-krle.onrender.com/api/bookings';

// Create auth header
const getConfig = () => {
  const {token} = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Create booking
export const createBooking = async (bookingData) => {
  const response = await axios.post(API_URL, bookingData, getConfig());
  return response.data;
};

// Get user bookings
export const getUserBookings = async () => {
  const response = await axios.get(`${API_URL}/my-bookings`, getConfig());
  return response.data;
};

export const getEventBookings = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`, getConfig());
  return response.data;
};

// Confirm booking
export const confirmBooking = async (bookingId) => {
  const response = await axios.put(`${API_URL}/confirm/${bookingId}`, {}, getConfig());
  return response.data;
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  const response = await axios.put(`${API_URL}/cancel/${bookingId}`, {}, getConfig());
  return response.data;
};