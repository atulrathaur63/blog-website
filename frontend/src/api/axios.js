import axios from "axios";

/**
 * Axios instance pre-configured for the blog API.
 * Automatically attaches the JWT token from localStorage.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── Request Interceptor: attach auth token ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("blogAdminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token and reload to trigger login redirect
      localStorage.removeItem("blogAdminToken");
      localStorage.removeItem("blogAdminUser");
      // Only redirect if on a protected page
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
