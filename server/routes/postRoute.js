import { Router } from "express";
import { createPost, getPostById, updatePost, deletePost, getAllPosts } from "../controllers/postController.js";
import { validatePostInput } from "../middlewares/postValidator.js";
import { protectAdmin } from "../middlewares/authValidator.js";

const postRouter = Router();

postRouter.post("/", validatePostInput, protectAdmin, createPost);
postRouter.get("/:id", getPostById);
postRouter.put("/:id", validatePostInput, protectAdmin, updatePost);
postRouter.delete("/:id", protectAdmin, deletePost);
postRouter.get("/", getAllPosts);

export default postRouter;
