import { Router } from "express";
import { createPost, getPostById, updatePost, deletePost, getAllPosts, imageFileUpload } from "../controllers/postController.js";
import { validatePostInput, validatePostInputWithFile } from "../middlewares/postValidator.js";
import { protectAdmin } from "../middlewares/authValidator.js";

const postRouter = Router();

postRouter.post("/", imageFileUpload, validatePostInputWithFile, protectAdmin, createPost);
postRouter.get("/:id", getPostById);
postRouter.put("/:id", validatePostInput, protectAdmin, updatePost);
postRouter.delete("/:id", protectAdmin, deletePost);
postRouter.get("/", getAllPosts);

export default postRouter;
