"use client";

import { Shield, Lock, Eye, CheckCircle, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-6">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last Updated: December 2023
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          
        <div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Lock className="w-5 h-5 text-blue-600" />
    1. Information We Collect
  </h2>
  <p className="text-gray-800 mb-4">
    We collect information you provide directly to us when you use ExpenseTracker:
  </p>
  <ul className="list-none ml-0 space-y-3">
    <li className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
      <span className="text-gray-800 leading-relaxed">
        Account information (email, name)
      </span>
    </li>
    <li className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
      <span className="text-gray-800 leading-relaxed">
        Financial data (salary, expenses, transactions)
      </span>
    </li>
    <li className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
      <span className="text-gray-800 leading-relaxed">
        Usage data and preferences
      </span>
    </li>
  </ul>
</div>

        <div className="mb-8">
  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Eye className="w-5 h-5 text-blue-600" />
    2. How We Use Your Information
  </h2>
  <p className="text-gray-700 mb-3">
    We use the information we collect to:
  </p>
  <ul className="list-disc list-inside space-y-2 ml-6 text-gray-700">
    <li>Provide, maintain, and improve our services</li>
    <li>Process your transactions and manage your expenses</li>
    <li>Send you important updates and notifications</li>
    <li>Protect against fraud and abuse</li>
  </ul>
</div>


          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              3. Data Security
            </h2>
            <p className="text-gray-700">
              We implement security measures designed to protect your information:
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Encryption</h4>
                <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Access Control</h4>
                <p className="text-sm text-gray-600">Strict access controls and authentication</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              4. Contact Us
            </h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              <span className="font-medium text-blue-600">privacy@expensetracker.com</span>
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Important Note</h3>
            <p className="text-sm text-gray-600">
              We never sell your personal or financial data to third parties. Your data is used solely 
              to provide you with the ExpenseTracker service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;