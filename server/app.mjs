import "dotenv/config";
import express from "express";
import cors from "cors";
import postRouter from "./routes/postRoute.js";
import authRouter from "./routes/authRoute.js";

async function init() {
  const app = express();
  const port = 4000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/posts", postRouter);
  app.use("/auth", authRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });
  
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

init();
