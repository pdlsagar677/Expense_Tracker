"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  Tag, 
  FileText,
  AlertCircle,
  Plus,
  Calendar,
  Receipt,
  X
} from "lucide-react";
import Button from "@/components/Button";
import { useExpenseStore } from "@/lib/store/useExpenseStore";

export default function ExpensesPage() {
  const { 
    addExpense, 
    getAllExpenses, 
    getCurrentSalary,
    isLoading, 
    error, 
    clearError, 
    salary,
    allExpenses,      
    totalExpenses     
  } = useExpenseStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    notes: ""
  });

  // Load both salary and expenses on mount
  useEffect(() => {
    const loadData = async () => {
      await getCurrentSalary();
      await getAllExpenses();
    };
    loadData();
  }, []); // Remove getAllExpenses from dependency array

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
      
      // Reset form and close it
      setFormData({
        title: "",
        amount: "",
        notes: ""
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "N/A";
    }
  };

  const remainingSalary = salary?.remainingSalary || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Expenses Management</h2>
        <p className="text-gray-600">Track and manage all your expenses in one place</p>
      </div>

      {/* Current Balance & Add Button */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(remainingSalary)}
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

        {/* Add Expense Button */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 flex flex-col justify-center">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "primary"}
            fullWidth
            className="gap-2 py-3"
          >
            {showAddForm ? (
              <>
                <X size={18} />
                Cancel Add
              </>
            ) : (
              <>
                <Plus size={18} />
                Add New Expense
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add Expense Form */}
{showAddForm && (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Expense</h3>
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

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
          onChange={handleFormChange}
          placeholder="e.g., Groceries, Rent, Transportation"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
          required
        />
      </div>

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
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
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
              {formatCurrency(remainingSalary - parseFloat(formData.amount))}
            </span>
          </p>
        )}
      </div>

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
          onChange={handleFormChange}
          placeholder="Add any additional details about this expense..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 placeholder:text-gray-400"
        />
      </div>

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
)}

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Expenses</h3>
            <p className="text-sm text-gray-500">
              Total spent: <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {allExpenses.length} expense{allExpenses.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading expenses...</p>
          </div>
        ) : allExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses recorded</h3>
            <p className="text-gray-600 mb-6">Start by adding your first expense.</p>
           
          </div>
        ) : (
          <div className="space-y-4">
            {allExpenses.map((expense, index) => (
              <div 
                key={expense._id || index} 
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{expense.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          {formatDate(expense.date)}
                        </div>
                        {expense.notes && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FileText size={14} />
                            {expense.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                    {expense._id && (
                      <p className="text-xs text-gray-500">
                        ID: {expense._id.slice(-6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}