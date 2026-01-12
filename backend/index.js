import dotenv from "dotenv";
dotenv.config();

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
    origin: process.env.FRONTEND_URL ,
    credentials: true,
  })
);

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
