import axios from "axios";

// In the browser (dev server) we use the "/api" proxy defined in vite.config.js.
// Inside the mobile app (Capacitor) there is no dev-server proxy, so it must
// call your deployed backend's full URL — set VITE_API_URL in frontend/.env
const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hisabai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("hisabai_token");
      localStorage.removeItem("hisabai_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
