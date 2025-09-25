import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./routes/postRoute.js";

async function init() {
  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());
  
  app.use("/posts", postRouter);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
