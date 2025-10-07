import { supabase } from "../utils/supabase.js";
import multer from "multer";

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
const multerUpload = multer({ storage: multer.memoryStorage() });

// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
export const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

// CREATE Post
export const createPost = async (req, res) => {
  try {
    const { title, category_id, description, content, status_id } = req.body;

    // ตรวจสอบว่ามีไฟล์ที่อัปโหลดมาหรือไม่
    if (!req.files || !req.files.imageFile || !req.files.imageFile[0]) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!title || !category_id || !description || !content || !status_id) {
      return res.status(400).json({ message: "Server could not create post because there are missing data from client" });
    }

     // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
     const newPost = req.body;
     const file = req.files.imageFile[0];
 
     // 2) กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
     const bucketName = "personal-blog";
     const filePath = `posts/${Date.now()}_${file.originalname}`; // สร้าง path ที่ไม่ซ้ำกัน
 
     // 3) อัปโหลดไฟล์ไปยัง Supabase Storage
     const { data: uploadData, error: uploadError } = await supabase.storage
       .from(bucketName)
       .upload(filePath, file.buffer, {
         contentType: file.mimetype,
         upsert: false, // ป้องกันการเขียนทับไฟล์เดิม
       });
 
     if (uploadError) {
       console.error("Upload error:", uploadError);
       throw uploadError;
     }
 
     // 4) ดึง URL สาธารณะของไฟล์ที่อัปโหลด
     const {
       data: { publicUrl },
     } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);
 
     // 5) บันทึกข้อมูลโพสต์ลงในฐานข้อมูล
     const { data: insertedPost, error: insertError } = await supabase
       .from("posts")
       .insert({
         title: newPost.title,
         image: publicUrl, // เก็บ URL ของรูปภาพ
         category_id: parseInt(newPost.category_id),
         description: newPost.description,
         content: newPost.content,
         status_id: parseInt(newPost.status_id),
       })
       .select()
       .single();
 
     if (insertError) {
       console.error("Insert error:", insertError);
       throw insertError;
     }

    return res.status(201).json({
      message: "Created post successfully",
      post: insertedPost,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    return res.status(500).json({ 
      message: "Server could not create post because database connection",
      error: error.message 
    });
  }
};

// READ Post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Server could not find a requested post" });
      }
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server could not read post because database connection" });
  }
};

// UPDATE Post by ID
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;

    const { data, error } = await supabase
      .from("posts")
      .update({ title, image, category_id, description, content, status_id })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Server could not find a requested post to update" });
      }
      throw error;
    }

    return res.status(200).json({
      message: "Updated post successfully",
      post: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server could not update post because database connection" });
  }
};

// DELETE Post by ID
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Server could not find a requested post to delete" });
      }
      throw error;
    }

    return res.status(200).json({ message: "Deleted post successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server could not delete post because database connection" });
  }
};

// READ All Posts (with pagination, filter, search)
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const keyword = req.query.keyword;

    const offset = (page - 1) * limit;

    let query = supabase.from("posts").select("*", { count: "exact" });

    if (category) {
      query = query.eq("category_id", category);
    }

    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`
      );
    }

    const { data: posts, count, error } = await query
      .order("id", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      totalPosts: count,
      totalPages,
      currentPage: page,
      limit,
      posts,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server could not fetch posts because database connection" });
  }
};
