"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  ShieldAlert,
  AlertCircle,
  CheckCircle 
} from "lucide-react";

export default function DeleteAccount() {
  const router = useRouter();
  const { deleteAccount, message, error, isLoading, clearError, clearMessage } = useAuthStore();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      clearMessage();
      // You might want to show an error here
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(password);
      // Don't redirect immediately, let user see success message
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (e) {
      // Error is handled by store
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldAlert className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delete Account</h1>
              <p className="text-gray-600 mt-1">Permanently remove your account and all data</p>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Warning: This action is irreversible</h3>
                <ul className="text-red-700 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Trash2 size={14} className="mt-0.5 flex-shrink-0" />
                    <span>All your salary records will be deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trash2 size={14} className="mt-0.5 flex-shrink-0" />
                    <span>All your expense history will be removed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trash2 size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Your profile information will be permanently erased</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>This action cannot be undone</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  placeholder="Enter your current password"
                  className="w-full pl-10 pr-10 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-gray-900"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You must enter your current password to delete your account
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 ml-auto"
                >
                  ×
                </button>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-green-700">{message}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                isLoading || !password
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-300 transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Trash2 size={20} />
                  <span>Delete Account</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Changed your mind?{" "}
              <button
                type="button"
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Go back to safety
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Final Confirmation</h3>
                  <p className="text-sm text-gray-600 mt-1">Are you absolutely sure?</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  You are about to <span className="font-bold text-red-600">permanently delete</span> your account and all associated data.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-900">This action cannot be undone</p>
                      <p className="text-sm text-amber-700 mt-1">
                        All your financial data will be lost forever. Please make sure you have exported any important information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    By clicking "Confirm Delete", you acknowledge that:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>All data will be permanently erased</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>You will lose access to your account immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>This action is irreversible</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className="flex-1 py-3 px-6 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        input::placeholder {
          color: #9ca3af;
          opacity: 0.8;
        }
        
        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </>
  );
}