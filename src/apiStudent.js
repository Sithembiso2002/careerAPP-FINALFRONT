// frontend/src/apiStudent.js
import axios from 'axios';

const APIStudent = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/student/auth'
});

APIStudent.interceptors.request.use((config) => {
  const token = localStorage.getItem('studentToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default APIStudent;
