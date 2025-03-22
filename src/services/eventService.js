// client/src/services/eventService.js
import axios from 'axios';

const API_URL = 'https://eventhub-backend-krle.onrender.com/api/events';

// Create auth header
const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.token)
  return {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  };
};

// Get all events
export const getAllEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get event by ID
export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create event
export const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData, getConfig());
  return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData, getConfig());
  return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
  return response.data;
};

// Get organizer events
export const getOrganizerEvents = async () => {
  const response = await axios.get(`${API_URL}/organizer/myevents`, getConfig());
  return response.data;
};