import express from "express";
import { 
  addExpense, 
  addOrUpdateSalary, 
  getCurrentSalary,
  getAllExpenses,
  getSalaryAdditions,
  deleteSalaryAddition, 
  deleteSalary 
} from "../controllers/salary-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.use(authMiddleware); 

router.post("/", addOrUpdateSalary); 
router.get("/current", getCurrentSalary); 
router.get("/additions", getSalaryAdditions); 
router.delete("/additions/:id", deleteSalaryAddition); 
router.delete("/:id", deleteSalary); 

// Expense operations
router.post("/expenses", addExpense);
router.get("/expenses/all", getAllExpenses);

export default router;