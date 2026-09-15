import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://hospital-finance-management.onrender.com',
});

// Har request ke saath localStorage se token nikaal ke Authorization header mein daalo
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;