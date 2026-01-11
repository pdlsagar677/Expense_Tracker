import mongoose from "mongoose";
import { Salary } from "./salary.js"; 

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Cascade delete: remove salary records
userSchema.pre("remove", async function (next) {
  try {
    await Salary.deleteMany({ user: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpiresAt;
  delete user.verificationToken;
  delete user.verificationTokenExpiresAt;
  return user;
};

export const User = mongoose.model("User", userSchema);
