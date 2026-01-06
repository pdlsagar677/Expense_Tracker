// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  User,
  Settings,
  LogOut,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  Bell
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      // Only check auth if we haven't checked yet
      if (!hasCheckedAuth) {
        await checkAuth();
        setHasCheckedAuth(true);
      }
    };
    
    verifyAuth();
  }, [checkAuth, hasCheckedAuth]);

  // Redirect only after we've checked auth and user is not authenticated
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated && !isCheckingAuth) {
      router.push("/login");
    }
  }, [isAuthenticated, hasCheckedAuth, isCheckingAuth, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // Show loading while checking auth or if we haven't completed the check
  if (isCheckingAuth || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after checking, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-gray-600 text-sm">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          isActive
                            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
              <p className="text-gray-600">Here's what's happening with your finances today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Balance */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Balance</h3>
                <p className="text-2xl font-bold text-gray-900">$4,582.75</p>
              </div>

              {/* Total Income */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income</h3>
                <p className="text-2xl font-bold text-gray-900">$3,500.00</p>
              </div>

              {/* Total Expenses */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
                <p className="text-2xl font-bold text-gray-900">$1,250.25</p>
              </div>

              {/* Active Budgets */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Active Budgets</h3>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <Link 
                  href="/dashboard/expenses"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {/* Transaction 1 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Netflix Subscription</h4>
                      <p className="text-sm text-gray-600">Entertainment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-$15.99</p>
                    <p className="text-sm text-gray-500">Jan 15, 2024</p>
                  </div>
                </div>

                {/* Transaction 2 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Salary Deposit</h4>
                      <p className="text-sm text-gray-600">Income</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$3,000.00</p>
                    <p className="text-sm text-gray-500">Jan 14, 2024</p>
                  </div>
                </div>

                {/* Transaction 3 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Grocery Store</h4>
                      <p className="text-sm text-gray-600">Food</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-$85.50</p>
                    <p className="text-sm text-gray-500">Jan 13, 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Bills */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Upcoming Bills</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Rent Payment</span>
                    <span className="font-medium">$1,200</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Internet Bill</span>
                    <span className="font-medium">$65</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Gym Membership</span>
                    <span className="font-medium">$40</span>
                  </li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Add Expense
                  </button>
                  <button className="w-full py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Add Income
                  </button>
                  <button className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Create Budget
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}