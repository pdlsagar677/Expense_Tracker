import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth-route.js";
import { connectToDatabase } from "./src/database/connectionToDatabase.js";

const app = express();

const PORT = process.env.PORT ;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ single DB connection
await connectToDatabase();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
