import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "@/lib/services/api";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  notes?: string;
  date: string;
}

interface Salary {
  month: string;
  salaryAmount: number;
  totalSpent: number;
  remainingSalary: number;
  expenses: Expense[];
  savingsRate?: number;
}

interface AddSalaryData {
  amount: number;
  month: string;
  notes?: string;
}

interface AddExpenseData {
  title: string;
  amount: number;
  notes?: string;
}

interface ExpenseStore {
  salary: Salary | null;
  allExpenses: Expense[];
  totalExpenses: number;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  lastFetched: number | null;
  
  // Cache duration (5 minutes)
  CACHE_DURATION: number;

  addSalary: (payload: AddSalaryData) => Promise<void>;
  getCurrentSalary: (forceRefresh?: boolean) => Promise<Salary | null>;
  addExpense: (payload: AddExpenseData) => Promise<void>;
  getAllExpenses: (forceRefresh?: boolean) => Promise<void>;
  
  // Utility methods
  clearError: () => void;
  clearMessage: () => void;
  clearCache: () => void;
  shouldRefetch: () => boolean;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      salary: null,
      allExpenses: [],
      totalExpenses: 0,
      isLoading: false,
      error: null,
      message: null,
      lastFetched: null,
      CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

      shouldRefetch: () => {
        const { lastFetched, CACHE_DURATION } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      },

      addSalary: async (payload) => {
        set({ isLoading: true, error: null, message: null });
        try {
          await API.post("/salary", payload);
          
          // Force refresh after adding salary
          await get().getCurrentSalary(true);
          
          set({ 
            isLoading: false, 
            message: "Income added successfully",
            lastFetched: Date.now()
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || "Failed to add income"
          });
          throw err;
        }
      },

      getCurrentSalary: async (forceRefresh = false): Promise<Salary | null> => {
        // Use cache if available and not forcing refresh
        if (!forceRefresh && !get().shouldRefetch() && get().salary) {
          return get().salary;
        }

        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/salary/current");
          
          const salaryData = data.data || {
            month: new Date().toISOString().slice(0, 7),
            salaryAmount: 0,
            totalSpent: 0,
            remainingSalary: 0,
            expenses: [],
            savingsRate: 0
          };

          set({
            salary: salaryData,
            isLoading: false,
            lastFetched: Date.now()
          });
          
          return salaryData;
        } catch (err: any) {
          set({
            isLoading: false,
            salary: null,
            error: err.response?.data?.message || "Failed to load salary",
          });
          return null;
        }
      },

      addExpense: async (payload) => {
        set({ isLoading: true, error: null, message: null });
        try {
          await API.post("/salary/expenses", payload);
          
          // Update both current salary and all expenses
          await Promise.all([
            get().getCurrentSalary(true),
            get().getAllExpenses(true)
          ]);
          
          set({
            isLoading: false,
            message: "Expense added successfully",
            lastFetched: Date.now()
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || "Failed to add expense"
          });
          throw err;
        }
      },

      getAllExpenses: async (forceRefresh = false): Promise<void> => {
        // Use cache if available
        if (!forceRefresh && !get().shouldRefetch() && get().allExpenses.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/salary/expenses/all");
          
          // Backend now returns { expenses: [], totalExpenses: number }
          const responseData = data.data || { expenses: [], totalExpenses: 0 };
          
          const allExpenses = responseData.expenses || [];
          const totalExpenses = responseData.totalExpenses || 0;

          set({ 
            allExpenses,
            totalExpenses,
            isLoading: false,
            lastFetched: Date.now()
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.message || "Failed to load expenses",
          });
        }
      },

      clearError: () => set({ error: null }),
      clearMessage: () => set({ message: null }),
      clearCache: () => set({ 
        salary: null, 
        allExpenses: [], 
        totalExpenses: 0,
        lastFetched: null 
      }),
    }),
    {
      name: "expense-storage",
      partialize: (state) => ({
        salary: state.salary,
        allExpenses: state.allExpenses,
        totalExpenses: state.totalExpenses,
        lastFetched: state.lastFetched
      }),
    }
  )
);