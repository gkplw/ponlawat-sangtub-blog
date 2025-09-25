import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

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

  app.post("/posts", async (req, res) => {
    try {
      const { title, image, category_id, description, content, status_id } =
        req.body;
  
      // ตรวจสอบ input
      if (!title || !image || !category_id || !description || !content || !status_id) {
        return res.status(400).json({
          message:
            "Server could not create post because there are missing data from client",
        });
      }
  
      // SQL Insert
      const query = `
        INSERT INTO posts (title, image, category_id, description, content, status_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;
  
      const values = [title, image, category_id, description, content, status_id];
  
      const result = await connectionPool.query(query, values);
  
      return res.status(201).json({
        message: "Created post sucessfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server could not create post because database connection",
      });
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
