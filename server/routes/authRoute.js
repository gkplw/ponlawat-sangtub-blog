import { Router } from "express";
import { register, login, getUser, resetPassword, logout, loginAdmin, resetPasswordAdmin, logoutAdmin, getAdmin } from "../controllers/authController.js";
import { protectUser, protectAdmin } from "../middlewares/authValidator.js";

const authRouter = Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/login-admin", loginAdmin);

// Protected routes user
authRouter.get("/user", protectUser, getUser);
authRouter.put("/reset-password", resetPassword);
authRouter.post("/logout", protectUser, logout);

// Protected routes admin
authRouter.get("/admin", protectAdmin, getAdmin);
authRouter.put("/reset-password-admin", resetPasswordAdmin);
authRouter.post("/logout-admin", protectAdmin, logoutAdmin);

export default authRouter;
