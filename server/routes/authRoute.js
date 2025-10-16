import { Router } from "express";
import { register, login, getUser, updateProfile, resetPassword, logout, loginAdmin, resetPasswordAdmin, logoutAdmin, getAdmin } from "../controllers/authController.js";
import { authenticate, protectUser, protectAdmin } from "../middlewares/authValidator.js";

const authRouter = Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/login-admin", loginAdmin);

// Protected routes - for all authenticated users
authRouter.get("/user", authenticate, getUser);
authRouter.put("/user/profile", authenticate, updateProfile);

// Protected routes user only
authRouter.put("/reset-password", resetPassword);
authRouter.post("/logout", protectUser, logout);

// Protected routes admin only
authRouter.get("/admin", protectAdmin, getAdmin);
authRouter.put("/reset-password-admin", resetPasswordAdmin);
authRouter.post("/logout-admin", protectAdmin, logoutAdmin);

export default authRouter;
