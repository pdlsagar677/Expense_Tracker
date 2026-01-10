// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  CreditCard, 
  Calendar,
  Wallet,
  Target,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useExpenseStore } from "@/lib/store/useExpenseStore";

export default function DashboardPage() {
  const { 
    salary, 
    allExpenses, 
    totalExpenses, 
    salaryAdditions, 
    getCurrentSalary, 
    getAllExpenses,
    getSalaryAdditions,
    isLoading 
  } = useExpenseStore();

  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    // Load all required data
    getCurrentSalary();
    getAllExpenses();
    getSalaryAdditions();
  }, []);

  useEffect(() => {
    if (allExpenses.length > 0) {
      // Get recent 5 expenses
      const recent = [...allExpenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setRecentExpenses(recent);
    }

    // Process monthly data for chart
    if (allExpenses.length > 0) {
      const monthlyTotals: Record<string, number> = {};
      
      allExpenses.forEach(expense => {
        const month = expense.month || expense.date.substring(0, 7);
        monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
      });

      const sortedMonths = Object.keys(monthlyTotals)
        .sort()
        .slice(-6); // Last 6 months
      
      const chartData = sortedMonths.map(month => ({
        month,
        amount: monthlyTotals[month]
      }));
      
      setMonthlyData(chartData);
    }
  }, [allExpenses]);

  // Calculate total income from salary additions
  const totalIncome = salaryAdditions.reduce((sum, addition) => sum + addition.salaryAmount, 0);
  
  // Calculate current month's data
  const currentSalary = salary?.salaryAmount || 0;
  const currentExpenses = salary?.totalSpent || 0;
  const remainingSalary = salary?.remainingSalary || 0;
  const savingsRate = salary?.savingsRate || 0;

  // Calculate expense categories
  const expenseCategories = recentExpenses.reduce((acc: Record<string, number>, expense) => {
    // You might want to add category field to your Expense interface
    const category = "General"; // Default category
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Dashboard 💰</h2>
        <p className="text-gray-600">
          {isLoading ? "Loading your financial data..." : "Your financial overview at a glance"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Month Balance */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-blue-600/10 text-blue-700 rounded-full">
              Current Month
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Remaining Balance</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${remainingSalary.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {salary?.month ? `For ${salary.month}` : "No data for this month"}
          </p>
        </div>

        {/* Total Income */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-green-600/10 text-green-700 rounded-full">
              All Time
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${totalIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {salaryAdditions.length} salary addition(s)
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-red-600/10 text-red-700 rounded-full">
              All Time
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${totalExpenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {allExpenses.length} transaction(s)
          </p>
        </div>

        {/* Savings Rate */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-purple-600/10 text-purple-700 rounded-full">
              Current Month
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Savings Rate</h3>
          <p className="text-2xl font-bold text-gray-900">
            {savingsRate}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Expense Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Expense Trend</h3>
              <p className="text-sm text-gray-600">Last 6 months spending</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          {monthlyData.length > 0 ? (
            <div className="h-48 flex items-end gap-4 pt-4">
              {monthlyData.map((item, index) => {
                const maxAmount = Math.max(...monthlyData.map(d => d.amount));
                const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2">
                      ${item.amount.toLocaleString()}
                    </div>
                    <div
                      className="w-3/4 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      {item.month.split('-')[1]}/{item.month.split('-')[0].slice(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No expense data available</p>
                <p className="text-sm text-gray-400">Start adding expenses to see trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Current Month Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm border border-indigo-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Current Month</h3>
              <p className="text-sm text-gray-600">{salary?.month || "No data"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Salary</span>
              <span className="font-bold text-gray-900">${currentSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Expenses</span>
              <span className="font-bold text-red-600">${currentExpenses.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Remaining</span>
                <span className="font-bold text-green-600">${remainingSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {salary?.expenses && salary.expenses.length > 0 && (
            <div className="mt-6 pt-6 border-t border-indigo-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Recent This Month</p>
              <div className="space-y-3">
                {salary.expenses.slice(0, 3).map((expense, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 truncate max-w-[120px]">
                        {expense.title}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -${expense.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-sm text-gray-600">Latest expenses and income</p>
          </div>
          <Link 
            href="/dashboard/expenses"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            View All
            <TrendingUp className="w-4 h-4" />
          </Link>
        </div>
        
        {recentExpenses.length > 0 ? (
          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${index % 2 === 0 ? 'bg-red-100' : 'bg-blue-100'} rounded-lg`}>
                    <CreditCard className={`w-5 h-5 ${index % 2 === 0 ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{expense.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {expense.notes && ` • ${expense.notes}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-${expense.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {expense.month || new Date(expense.date).toISOString().slice(0, 7)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent transactions</p>
            <p className="text-sm text-gray-400 mt-1">Start tracking your expenses to see them here</p>
            <Link href="/dashboard/expenses">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add First Expense
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions and Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/dashboard/expenses">
              <button className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Add Expense
              </button>
            </Link>
            <br />

            <Link href="/dashboard/income">
              <button className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Add Income
              </button>
            </Link>
            
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Financial Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Income (All Time)</span>
              <span className="font-bold text-green-600">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Expenses (All Time)</span>
              <span className="font-bold text-red-600">${totalExpenses.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Net Balance</span>
                <span className={`font-bold text-lg ${(totalIncome - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(totalIncome - totalExpenses).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">Average Monthly Spend</span>
                <span className="font-medium text-gray-900">
                  ${allExpenses.length > 0 ? Math.round(totalExpenses / Math.max(1, new Set(allExpenses.map(e => e.month)).size)) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}