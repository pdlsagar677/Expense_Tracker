import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./src/routes/auth-route.js";
import salaryRoutes from "./src/routes/salary-route.js";
import { connectToDatabase } from "./src/database/connectionToDatabase.js";

dotenv.config();

const app = express();

// ----- MIDDLEWARE -----
app.use(cookieParser());

app.use(express.json());

// ----- CORS -----
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend domain
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// ----- RATE LIMIT -----
const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ----- DATABASE -----
await connectToDatabase();

// ----- ROUTES -----
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running on Vercel!");
});

app.use("/api/auth", authRoutes);
app.use("/api/salary", salaryRoutes);

// ----- START SERVER -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
