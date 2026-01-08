// src/routes/salary-route.js
import express from "express";
import { addExpense, addOrUpdateSalary, getCurrentSalary } from "../controllers/salary-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.use(authMiddleware); 

router.post("/", addOrUpdateSalary); 
router.get("/current", getCurrentSalary); 
router.post("/expense" , addExpense);

export default router;
