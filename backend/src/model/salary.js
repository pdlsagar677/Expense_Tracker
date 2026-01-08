// src/model/salary.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // format: YYYY-MM
  salaryAmount: { type: Number, required: true },
  expenses: [expenseSchema],
  remainingSalary: { type: Number, required: true },
}, { timestamps: true });

salarySchema.index({ user: 1, month: 1 }, { unique: true }); // one record per user per month

export const Salary = mongoose.model("Salary", salarySchema);
