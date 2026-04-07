import axios from 'axios';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API = axios.create({ baseURL: BASE + '/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = 'Bearer ' + token;
  return req;
});
export default API;
