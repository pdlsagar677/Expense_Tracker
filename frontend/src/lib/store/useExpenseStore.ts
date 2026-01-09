// lib/store/useExpenseStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "@/lib/services/api";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  notes?: string;
  date: string;
  month?: string;
}

interface Salary {
  month: string;
  salaryAmount: number;
  totalSpent: number;
  remainingSalary: number;
  expenses: Expense[];
  savingsRate?: number;
}

interface SalaryAddition {
  _id: string;
  month: string;
  salaryAmount: number;
  totalMonthSalary: number;
  notes?: string;
  createdAt: string;
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
  salaryAdditions: SalaryAddition[];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  lastFetchedSalary: number | null;
  lastFetchedExpenses: number | null;
  lastFetchedAdditions: number | null;
  CACHE_DURATION: number;

  addSalary: (payload: AddSalaryData) => Promise<void>;
  getCurrentSalary: (forceRefresh?: boolean) => Promise<Salary | null>;
  addExpense: (payload: AddExpenseData) => Promise<void>;
  getAllExpenses: (forceRefresh?: boolean) => Promise<void>;
  getSalaryAdditions: (forceRefresh?: boolean) => Promise<void>;
  deleteSalaryAddition: (id: string) => Promise<void>;

  clearError: () => void;
  clearMessage: () => void;
  clearCache: () => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      salary: null,
      allExpenses: [],
      totalExpenses: 0,
      salaryAdditions: [],
      isLoading: false,
      error: null,
      message: null,
      lastFetchedSalary: null,
      lastFetchedExpenses: null,
      lastFetchedAdditions: null,
      CACHE_DURATION: 60 * 1000,

      addSalary: async (payload) => {
        set({ isLoading: true, error: null, message: null });
        try {
          await API.post("/salary", payload);

          set({ lastFetchedSalary: null, lastFetchedAdditions: null });

          await Promise.all([
            get().getCurrentSalary(true),
            get().getSalaryAdditions(true)
          ]);

          set({ isLoading: false, message: "Income added successfully" });
          setTimeout(() => get().clearMessage(), 3000);
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to add income" });
          throw err;
        }
      },

      getCurrentSalary: async (forceRefresh = false) => {
        const state = get();
        if (!forceRefresh && state.lastFetchedSalary && Date.now() - state.lastFetchedSalary < state.CACHE_DURATION && state.salary) return state.salary;

        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/salary/current");
          const salaryData = data.data || {
            month: new Date().toISOString().slice(0, 7),
            salaryAmount: 0,
            totalSpent: 0,
            remainingSalary: 0,
            expenses: [],
            savingsRate: 0,
          };
          set({ salary: salaryData, isLoading: false, lastFetchedSalary: Date.now() });
          return salaryData;
        } catch (err: any) {
          set({ isLoading: false, salary: null, error: err.response?.data?.message || "Failed to load salary" });
          return null;
        }
      },

      addExpense: async (payload) => {
        set({ isLoading: true, error: null, message: null });
        try {
          await API.post("/salary/expenses", payload);

          set({ lastFetchedSalary: null, lastFetchedExpenses: null });
          await Promise.all([get().getCurrentSalary(true), get().getAllExpenses(true)]);

          set({ isLoading: false, message: "Expense added successfully" });
          setTimeout(() => get().clearMessage(), 3000);
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to add expense" });
          throw err;
        }
      },

      getAllExpenses: async (forceRefresh = false) => {
        const state = get();
        if (!forceRefresh && state.lastFetchedExpenses && Date.now() - state.lastFetchedExpenses < state.CACHE_DURATION && state.allExpenses.length > 0) return;

        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/salary/expenses/all");
          const responseData = data.data || { expenses: [], totalExpenses: 0 };
          set({ allExpenses: responseData.expenses || [], totalExpenses: responseData.totalExpenses || 0, isLoading: false, lastFetchedExpenses: Date.now() });
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to load expenses" });
        }
      },

      getSalaryAdditions: async (forceRefresh = false) => {
        const state = get();
        if (!forceRefresh && state.lastFetchedAdditions && Date.now() - state.lastFetchedAdditions < state.CACHE_DURATION && state.salaryAdditions.length > 0) return;

        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/salary/additions");
          set({ salaryAdditions: data.data || [], isLoading: false, lastFetchedAdditions: Date.now() });
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to load salary history" });
        }
      },

      deleteSalaryAddition: async (id: string) => {
        set({ isLoading: true, error: null, message: null });
        try {
          await API.delete(`/salary/additions/${id}`);
          set({ lastFetchedAdditions: null, lastFetchedSalary: null });
          await get().getSalaryAdditions(true);
          await get().getCurrentSalary(true);
          set({ isLoading: false, message: "Salary addition deleted successfully" });
          setTimeout(() => get().clearMessage(), 3000);
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Failed to delete salary addition" });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
      clearMessage: () => set({ message: null }),
      clearCache: () =>
        set({
          salary: null,
          allExpenses: [],
          totalExpenses: 0,
          salaryAdditions: [],
          lastFetchedSalary: null,
          lastFetchedExpenses: null,
          lastFetchedAdditions: null,
        }),
    }),
    {
      name: "expense-storage",
      partialize: (state) => ({
        salary: state.salary,
        allExpenses: state.allExpenses,
        totalExpenses: state.totalExpenses,
        salaryAdditions: state.salaryAdditions,
        lastFetchedSalary: state.lastFetchedSalary,
        lastFetchedExpenses: state.lastFetchedExpenses,
        lastFetchedAdditions: state.lastFetchedAdditions,
      }),
    }
  )
);
