import "dotenv/config";
import express from "express";
import cors from "cors";
import postRouter from "./routes/postRoute.js";
import authRouter from "./routes/authRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import commentRouter from "./routes/commentRoute.js";
import likeRouter from "./routes/likeRoute.js";
import statusRouter from "./routes/statusRoute.js";

async function init() {
  const app = express();
  const port = 4000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/posts", postRouter);
  app.use("/auth", authRouter);
  app.use("/categories", categoryRouter);
  app.use("/comments", commentRouter);
  app.use("/likes", likeRouter);
  app.use("/statuses", statusRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });
  
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

init();
