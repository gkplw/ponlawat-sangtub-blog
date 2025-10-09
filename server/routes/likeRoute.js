import { Router } from "express";
import { toggleLike, checkUserLike, getUserLikes } from "../controllers/likeController.js";
import { protectUser } from "../middlewares/authValidator.js";

const likeRouter = Router();

likeRouter.post("/toggle", protectUser, toggleLike);
likeRouter.get("/check/:postId", protectUser, checkUserLike);
likeRouter.get("/user", protectUser, getUserLikes);

export default likeRouter;

