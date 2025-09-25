import { Router } from "express";
import { createPost, getPostById, updatePost, deletePost, getAllPosts } from "../controllers/postController.js";
import { validatePostInput } from "../middlewares/postValidator.js";

const postRouter = Router();

postRouter.post("/", validatePostInput, createPost);
postRouter.get("/:id", getPostById);
postRouter.put("/:id", validatePostInput, updatePost);
postRouter.delete("/:id", deletePost);
postRouter.get("/", getAllPosts);

export default postRouter;
