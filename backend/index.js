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

const PORT = process.env.PORT ;

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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
app.use(cookieParser());

await connectToDatabase();
app.get("/", (req, res) => {
  res.send(" Expense Tracker Backend is running......Welcome to Expense Tracker ");
});


app.use("/api/auth", authRoutes);
app.use("/api/salary", salaryRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
