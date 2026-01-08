import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: Date, required: true }, // Store first day of month
  amount: { type: Number, required: true },
  remaining: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

salarySchema.index({ user: 1, month: 1 }, { unique: true }); // one salary per user per month

export const Salary = mongoose.model("Salary", salarySchema);
