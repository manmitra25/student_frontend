import axios from "axios";

const API = axios.create({
   baseURL: `${import.meta.env.VITE_API_URL}/api`, // match backend API prefix
  withCredentials: true, // include cookies for session-based endpoints (e.g., /api/chat/*)
});

API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    // Optional: auto-logout or surface 401s centrally
    if (error?.response?.status === 401) {
      // Example: remove invalid token; caller can redirect
      // localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;
