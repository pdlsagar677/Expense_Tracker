"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Mail, ArrowLeft, Clock } from "lucide-react";
import Button from "@/components/Button";

// Create a separate component that uses useSearchParams
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { verifyEmail, resendVerification, isLoading, error, clearError, user } = useAuthStore();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Redirect if already verified
  useEffect(() => {
    if (user?.isVerified) router.push("/dashboard");
  }, [user, router]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    if (newCode.every(d => d !== "") && index === 5) setTimeout(handleSubmit, 100);
    if (error) clearError();
    if (message) setMessage("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    } else if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    else if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      const newCode = [...code];
      digits.forEach((digit, i) => (newCode[i] = digit));
      setCode(newCode);
      setTimeout(() => inputRefs.current[5]?.focus(), 10);
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setMessage("Please enter all 6 digits");
      return;
    }

    try {
      await verifyEmail(verificationCode);
      setMessage("✅ Email verified! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setMessage("");
    clearError();

    try {
      const userEmail = email || user?.email || "";
      if (!userEmail) {
        setMessage("Email not found. Please sign up again.");
        return;
      }

      await resendVerification(userEmail);
      setMessage("New verification code sent to your email!");
      setResendCooldown(60);
    } catch (err) {
      console.error("Resend error:", err);
      setMessage("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <button
            onClick={() => router.push("/signup")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Signup
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Email</h1>
            <p className="text-gray-600 mb-1">We sent a 6-digit code to</p>
            <p className="text-base font-semibold text-blue-600 mb-4 break-all">{email || user?.email || "your email"}</p>
            <p className="text-sm text-gray-500">Enter the code below to complete your registration</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Verification Code</label>
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isResending}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Clock size={14} />
                    Resend in {resendCooldown}s
                  </>
                ) : (
                  "Didn't receive the code? Resend"
                )}
              </button>
            </div>
          </div>

          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center mb-4 border border-red-100">{error}</div>}
          {message && (
            <div className={`p-3 rounded-lg text-sm text-center mb-4 border ${
              message.includes("✅")
                ? "bg-green-50 text-green-600 border-green-100"
                : message.includes("New verification")
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : message.includes("Failed")
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-yellow-50 text-yellow-600 border-yellow-100"
            }`}>
              {message}
            </div>
          )}

          <div className="mb-6">
            <Button
              onClick={handleSubmit}
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={code.join("").length !== 6 || isLoading}
              className="py-3"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">Check your spam folder if you can't find the email</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            Need help?{" "}
            <a href="mailto:support@expensetracker.com" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification page...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}