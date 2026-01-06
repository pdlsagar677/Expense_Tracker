// src/app/verify-email/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Button from "@/components/Button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const { verifyEmail, resendVerification, isLoading, error, clearError, user } = useAuthStore();
  
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already verified or not signed up
  useEffect(() => {
    if (user?.isVerified) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // If all digits filled, auto-submit
    if (newCode.every(digit => digit !== "") && index === 5) {
      handleSubmit();
    }
    
    if (error) clearError();
    if (message) setMessage("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6);
      const newCode = [...code];
      digits.forEach((digit, index) => {
        newCode[index] = digit;
      });
      setCode(newCode);
      
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      setMessage("Please enter the complete 6-digit code");
      return;
    }
    
    try {
      await verifyEmail(verificationCode);
      setMessage("✅ Email verified successfully! Redirecting...");
      
      // Redirect to dashboard after verification
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    setMessage("");
    clearError();
    
    try {
      const userEmail = email || user?.email || "";
      if (!userEmail) {
        setMessage("❌ Email not found. Please sign up again.");
        return;
      }
      
      await resendVerification(userEmail);
      setMessage("📬 New verification code sent to your email!");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err) {
      console.error("Resend error:", err);
      setMessage("❌ Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={() => router.push("/signup")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Signup
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          
          <p className="text-gray-600 mb-2">
            We sent a 6-digit verification code to
          </p>
          
          <p className="text-lg font-semibold text-blue-600 mb-4">
            {email || user?.email || "your email"}
          </p>
          
          <p className="text-sm text-gray-500">
            Enter the code below to verify your account
          </p>
        </div>

        {/* 6-Digit Code Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Verification Code
          </label>
          
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isResending}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? (
                "Sending..."
              ) : resendCooldown > 0 ? (
                `Resend code in ${resendCooldown}s`
              ) : (
                "Didn't receive code? Resend"
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-center mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className={`p-4 rounded-lg text-center mb-4 ${
            message.includes("✅") 
              ? "bg-green-50 text-green-700 border border-green-200"
              : message.includes("📬")
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : message.includes("❌")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }`}>
            {message}
          </div>
        )}

        {/* Verify Button */}
        <Button
          onClick={handleSubmit}
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={code.join("").length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Check your spam folder if you don't see the email
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
              <span className="text-xs mt-2 font-medium">Signup</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-300"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                2
              </div>
              <span className="text-xs mt-2 font-medium">Verify</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-300"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                3
              </div>
              <span className="text-xs mt-2 text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}