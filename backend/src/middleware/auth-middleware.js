// src/middleware/auth-middleware.js
import jwt from "jsonwebtoken";
import { User } from "../model/user.js";


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach user info to request
    const user = await User.findById(decoded.userId).select("-password -resetPasswordToken -verificationToken");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found or unauthorized" });
    }

    req.userId = user._id;
    req.user = user;

    next(); // Proceed to next middleware/controller
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
