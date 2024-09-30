// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const fetchTasks = () => axios.get(`${API_URL}/api/tasks`);

// Update createTask to handle FormData
export const createTask = (formData) => {
  return axios.post(`${API_URL}/projects/tasks`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the Content-Type header
    },
  });
};

export const createUser = (user) => axios.post(`${API_URL}/user`, user);
