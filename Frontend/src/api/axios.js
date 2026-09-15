import axios from 'axios';

export default axios.create({
  baseURL: 'https://hospital-finance-management.onrender.com',
  withCredentials: true, // sabhi requests pe cookie automatically bhejega
});