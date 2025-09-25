import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

async function init() {
  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());

// ✅ CREATE Post
app.post("/posts", async (req, res) => {
    try {
      const { title, image, category_id, description, content, status_id } = req.body;
  
      if (!title || !image || !category_id || !description || !content || !status_id) {
        return res.status(400).json({
          message: "Server could not create post because there are missing data from client",
        });
      }
  
      const query = `
        INSERT INTO posts (title, image, category_id, description, content, status_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;
      const values = [title, image, category_id, description, content, status_id];
  
      const result = await connectionPool.query(query, values);
  
      return res.status(201).json({
        message: "Created post sucessfully",
        post_id: result.rows[0].id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server could not create post because database connection",
      });
    }
  });
  
  // ✅ READ Post by ID
  app.get("/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const query = `SELECT * FROM posts WHERE id = $1`;
      const result = await connectionPool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Server could not find a requested post" });
      }
  
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server could not read post because database connection" });
    }
  });
  
  // ✅ UPDATE Post by ID
  app.put("/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, image, category_id, description, content, status_id } = req.body;
  
      const query = `
        UPDATE posts
        SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6
        WHERE id = $7
        RETURNING *;
      `;
      const values = [title, image, category_id, description, content, status_id, id];
  
      const result = await connectionPool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Server could not find a requested post to update" });
      }
  
      return res.status(200).json({ message: "Updated post successfully", post: result.rows[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server could not update post because database connection" });
    }
  });
  
  // ✅ DELETE Post by ID
  app.delete("/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const query = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
      const result = await connectionPool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Server could not find a requested post to delete" });
      }
  
      return res.status(200).json({ message: "Deleted post successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server could not delete post because database connection" });
    }
  });

  // ✅ READ All Posts (with pagination, filter, search)
app.get("/posts", async (req, res) => {
    try {
      // ดึง query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const category = req.query.category;
      const keyword = req.query.keyword;
  
      const offset = (page - 1) * limit;
  
      // เงื่อนไข dynamic filter
      let whereClauses = [];
      let values = [];
  
      if (category) {
        values.push(category);
        whereClauses.push(`category_id = $${values.length}`);
      }
  
      if (keyword) {
        values.push(`%${keyword}%`);
        whereClauses.push(
          `(title ILIKE $${values.length} OR description ILIKE $${values.length} OR content ILIKE $${values.length})`
        );
      }
  
      const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  
      // นับจำนวนทั้งหมด
      const countQuery = `SELECT COUNT(*) FROM posts ${whereSQL}`;
      const countResult = await connectionPool.query(countQuery, values);
      const totalPosts = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalPosts / limit);
  
      // ดึง posts ตาม pagination
      const postsQuery = `
        SELECT * FROM posts
        ${whereSQL}
        ORDER BY id ASC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2};
      `;
      const postsValues = [...values, limit, offset];
      const postsResult = await connectionPool.query(postsQuery, postsValues);
  
      res.status(200).json({
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
        posts: postsResult.rows,
        nextPage: page < totalPages ? page + 1 : null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server could not fetch posts because database connection" });
    }
  });
  

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
