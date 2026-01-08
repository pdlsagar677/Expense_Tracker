import { create } from "zustand";
import API from "@/lib/services/api";

interface Salary {
  month: string;
  salaryAmount: number;
  totalSpent: number;
  remainingSalary: number;
  expenses: Array<{
    title: string;
    amount: number;
    notes?: string;
  }>;
}

interface AddSalaryData {
  amount: number;
  month: string; // "2026-01"
  notes?: string;
}

interface ExpenseStore {
  salary: Salary | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;

  addSalary: (payload: AddSalaryData) => Promise<void>;
  getCurrentSalary: () => Promise<void>;

  clearError: () => void;
  clearMessage: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  salary: null,
  isLoading: false,
  error: null,
  message: null,

  addSalary: async (payload: AddSalaryData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const { data } = await API.post("/salary", payload);

      set({
        salary: {
          month: data.salary.month,
          salaryAmount: data.salary.salaryAmount,
          totalSpent: data.salary.salaryAmount - data.salary.remainingSalary,
          remainingSalary: data.salary.remainingSalary,
          expenses: data.salary.expenses
        },
        isLoading: false,
        message: "Salary saved successfully"
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to save salary"
      });
    }
  },

  getCurrentSalary: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/salary/current");

      set({
        salary: data.data,
        isLoading: false
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to fetch salary"
      });
    }
  },

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null })
}));
