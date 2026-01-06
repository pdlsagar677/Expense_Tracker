import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ;

const API: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Response interceptor (optional)
 */
API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // cookie expired or invalid
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
