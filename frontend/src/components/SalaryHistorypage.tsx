"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, 
  Calendar,
  ArrowLeft,
  Trash2,
  AlertCircle,
  Plus
} from "lucide-react";
import Button from "@/components/Button";
import { useExpenseStore } from "@/lib/store/useExpenseStore";

export default function SalaryHistory() {
  const router = useRouter();
  const { 
    getSalaryAdditions, // Use this instead of getSalaryHistory
    deleteSalaryAddition, // Use this instead of deleteSalaryMonth
    salaryAdditions, // Use this instead of salaryHistory
    isLoading, 
    error,
    clearError 
  } = useExpenseStore();

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    getSalaryAdditions(); // Fetch individual additions
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return monthStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
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

  const handleDelete = async (additionId: string) => {
    try {
      await deleteSalaryAddition(additionId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting salary addition:", err);
    }
  };

  // Calculate total salary added
  const totalSalary = salaryAdditions.reduce((sum, record) => sum + record.salaryAmount, 0);

  return (
    <div className="space-y-6">
   

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            ×
          </button>
        </div>
      )}

      {/* Total Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Salary Added</h3>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSalary)}</p>
              <p className="text-sm text-gray-600 mt-1">{salaryAdditions.length} addition(s) recorded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Records List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Salary Additions</h3>
            <p className="text-sm text-gray-500">History of individual salary additions</p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading history...</p>
          </div>
        ) : salaryAdditions.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No salary records yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first salary entry.</p>
            
          </div>
        ) : (
          <div className="space-y-3">
            {salaryAdditions.map((record) => (
              <div 
                key={record._id} 
                className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors"
              >
                {deleteConfirm === record._id ? (
                  // Delete Confirmation View
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Delete this salary addition?</p>
                        <p className="text-sm text-red-700">
                          This will permanently delete the {formatCurrency(record.salaryAmount)} salary 
                          addition for {formatMonth(record.month)}. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteConfirm(null)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleDelete(record._id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        <Trash2 size={16} />
                        Delete Permanently
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Normal View
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-gray-900">
                            {formatCurrency(record.salaryAmount)}
                          </h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Salary Addition
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatMonth(record.month)}
                          </div>
                          <div className="text-xs">
                            Added on {formatDate(record.createdAt)}
                          </div>
                          {record.notes && (
                            <div className="text-xs italic mt-1">
                              Note: {record.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(record._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete this addition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}