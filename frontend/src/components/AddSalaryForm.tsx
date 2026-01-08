"use client";

import { useState } from "react";
import { useExpenseStore } from "../lib/store/useExpenseStore";
import { DollarSign, Calendar, FileText, CheckCircle, X } from "lucide-react";
import Button from "./Button";
import Input from "./Input";

const AddSalaryForm = () => {
  const [form, setForm] = useState({
    amount: "",
    month: "",
    notes: ""
  });

  const { addSalary, isLoading, message, error, clearError, clearMessage } = useExpenseStore();

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
    if (message) clearMessage();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.amount || !form.month) {
      return;
    }

    await addSalary({
      amount: Number(form.amount),
      month: form.month,
      notes: form.notes
    });

    // Clear form on success
    if (!error) {
      setForm({
        amount: "",
        month: "",
        notes: ""
      });
    }
  };

  const isFormValid = () => {
    return form.amount.trim() && form.month.trim();
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add Monthly Salary</h3>
            <p className="text-sm text-gray-600">Record your monthly income</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-red-100 rounded-full">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-green-700 font-medium">{message}</p>
                <p className="text-sm text-green-600 mt-1">Salary added successfully!</p>
              </div>
            </div>
            <button
              onClick={clearMessage}
              className="text-green-400 hover:text-green-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Salary Amount */}
        <div>
          <Input
            label="Salary Amount"
            type="number"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="Enter salary amount"
            icon={<DollarSign size={18} className="text-gray-500" />}
            required
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-2">Enter the total salary amount before deductions</p>
        </div>

        {/* Month Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              Month
            </div>
          </label>
          <div className="relative">
            <input
              type="month"
              value={form.month}
              onChange={(e) => handleChange("month", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-gray-900 placeholder-gray-500 bg-white"
              required
              max={getCurrentMonth()}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Select the month for this salary</p>
        </div>

        {/* Notes */}
        <div>
          <Input
            label="Notes"
            type="text"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any notes about this salary"
            icon={<FileText size={18} className="text-gray-500" />}
          />
          <p className="text-xs text-gray-500 mt-2">Optional: Bonus details, deductions, or other notes</p>
        </div>

      

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={!isFormValid() || isLoading}
            className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent " />
                Saving Salary...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <DollarSign size={18} />
                Save Salary
              </span>
            )}
          </Button>
        </div>

       
      </form>

     
    </div>
  );
};

export default AddSalaryForm;