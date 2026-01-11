"use client";

import Link from "next/link";
import { Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-20 h-20 text-red-500" />
          </div>
          <div className="absolute -top-2 -right-2 bg-white px-4 py-2 rounded-full shadow-md">
            <span className="text-3xl font-bold text-gray-900">404</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="inline-block mr-2 w-5 h-5" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all"
          >
            Go Back
          </button>
        </div>

       
      </div>
    </div>
  );
}