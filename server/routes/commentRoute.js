import { Router } from "express";
import { 
  createComment, 
  getCommentsByPostId, 
  updateComment, 
  deleteComment 
} from "../controllers/commentController.js";
import { protectUser } from "../middlewares/authValidator.js";

const commentRouter = Router();

commentRouter.post("/", protectUser, createComment);
commentRouter.get("/post/:postId", getCommentsByPostId);
commentRouter.put("/:id", protectUser, updateComment);
commentRouter.delete("/:id", protectUser, deleteComment);

export default commentRouter;

