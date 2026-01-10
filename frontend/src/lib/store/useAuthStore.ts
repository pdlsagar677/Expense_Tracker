import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "@/lib/services/api";
import { useExpenseStore } from "./useExpenseStore";

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
interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  age?: number;
  gender?: string;
}
interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  hasCheckedAuth: boolean;

  signup: (data: SignupData) => Promise<any>;
  login: (email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;

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
      hasCheckedAuth: false,

      signup: async (signupData) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data } = await API.post("/auth/signup", signupData);
          set({
            isLoading: false,
            user: data.user,
            message: data.message || "Signup successful! Verify your email.",
            isAuthenticated: false,
            hasCheckedAuth: true,
          });
          return data;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "Signup failed.",
            hasCheckedAuth: true,
          });
          throw err;
        }
      },

      verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/verify-email", { code });
          set({
            isLoading: false,
            isAuthenticated: true,
            user: data.user,
            message: data.message || "Email verified successfully!",
            hasCheckedAuth: true,
          });
          return data;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "Email verification failed",
            hasCheckedAuth: true,
          });
          throw err;
        }
      },

      resendVerification: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/resend-verification", { email });
          set({
            isLoading: false,
            message: data.message || "Verification code sent!",
            hasCheckedAuth: true,
          });
          return data;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "Failed to resend verification code",
            hasCheckedAuth: true,
          });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/login", { email, password });
          set({
            isLoading: false,
            isAuthenticated: true,
            user: data.user,
            message: data.message,
            hasCheckedAuth: true,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "Login failed",
            hasCheckedAuth: true,
          });
          throw err;
        }
      },

      checkAuth: async () => {
        const state = get();
        if (state.isCheckingAuth || state.hasCheckedAuth) return;

        set({ isCheckingAuth: true, error: null });
        try {
          const { data } = await API.get("/auth/check-auth");
          set({
            isAuthenticated: !!data.user,
            user: data.user || null,
            isCheckingAuth: false,
            hasCheckedAuth: true,
          });
        } catch {
          set({
            isAuthenticated: false,
            user: null,
            isCheckingAuth: false,
            hasCheckedAuth: true,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await API.post("/auth/logout", {}, { withCredentials: true });

          // CLEAR frontend caches
          const expenseStore = useExpenseStore.getState();
          expenseStore.clearCache();
          localStorage.removeItem("expense-storage");

          set({
            user: null,
            isAuthenticated: false,
            message: "Logged out successfully",
            isLoading: false,
            hasCheckedAuth: true,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || "Logout failed",
            hasCheckedAuth: true,
          });
        }
      },
 

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/forgot-password", { email });
          set({
            isLoading: false,
            message: data.message || "Password reset email sent!",
            hasCheckedAuth: true,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "Failed to send reset email",
            hasCheckedAuth: true,
          });
          throw err;
        }
      },
      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/auth/profile");
          set({ user: data.user, isLoading: false });
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to load profile" });
          throw err;
        }
      },

        // UPDATE PROFILE
      updateProfile: async (updateData: UpdateProfileData) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data } = await API.put("/auth/profile", updateData);
          set({
            user: data.user,
            isLoading: false,
            message: data.message || "Profile updated successfully"
          });
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to update profile" });
          throw err;
        }
      },
 // CHANGE PASSWORD
      changePassword: async (data: ChangePasswordData) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data: response } = await API.put("/auth/change-password", data);
          set({
            isLoading: false,
            message: response.message || "Password changed successfully"
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || "Failed to change password"
          });
          throw err;
        }
      },
      

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post(`/auth/reset-password/${token}`, { password });
          set({
            isLoading: false,
            message: data.message || "Password reset successfully!",
            hasCheckedAuth: true,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "Password reset failed",
            hasCheckedAuth: true,
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
      clearMessage: () => set({ message: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasCheckedAuth: state.hasCheckedAuth,
      }),
    }
  )
);
