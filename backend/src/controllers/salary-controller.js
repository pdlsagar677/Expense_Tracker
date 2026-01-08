// src/controllers/salary-controller.js
import { Salary } from "../model/salary.js";
import { format } from "date-fns";

// Add or update salary
export const addOrUpdateSalary = async (req, res) => {
  try {
    const { amount, month, notes } = req.body;
    const userId = req.userId;

    if (!amount || !month) {
      return res.status(400).json({ success: false, message: "Amount and month are required" });
    }

    // Check if salary already exists for this month
    let salary = await Salary.findOne({ user: userId, month });

    if (!salary) {
      // Create new salary for the month
      salary = await Salary.create({
        user: userId,
        month,
        salaryAmount: amount,
        remainingSalary: amount,
        expenses: [],
      });
    } else {
      // Update salary amount and adjust remainingSalary
      const expenseTotal = salary.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      salary.salaryAmount = amount;
      salary.remainingSalary = amount - expenseTotal;
      await salary.save();
    }

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error("Add/update salary error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Add expense and deduct from salary
export const addExpense = async (req, res) => {
  try {
    const { title, amount, notes } = req.body;
    const userId = req.userId;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: "Title and amount are required" });
    }

    // Get current month in YYYY-MM format
    const month = format(new Date(), "yyyy-MM");

    // Find salary for the current month
    let salary = await Salary.findOne({ user: userId, month });

    // Auto-create salary record for this month if not exists
    if (!salary) {
      salary = await Salary.create({
        user: userId,
        month,
        salaryAmount: 0,
        remainingSalary: 0,
        expenses: [],
      });
    }

    // Check if enough remaining salary
    if (salary.remainingSalary < amount) {
      return res.status(400).json({ success: false, message: "Not enough remaining salary" });
    }

    // Add expense
    salary.expenses.push({ title, amount, notes });
    salary.remainingSalary = Math.max(0, salary.remainingSalary - amount);

    await salary.save();

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error("Add expense error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Get current month's salary with analytics
export const getCurrentSalary = async (req, res) => {
  try {
    const userId = req.userId;

    // Month in YYYY-MM format
    const month = format(new Date(), "yyyy-MM");

    const salary = await Salary.findOne({ user: userId, month });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found for this month"
      });
    }

    const totalSpent = salary.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return res.status(200).json({
      success: true,
      data: {
        month: salary.month,
        salaryAmount: salary.salaryAmount,
        totalSpent,
        remainingSalary: salary.remainingSalary,
        expenses: salary.expenses
      }
    });
  } catch (error) {
    console.error("Get current salary error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

