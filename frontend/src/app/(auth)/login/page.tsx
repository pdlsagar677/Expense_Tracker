// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated, checkAuth } = useAuthStore();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
    if (message) setMessage("");
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setMessage("Email is required");
      return false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setMessage("Please enter a valid email address");
      return false;
    }
    
    if (!form.password) {
      setMessage("Password is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(form.email, form.password);
      setMessage("✅ Login successful! Redirecting...");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const isFormValid = () => {
    return form.email.trim() && form.password;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Expense Tracker
              </span>
            </h1>
            <p className="text-gray-600">Welcome back! Sign in to your account</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
                icon={<Mail size={18} className="text-gray-500" />}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter your password"
                  icon={<Lock size={18} className="text-gray-500" />}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex justify-end mt-2">
             
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm text-center border ${
                message.includes("✅") 
                  ? "bg-green-50 text-green-600 border-green-100"
                  : "bg-yellow-50 text-yellow-600 border-yellow-100"
              }`}>
                {message}
              </div>
            )}

            {/* Login Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={!isFormValid() || isLoading}
                className="py-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Sign In
                  </span>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div>
              <Link href="/signup">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  className="py-3 border-gray-300 hover:border-blue-500"
                  disabled={isLoading}
                >
                  Create new account
                </Button>
              </Link>
            </div>
          </form>

          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}