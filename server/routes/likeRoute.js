import { Router } from "express";
import { toggleLike, checkUserLike, getUserLikes } from "../controllers/likeController.js";
import { authenticate } from "../middlewares/authValidator.js";

const likeRouter = Router();

likeRouter.post("/toggle", authenticate, toggleLike);
likeRouter.get("/check/:postId", authenticate, checkUserLike);
likeRouter.get("/user", authenticate, getUserLikes);

export default likeRouter;

