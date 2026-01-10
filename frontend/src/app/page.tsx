"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Wallet, TrendingUp, Shield, Users, PieChart, Bell, Calendar } from "lucide-react";
import Button from "@/components/Button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-900">ExpenseTracker</span>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Get Started
            <ArrowRight size={16} />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Text */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Smart Financial Management
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track Expenses,
              <span className="text-blue-600"> Save Smarter</span>,
              Live Better
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Take control of your finances with our intuitive expense tracker. Monitor spending, 
              manage salary, set budgets, and achieve your financial goals with powerful insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={() => router.push("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg"
                size="lg"
              >
                Start Free Now
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                size="lg"
              >
                Login to Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-500">Secure & Private</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-sm text-gray-500">Happy Users</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$1M+</p>
                  <p className="text-sm text-gray-500">Saved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-blue-100">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-2xl font-bold text-gray-900">$4,850</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  +12.5% This Month
                </div>
              </div>
              
              {/* Mini Chart */}
              <div className="mb-6">
                <div className="flex items-end justify-between h-24 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="flex flex-col items-center">
                      <div
                        className={`w-10 rounded-t-lg ${i === 3 ? 'bg-blue-600' : 'bg-blue-200'}`}
                        style={{ height: `${[40, 60, 75, 90, 65, 85, 70][i]}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-blue-100 rounded">
                      <ArrowRight className="w-4 h-4 text-blue-600 rotate-45" />
                    </div>
                    <p className="text-sm font-medium text-blue-700">Income</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">$6,200</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-red-100 rounded">
                      <ArrowRight className="w-4 h-4 text-red-600 rotate-[135deg]" />
                    </div>
                    <p className="text-sm font-medium text-red-700">Expenses</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">$1,350</p>
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">Recent Transactions</p>
                <div className="space-y-3">
                  {[
                    { name: "Grocery Shopping", amount: "-$85.20", type: "expense" },
                    { name: "Salary Credit", amount: "+$3,000", type: "income" },
                    { name: "Netflix", amount: "-$15.99", type: "expense" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {item.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <Wallet className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className={`font-medium ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Financial Success
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools designed to simplify your financial journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="p-3 bg-white rounded-xl w-fit mb-4 shadow-sm">
                  <div className={`p-2 ${feature.color} rounded-lg`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ExpenseTracker Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to master your finances
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold text-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands who have transformed their financial habits with ExpenseTracker
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/signup")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold shadow-2xl"
                size="lg"
              >
                Start Your Free Account
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                size="lg"
              >
                Login to Existing Account
              </Button>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ExpenseTracker</span>
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <PieChart className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-100",
    title: "Expense Analytics",
    description: "Detailed charts and reports to understand your spending patterns."
  },
  {
    icon: <Wallet className="w-6 h-6 text-green-600" />,
    color: "bg-green-100",
    title: "Salary Management",
    description: "Track income, manage multiple sources, and monitor remaining balance."
  },
  {
    icon: <Calendar className="w-6 h-6 text-purple-600" />,
    color: "bg-purple-100",
    title: "Budget Planning",
    description: "Set monthly budgets and get alerts when approaching limits."
  },
  {
    icon: <Bell className="w-6 h-6 text-amber-600" />,
    color: "bg-amber-100",
    title: "Smart Alerts",
    description: "Get notified about bills, budgets, and unusual spending."
  }
];

const steps = [
  {
    title: "Sign Up & Connect",
    description: "Create your free account in minutes. No complex setup required."
  },
  {
    title: "Track Your Expenses",
    description: "Add your income sources and start logging expenses effortlessly."
  },
  {
    title: "Achieve Your Goals",
    description: "Watch your savings grow and reach your financial targets faster."
  }
];