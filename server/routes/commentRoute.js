import { Router } from "express";
import { 
  createComment, 
  getCommentsByPostId, 
  updateComment, 
  deleteComment 
} from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authValidator.js";

const commentRouter = Router();

commentRouter.post("/", authenticate, createComment);
commentRouter.get("/post/:postId", getCommentsByPostId);
commentRouter.put("/:id", authenticate, updateComment);
commentRouter.delete("/:id", authenticate, deleteComment);

export default commentRouter;

