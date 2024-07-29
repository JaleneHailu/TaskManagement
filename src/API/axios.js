// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const fetchTasks = () => axios.get(`${API_URL}/api/tasks`);

export const createTask = (task) => axios.post(`${API_URL}/projects/tasks`, task);

export const createUser = (user) => axios.post(`${API_URL}/user`, user);
