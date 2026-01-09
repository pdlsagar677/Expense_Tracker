"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, 
  Tag, 
  FileText,
  AlertCircle
} from "lucide-react";
import Button from "@/components/Button";
import { useExpenseStore } from "@/lib/store/useExpenseStore";

export default function AddExpensePage() {
  const router = useRouter();
  const { addExpense, isLoading, error, clearError, salary } = useExpenseStore();
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
      if (error) clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    // Check if enough remaining salary
    const remainingSalary = salary?.remainingSalary || 0;
    if (amount > remainingSalary) {
      alert(`Not enough remaining salary! You have ${remainingSalary.toFixed(2)} available.`);
      return;
    }

    try {
      await addExpense({
        title: formData.title,
        amount: amount,
        notes: formData.notes || undefined
      });
      
      // Reset form on success
      setFormData({
        title: "",
        amount: "",
        notes: ""
      });
      
      // Optionally redirect or show success message
      // router.push("/dashboard");
    } catch (err) {
      // Error already handled in store
    }
  };

  const remainingSalary = salary?.remainingSalary || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Expense</h2>
        <p className="text-gray-600">Record your spending and track remaining balance</p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(remainingSalary)}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${
            remainingSalary > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className="font-medium">
              {remainingSalary > 0 ? 'Available' : 'No Balance'}
            </span>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                Expense Title
              </div>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Groceries, Rent, Transportation"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={16} />
                Amount
              </div>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
            {formData.amount && remainingSalary > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Remaining after expense:{" "}
                <span className={`font-medium ${
                  (remainingSalary - parseFloat(formData.amount)) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(remainingSalary - parseFloat(formData.amount))}
                </span>
              </p>
            )}
          </div>

          {/* Notes Field */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                Notes (Optional)
              </div>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional details about this expense..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={!formData.title || !formData.amount || isLoading || parseFloat(formData.amount) <= 0}
              className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? "Adding Expense..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}