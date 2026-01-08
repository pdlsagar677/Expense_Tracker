// src/controllers/salary-controller.js
import { Salary } from "../model/salary.js";
import { startOfMonth } from "date-fns"; 

// Add or update salary for current month
export const addOrUpdateSalary = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Salary must be greater than 0" });
    }

    const month = startOfMonth(new Date());

    let salary = await Salary.findOne({ user: userId, month });

    if (salary) {
      // Update salary and reset remaining if needed
      salary.amount = amount;
      salary.remaining = amount; // Reset remaining
      await salary.save();
      return res.status(200).json({ success: true, salary, message: "Salary updated for the month" });
    } else {
      salary = await Salary.create({
        user: userId,
        month,
        amount,
        remaining: amount,
      });
      return res.status(201).json({ success: true, salary, message: "Salary added for the month" });
    }
  } catch (error) {
    console.error("Add salary error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get current month salary
export const getCurrentSalary = async (req, res) => {
  try {
    const userId = req.userId;
    const month = startOfMonth(new Date());

    const salary = await Salary.findOne({ user: userId, month });

    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary not set for this month" });
    }

    return res.status(200).json({ success: true, salary });
  } catch (error) {
    console.error("Get salary error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
