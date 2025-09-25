import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


async function init() {
  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.send("Hell Yeah!!!");
  });

  app.get("/profiles", (req, res) => {
    return res.status(200).json(
        {
            "data":  {
            "name": "john",
            "age": 20
            }
        }
    );
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
