"use client";

import React from "react";
import { FileText, AlertCircle, Scale, BookOpen, Shield } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-6">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Effective Date: December 2023
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          
          <div className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  By using ExpenseTracker, you agree to these Terms of Service. Please read them carefully.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By accessing or using ExpenseTracker, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              2. Service Description
            </h2>
            <p className="text-gray-700 mb-3">
              ExpenseTracker is a personal finance management tool that allows you to:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700">
              <li>• Track income and expenses</li>
              <li>• Monitor financial goals</li>
              <li>• Generate spending insights</li>
              <li>• Manage budgets and savings</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              3. User Responsibilities
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Accurate Information</h4>
                <p className="text-sm text-gray-600">
                  You must provide accurate and complete information when using our service.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account Security</h4>
                <p className="text-sm text-gray-600">
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Proper Use</h4>
                <p className="text-sm text-gray-600">
                  You agree not to misuse the service or attempt to access other users' data.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Limitations of Liability
            </h2>
            <p className="text-gray-700 mb-3">
              ExpenseTracker is provided "as is" without warranties of any kind. We are not responsible for:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700">
              <li>• Financial decisions made based on our service</li>
              <li>• Data loss or corruption</li>
              <li>• Service interruptions or downtime</li>
              <li>• Accuracy of financial calculations</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Termination
            </h2>
            <p className="text-gray-700">
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Changes to Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Effective Date" at the top of this page.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800">
              If you have any questions about these Terms of Service, please contact us at 
              <span className="font-medium"> support@expensetracker.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;