import { Router } from "express";
import { getAllStatuses, getStatusById } from "../controllers/statusController.js";

const statusRouter = Router();

statusRouter.get("/", getAllStatuses);
statusRouter.get("/:id", getStatusById);

export default statusRouter;

