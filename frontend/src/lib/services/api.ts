// lib/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify all subscribers when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If this is the refresh endpoint itself failing, don't retry
      if (originalRequest.url?.includes('/auth/refresh')) {
        isRefreshing = false;
        // Clear auth state - user needs to log in again
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Try to refresh the token
          await API.post('/auth/refresh');
          
          isRefreshing = false;
          onTokenRefreshed('refreshed');

          // Retry the original request
          return API(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          
          // Refresh failed - clear auth and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      } else {
        // If already refreshing, wait for it to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(API(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

// Request interceptor (optional - for debugging)
API.interceptors.request.use(
  (config) => {
    // You can add additional headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;