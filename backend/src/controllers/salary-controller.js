import { Salary } from "../model/salary.js";
import { format } from "date-fns";

// Add income (accumulate model)
export const addOrUpdateSalary = async (req, res) => {
  try {
    const { amount, month, notes } = req.body;
    const userId = req.userId;

    if (!amount || !month) {
      return res.status(400).json({ success: false, message: "Amount and month are required" });
    }

    let salary = await Salary.findOne({ user: userId, month });

    if (!salary) {
      // First income of month
      salary = await Salary.create({
        user: userId,
        month,
        salaryAmount: amount,
        remainingSalary: amount,
        salaryAdditions: [{
          amount,
          notes,
          date: new Date()
        }],
        expenses: [],
        notes,
      });
    } else {
      // Accumulate new income
      salary.salaryAmount += amount;
      salary.remainingSalary += amount;
      
      // Add to salaryAdditions array
      salary.salaryAdditions.push({
        amount,
        notes,
        date: new Date()
      });
      
      if (notes) salary.notes = notes;
      await salary.save();
    }

    return res.status(200).json({ success: true, data: salary });
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

    // Add expense with date
    salary.expenses.push({ 
      title, 
      amount, 
      notes,
      date: new Date()
    });
    salary.remainingSalary = Math.max(0, salary.remainingSalary - amount);

    await salary.save();

    return res.status(200).json({ success: true, data: salary });
  } catch (error) {
    console.error("Add expense error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get current salary for current month
export const getCurrentSalary = async (req, res) => {
  try {
    const userId = req.userId;
    const month = format(new Date(), "yyyy-MM");

    const salary = await Salary.findOne({ user: userId, month });

    if (!salary) {
      return res.status(200).json({
        success: true,
        data: {
          month,
          salaryAmount: 0,
          totalSpent: 0,
          remainingSalary: 0,
          expenses: [],
          savingsRate: 0
        }
      });
    }

    const totalSpent = salary.expenses.reduce((sum, e) => sum + e.amount, 0);

    const savingsRate = salary.salaryAmount > 0
      ? Math.round(((salary.salaryAmount - totalSpent) / salary.salaryAmount) * 100)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        month,
        salaryAmount: salary.salaryAmount,
        totalSpent,
        remainingSalary: salary.remainingSalary,
        expenses: salary.expenses,
        savingsRate
      }
    });
  } catch (error) {
    console.error("Get current salary error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all expenses across all months for current user
export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.userId;

    const salaryData = await Salary.find({ user: userId })
      .sort({ month: -1 }); // newest first

    if (!salaryData || salaryData.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          expenses: [],
          totalExpenses: 0
        }
      });
    }

    // Flatten all expenses from all months
    const allExpenses = [];
    salaryData.forEach((monthData) => {
      if (monthData.expenses && Array.isArray(monthData.expenses)) {
        monthData.expenses.forEach(expense => {
          allExpenses.push({
            _id: expense._id,
            title: expense.title,
            amount: expense.amount,
            notes: expense.notes,
            date: expense.date || monthData.createdAt,
            month: monthData.month
          });
        });
      }
    });

    // Sort by date (newest first)
    allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return res.status(200).json({
      success: true,
      data: {
        expenses: allExpenses,
        totalExpenses
      }
    });
  } catch (error) {
    console.error("Get all expenses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get salary additions history (INDIVIDUAL ADDITIONS)
export const getSalaryAdditions = async (req, res) => {
  try {
    const userId = req.userId;

    const salaryData = await Salary.find({ user: userId })
      .sort({ month: -1 }) // newest first
      .select('month salaryAmount salaryAdditions');

    if (!salaryData || salaryData.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Create flat array of all individual salary additions
    const allAdditions = [];
    
    salaryData.forEach(record => {
      if (record.salaryAdditions && Array.isArray(record.salaryAdditions)) {
        record.salaryAdditions.forEach(addition => {
          allAdditions.push({
            _id: addition._id,
            month: record.month,
            salaryAmount: addition.amount, // Individual addition amount
            totalMonthSalary: record.salaryAmount, // Total for the month
            notes: addition.notes,
            createdAt: addition.date || new Date()
          });
        });
      }
    });

    // Sort by date (newest first)
    allAdditions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      data: allAdditions
    });
  } catch (error) {
    console.error("Get salary additions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete individual salary addition
export const deleteSalaryAddition = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the salary document that contains this addition
    const salary = await Salary.findOne({
      user: userId,
      'salaryAdditions._id': id
    });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary addition not found"
      });
    }

    // Find the specific addition to get its amount
    const addition = salary.salaryAdditions.id(id);
    if (!addition) {
      return res.status(404).json({
        success: false,
        message: "Salary addition not found"
      });
    }

    // Update the salary amounts
    const additionAmount = addition.amount;
    salary.salaryAmount = Math.max(0, salary.salaryAmount - additionAmount);
    salary.remainingSalary = Math.max(0, salary.remainingSalary - additionAmount);
    
    // Remove the addition from the array
    salary.salaryAdditions.pull({ _id: id });
    
    await salary.save();

    return res.status(200).json({
      success: true,
      message: "Salary addition deleted successfully"
    });
  } catch (error) {
    console.error("Delete salary addition error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete salary record for a specific month (ENTIRE MONTH)
export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const salary = await Salary.findOne({ _id: id, user: userId });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found"
      });
    }

    await Salary.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Salary record deleted successfully"
    });
  } catch (error) {
    console.error("Delete salary error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};