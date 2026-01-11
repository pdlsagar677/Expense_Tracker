// lib/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Token Refresh Handling ----
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Subscribe requests while refresh is in progress
const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

// Notify all subscribers after refresh
const onTokenRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// ---- Response Interceptor ----
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            API(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint (backend sets new cookies)
        await API.post("/auth/refresh");

        isRefreshing = false;
        onTokenRefreshed();

        // Small delay to ensure cookies propagate in browser
        await new Promise((res) => setTimeout(res, 50));

        // Retry original request
        return API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onTokenRefreshed();

        // Refresh failed → logout user
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Other errors
    return Promise.reject(error);
  }
);

// Optional: Request interceptor (for adding headers, logging, etc.)
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
