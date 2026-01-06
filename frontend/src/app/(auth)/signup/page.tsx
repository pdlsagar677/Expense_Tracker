// src/components/auth/SignupForm.tsx
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Calendar, LockKeyhole } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Input from "@/components/Input";
import Button from "@/components/Button";

const SignupForm = () => {
  const router = useRouter();
  const { signup, isLoading, error, clearError, clearMessage } = useAuthStore();
  const [message, setLocalMessage] = useState<string>("");

  const [form, setForm] = useState({ 
    name: "", 
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (error) clearError();
    if (message) setLocalMessage("");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Email is invalid";
    if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!/^\d{10}$/.test(form.phoneNumber)) errors.phoneNumber = "Phone number must be 10 digits";
    if (!form.age.trim()) errors.age = "Age is required";
    if (parseInt(form.age) < 1 || parseInt(form.age) > 120) errors.age = "Age must be between 1 and 120";
    if (!form.gender) errors.gender = "Please select gender";
    if (!form.password) errors.password = "Password is required";
    if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return (
      form.name.trim() &&
      form.email.trim() &&
      form.phoneNumber.trim() &&
      form.age.trim() &&
      form.gender &&
      form.password &&
      form.confirmPassword
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  try {
    const response = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      age: form.age,
      gender: form.gender
    });
    
    // Show success message
    setLocalMessage("✅ Signup successful! Redirecting to verification...");
    
    // Redirect to verification page after a short delay
    setTimeout(() => {
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    }, 1500);
    
  } catch (err) {
    // Error is already handled in the auth store
    console.error("Signup error:", err);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Expense Tracker
            </span>
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600">Track your expenses smarter</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <Input
            label="Full Name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            icon={<User size={20} className="text-gray-500" />}
            error={formErrors.name}
            required
          />

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email"
            icon={<Mail size={20} className="text-gray-500" />}
            error={formErrors.email}
            required
          />

          {/* Phone Number Field */}
          <Input
            label="Phone Number"
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit phone number"
            maxLength={10}
            icon={<Phone size={20} className="text-gray-500" />}
            error={formErrors.phoneNumber}
            required
          />

          {/* Age Field */}
          <Input
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="Enter your age"
            min="1"
            max="120"
            icon={<Calendar size={20} className="text-gray-500" />}
            error={formErrors.age}
            required
          />

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["male", "female", "other"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleChange("gender", gender)}
                  className={`py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${
                    form.gender === gender
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
            {formErrors.gender && (
              <p className="mt-2 text-sm text-red-600">
                {formErrors.gender}
              </p>
            )}
          </div>

          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Create a password (min. 6 characters)"
            icon={<Lock size={20} className="text-gray-500" />}
            error={formErrors.password}
            showPasswordToggle={true}
            required
          />

          {/* Confirm Password Field */}
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Confirm your password"
            icon={<LockKeyhole size={20} className="text-gray-500" />}
            error={formErrors.confirmPassword}
            showPasswordToggle={true}
            required
          />

          {/* Error Message from Auth Store */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-center">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!isFormValid() || isLoading}
          >
            Create Account
          </Button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;