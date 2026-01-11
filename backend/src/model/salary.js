import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

const salaryAdditionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // YYYY-MM
  salaryAmount: { type: Number, default: 0 },
  remainingSalary: { type: Number, default: 0 },
  salaryAdditions: [salaryAdditionSchema],
  expenses: [expenseSchema],
  notes: String
}, { timestamps: true });

salarySchema.index({ user: 1, month: 1 }, { unique: true });

export const Salary = mongoose.model("Salary", salarySchema);
