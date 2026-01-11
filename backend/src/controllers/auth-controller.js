import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../resend/email.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokens, attachTokenCookies } from "../utils/generateJWTToken.js";
import { Salary } from "../model/salary.js";

/**
 * SIGNUP
 */
export const signup = async (req, res) => {
  const { name, email, password, phoneNumber, age, gender } = req.body;

  try {
    if (!name || !email || !password || !phoneNumber || !age || !gender) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return res.status(400).json({ success: false, message: "Age must be between 1 and 120" });
    }

    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid gender selection" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      age: ageNum,
      gender: gender.toLowerCase(),
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      isVerified: false,
    });

    await sendVerificationEmail(user.email, verificationToken);

    const { accessToken, refreshToken } = generateTokens(user._id);
    attachTokenCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * VERIFY EMAIL
 */
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) return res.status(400).json({ success: false, message: "Verification code required" });

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ success: false, message: "Please verify your email first" });

    const { accessToken, refreshToken } = generateTokens(user._id);
    attachTokenCookies(res, accessToken, refreshToken);

    return res.status(200).json({ success: true, message: "Login successful", user: user.toJSON() });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * REFRESH TOKEN (ROTATE)
 */
export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const { accessToken, refreshToken } = generateTokens(decoded.userId);
    attachTokenCookies(res, accessToken, refreshToken);

    return res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

/**
 * CHECK AUTH
 */
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, user: user.toJSON() });
  } catch (error) {
    console.error("Check auth error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};





// GET PROFILE
export const getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// UPDATE PROFILE
export const updateProfileById = async (req, res) => {
  try {
    const { name, phoneNumber, age, gender } = req.body;
    
    // Validate phone number
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
    }
    
    // Validate age
    if (age) {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return res.status(400).json({ success: false, message: "Age must be between 1 and 120" });
      }
    }
    
    // Validate gender
    if (gender) {
      const validGenders = ["male", "female", "other"];
      if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({ success: false, message: "Invalid gender selection" });
      }
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update fields
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (age) user.age = Number(age);
    if (gender) user.gender = gender.toLowerCase();
    
    await user.save();

    return res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully",
      user: user.toJSON()
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// CHANGE PASSWORD (requires current password)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 6 characters" 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Update to new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ 
      success: true, 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};



export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ success: false, message: "Incorrect password" });
    }

    // Delete all Salary records (which include expenses and salaryAdditions) for this user
    await Salary.deleteMany({ user: req.userId });

    // Delete user
    await User.findByIdAndDelete(req.userId);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Account and all related data deleted successfully"
    });

  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

