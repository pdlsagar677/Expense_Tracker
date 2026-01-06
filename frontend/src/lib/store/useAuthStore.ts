// lib/store/useAuthStore.ts
import { create } from "zustand";
import API from "@/lib/services/api"; 

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  age: string;
  gender: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  message: string | null;

  signup: (signupData: SignupData) => Promise<any>; // Changed return type
  login: (email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>; // Added
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  clearMessage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  message: null,

  signup: async (signupData: SignupData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      console.log("📤 Sending signup request with data:", signupData);
      
      const { data } = await API.post("/auth/signup", signupData);
      
      console.log("✅ Signup successful, response:", data);
      
      set({ 
        isLoading: false, 
        user: data.user,
        message: data.message || "Signup successful! Please verify your email.",
        isAuthenticated: false 
      });
      
      return data; 
      
    } catch (err: any) {
      console.error("❌ Signup failed with error:", err);
      
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "Signup failed. Please try again.";
      
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      
      throw err;
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/auth/verify-email", { code });
      set({ 
        isLoading: false, 
        isAuthenticated: true, 
        user: data.user,
        message: data.message || "Email verified successfully!"
      });
      return data; // Return data for potential use
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || "Email verification failed" 
      });
      throw err;
    }
  },

  // Add this function for resending verification code
  resendVerification: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/auth/resend-verification", { email });
      set({ 
        isLoading: false, 
        message: data.message || "New verification code sent to your email!"
      });
      return data;
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || "Failed to resend verification code" 
      });
      throw err;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/auth/login", { email, password });
      set({ 
        isLoading: false, 
        isAuthenticated: true, 
        user: data.user,
        message: data.message
      });
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || "Login failed" 
      });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const { data } = await API.get("/auth/check-auth");
      if (data.user) {
        set({ 
          isAuthenticated: true, 
          user: data.user, 
          isCheckingAuth: false 
        });
      } else {
        set({ 
          isAuthenticated: false, 
          user: null, 
          isCheckingAuth: false 
        });
      }
    } catch (err) {
      set({ 
        isAuthenticated: false, 
        user: null, 
        isCheckingAuth: false 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await API.post("/auth/logout");
      set({ 
        isLoading: false, 
        isAuthenticated: false, 
        user: null,
        message: "Logged out successfully"
      });
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || "Logout failed" 
      });
      throw err;
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      set({ 
        isLoading: false, 
        message: data.message || "Password reset email sent successfully!"
      });
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || "Failed to send reset email" 
      });
      throw err;
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, { password });
      set({ 
        isLoading: false, 
        message: data.message || "Password reset successfully!"
      });
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || "Password reset failed" 
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
}));