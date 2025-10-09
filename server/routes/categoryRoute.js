import { Router } from "express";
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { protectAdmin } from "../middlewares/authValidator.js";

const categoryRouter = Router();

categoryRouter.post("/", protectAdmin, createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", protectAdmin, updateCategory);
categoryRouter.delete("/:id", protectAdmin, deleteCategory);

export default categoryRouter;

