// lib/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  hasCheckedAuth: boolean; // Add this to track if auth has been checked

  signup: (signupData: SignupData) => Promise<any>;
  login: (email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  clearMessage: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      message: null,
      hasCheckedAuth: false, // Initialize as false

      signup: async (signupData: SignupData) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data } = await API.post("/auth/signup", signupData);
          
          set({ 
            isLoading: false, 
            user: data.user,
            message: data.message || "Signup successful! Please verify your email.",
            isAuthenticated: false,
            hasCheckedAuth: true
          });
          
          return data; 
          
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 
                              err.response?.data?.error || 
                              err.message || 
                              "Signup failed. Please try again.";
          
          set({ 
            isLoading: false, 
            error: errorMessage,
            hasCheckedAuth: true
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
            message: data.message || "Email verified successfully!",
            hasCheckedAuth: true
          });
          return data;
        } catch (err: any) {
          set({ 
            isLoading: false, 
            error: err.response?.data?.message || err.message || "Email verification failed",
            hasCheckedAuth: true
          });
          throw err;
        }
      },

      resendVerification: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/resend-verification", { email });
          set({ 
            isLoading: false, 
            message: data.message || "New verification code sent to your email!",
            hasCheckedAuth: true
          });
          return data;
        } catch (err: any) {
          set({ 
            isLoading: false, 
            error: err.response?.data?.message || err.message || "Failed to resend verification code",
            hasCheckedAuth: true
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
            message: data.message,
            hasCheckedAuth: true
          });
        } catch (err: any) {
          set({ 
            isLoading: false, 
            error: err.response?.data?.message || err.message || "Login failed",
            hasCheckedAuth: true
          });
          throw err;
        }
      },

      checkAuth: async () => {
        const state = get();
        // Don't check if already checking or already checked
        if (state.isCheckingAuth || state.hasCheckedAuth) {
          return;
        }
        
        set({ isCheckingAuth: true, error: null });
        try {
          const { data } = await API.get("/auth/check-auth");
          if (data.user) {
            set({ 
              isAuthenticated: true, 
              user: data.user, 
              isCheckingAuth: false,
              hasCheckedAuth: true
            });
          } else {
            set({ 
              isAuthenticated: false, 
              user: null, 
              isCheckingAuth: false,
              hasCheckedAuth: true
            });
          }
        } catch (err) {
          set({ 
            isAuthenticated: false, 
            user: null, 
            isCheckingAuth: false,
            hasCheckedAuth: true
          });
        }
      },

     logout: async () => {
  set({ isLoading: true, error: null });

  try {
    await API.post("/auth/logout", {}, { withCredentials: true });

    set({
      user: null,
      isAuthenticated: false,
      message: "Logged out successfully",
      isLoading: false,
      hasCheckedAuth: true  // keep true to allow redirect
    });

  } catch (err: any) {
    set({
      isLoading: false,
      error: err.response?.data?.message || "Logout failed",
      hasCheckedAuth: true
    });
  }
},


      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/forgot-password", { email });
          set({ 
            isLoading: false, 
            message: data.message || "Password reset email sent successfully!",
            hasCheckedAuth: true
          });
        } catch (err: any) {
          set({ 
            isLoading: false, 
            error: err.response?.data?.message || err.message || "Failed to send reset email",
            hasCheckedAuth: true
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
            message: data.message || "Password reset successfully!",
            hasCheckedAuth: true
          });
        } catch (err: any) {
          set({ 
            isLoading: false, 
            error: err.response?.data?.message || err.message || "Password reset failed",
            hasCheckedAuth: true
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
      clearMessage: () => set({ message: null }),
    }),
    {
      name: "auth-storage", // name of the item in storage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCheckedAuth: state.hasCheckedAuth
      }), // persist only these fields
    }
  )
);