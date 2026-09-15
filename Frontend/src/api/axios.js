import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // sabhi requests pe cookie automatically bhejega
});