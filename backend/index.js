import dotenv from "dotenv";
dotenv.config();
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth-route.js";
import salaryRoutes from "./src/routes/salary-route.js"
import { connectToDatabase } from "./src/database/connectionToDatabase.js";

const app = express();

const PORT = process.env.PORT;

// ← IMPORTANT: cookieParser BEFORE routes
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.FRONTEND_URL, 
      ].filter(Boolean);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.options("*", cors());

const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(express.json());

await connectToDatabase();

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running......Welcome to Expense Tracker");
});

app.use("/api/auth", authRoutes);
app.use("/api/salary", salaryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});