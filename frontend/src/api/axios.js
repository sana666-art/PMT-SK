import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// attach token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token && !req.url.includes('/auth/register') && !req.url.includes('/auth/login')) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', req.method?.toUpperCase(), req.url, { auth: !!token });
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.message, err.response?.status, err.config?.url);
    return Promise.reject(err);
  }
);

export default API;