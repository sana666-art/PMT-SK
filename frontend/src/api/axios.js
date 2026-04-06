import axios from "axios";

const API = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// attach token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && !req.url?.includes('auth')) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    'API Request:',
    req.method?.toUpperCase(),
    req.url,
    req.baseURL ? `${req.baseURL}${req.url}` : req.url,
    { auth: !!token }
  );

  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.error('API Error:', err.message, err.response?.status, err.config?.url);
    if (err.response?.status === 401) {
      console.log('401 detected - logging out and redirecting');
      try {
        // Dynamic import to avoid context dependency
        const { logout } = await import('../context/AuthContext.jsx');
        logout();
      } catch (importErr) {
        console.warn('Could not call logout:', importErr);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;