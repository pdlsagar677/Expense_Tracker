"use client";

import { useState, useEffect } from "react";
import AddSalaryForm from "@/components/AddSalaryForm";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from "lucide-react";
import Button from "@/components/Button";
import { useExpenseStore } from "@/lib/store/useExpenseStore";
import SalaryHistory from "@/components/SalaryHistorypage";

export default function Income() {
  const [showForm, setShowForm] = useState(false);
  const { getCurrentSalary, isLoading, salary } = useExpenseStore();

  const [financialData, setFinancialData] = useState({
    currentSalary: 0,
    currentBudget: 0,
    remainingBalance: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  });

  // Load financial data
  const loadFinancialData = async () => {
    const salaryData = await getCurrentSalary();
    
    if (salaryData) {
      const totalSpent = salaryData.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const savingsRate = salaryData.salaryAmount > 0
        ? Math.round(((salaryData.salaryAmount - totalSpent) / salaryData.salaryAmount) * 100)
        : 0;

      setFinancialData({
        currentSalary: salaryData.salaryAmount || 0,
        remainingBalance: salaryData.remainingSalary || 0,
        monthlyExpenses: totalSpent,
        savingsRate,
        currentBudget: salaryData.salaryAmount || 0,
      });
    } else {
      setFinancialData({
        currentSalary: 0,
        remainingBalance: 0,
        monthlyExpenses: 0,
        savingsRate: 0,
        currentBudget: 0,
      });
    }
  };

  // Load on mount
  useEffect(() => {
    loadFinancialData();
  }, []);

  // Update when salary changes in store
  useEffect(() => {
    if (salary) {
      const totalSpent = salary.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const savingsRate = salary.salaryAmount > 0
        ? Math.round(((salary.salaryAmount - totalSpent) / salary.salaryAmount) * 100)
        : 0;

      setFinancialData({
        currentSalary: salary.salaryAmount || 0,
        remainingBalance: salary.remainingSalary || 0,
        monthlyExpenses: totalSpent,
        savingsRate,
        currentBudget: salary.salaryAmount || 0,
      });
    }
  }, [salary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculatePercentage = (part: number, whole: number) => {
    if (whole === 0) return 0;
    return Math.round((part / whole) * 100);
  };

  const getRemainingBalancePercentage = () => {
    if (financialData.currentSalary === 0) return 0;
    return Math.min(Math.abs(financialData.remainingBalance) / financialData.currentSalary * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Salary Management</h2>
        <p className="text-gray-600">Track your income and manage your monthly salary</p>
      </div>

      {/* Current Financial Overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Financial Overview</h3>
            <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric' 
            })}</p>
          </div>
          
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "primary"}
            className="gap-2"
          >
            {showForm ? (
              <>
                <ArrowUpRight size={18} />
                View Summary
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Salary
              </>
            )}
          </Button>
        </div>

        {showForm ? (
          <div className="mt-6">
            <AddSalaryForm
              onSuccess={async () => {
                setShowForm(false);
                await getCurrentSalary(true); // Force refresh
              }}
            />
          </div>
        ) : (
          <>
            {/* Financial Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Current Salary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className={`flex items-center text-sm ${
                    financialData.currentSalary > 0 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {financialData.currentSalary > 0 ? (
                      <>
                        <ArrowUpRight size={14} />
                        <span>Current</span>
                      </>
                    ) : (
                      <span>No data</span>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Salary</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {financialData.currentSalary > 0 ? formatCurrency(financialData.currentSalary) : 'No salary recorded'}
                </p>
                {financialData.currentSalary > 0 && (
                  <p className="text-sm text-green-600 mt-2">Last updated this month</p>
                )}
              </div>

              {/* Remaining Balance */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className={`flex items-center text-sm ${
                    financialData.remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {financialData.remainingBalance >= 0 ? (
                      <>
                        <ArrowUpRight size={14} />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight size={14} />
                        <span>Overspent</span>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Remaining Balance</h3>
                <p className={`text-2xl font-bold ${
                  financialData.remainingBalance >= 0 ? 'text-gray-900' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(financialData.remainingBalance))}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {financialData.remainingBalance >= 0 ? 'Available to spend' : 'Exceeded budget'}
                </p>
              </div>

              {/* Current Budget */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm text-purple-600">
                    {calculatePercentage(financialData.monthlyExpenses, financialData.currentBudget)}% used
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Budget</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {financialData.currentBudget > 0 ? formatCurrency(financialData.currentBudget) : 'No budget set'}
                </p>
                {financialData.currentBudget > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formatCurrency(financialData.monthlyExpenses)} spent
                  </p>
                )}
              </div>

              {/* Savings Rate */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex items-center text-sm text-amber-600">
                    {financialData.savingsRate > 20 ? (
                      <>
                        <ArrowUpRight size={14} />
                        <span>Excellent</span>
                      </>
                    ) : financialData.savingsRate > 10 ? (
                      <span>Good</span>
                    ) : (
                      <>
                        <ArrowDownRight size={14} />
                        <span>Low</span>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Savings Rate</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {financialData.savingsRate > 0 ? `${financialData.savingsRate}%` : 'Not calculated'}
                </p>
                {financialData.savingsRate > 0 && (
                  <p className="text-sm text-gray-500 mt-2">of monthly income</p>
                )}
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-6 mb-8">
              {/* Budget Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Budget Usage</span>
                  <span className="text-gray-500">
                    {formatCurrency(financialData.monthlyExpenses)} / {formatCurrency(financialData.currentBudget)}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(calculatePercentage(financialData.monthlyExpenses, financialData.currentBudget), 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {calculatePercentage(financialData.monthlyExpenses, financialData.currentBudget)}% of budget used
                </p>
              </div>

              {/* Balance Status */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Remaining Balance</span>
                  <span className={`font-medium ${
                    financialData.remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {financialData.remainingBalance >= 0 ? 'Positive' : 'Negative'}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      financialData.remainingBalance >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${getRemainingBalancePercentage()}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {financialData.remainingBalance >= 0 ? 
                    `${formatCurrency(financialData.remainingBalance)} remaining from salary` : 
                    `${formatCurrency(Math.abs(financialData.remainingBalance))} over budget`
                  }
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Salary Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Record New Salary</h4>
                    <p className="text-sm text-gray-600">Add your monthly salary entry</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Keep your income tracking up to date by recording each salary payment.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  variant="primary"
                  fullWidth
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus size={18} />
                  Add Salary Now
                </Button>
              </div>


            </div>

            <SalaryHistory/>
          </>
        )}
      </div>
    </div>
  );
}