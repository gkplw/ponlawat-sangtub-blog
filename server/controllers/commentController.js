import { supabase } from "../utils/supabase.js";

// CREATE Comment
export const createComment = async (req, res) => {
  try {
    const { post_id, comment_text } = req.body;
    const user_id = req.user.id; // จาก middleware protectUser

    if (!post_id || !comment_text) {
      return res.status(400).json({ message: "Post ID and comment text are required" });
    }

    // ตรวจสอบว่า post มีอยู่จริงหรือไม่
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", post_id)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({ 
        post_id, 
        user_id, 
        comment_text 
      })
      .select(`
        *,
        users:user_id (
          id,
          username,
          name,
          profile_pic
        )
      `)
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Created comment successfully",
      comment: data,
    });
  } catch (error) {
    console.error("Error in createComment:", error);
    return res.status(500).json({ 
      message: "Server could not create comment",
      error: error.message 
    });
  }
};

// READ Comments by Post ID
export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
      .from("comments")
      .select(`
        *,
        users:user_id (
          id,
          username,
          name,
          profile_pic
        )
      `, { count: "exact" })
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      comments: data,
      totalComments: count,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error in getCommentsByPostId:", error);
    return res.status(500).json({ 
      message: "Server could not fetch comments",
      error: error.message 
    });
  }
};

// UPDATE Comment by ID
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment_text } = req.body;
    const user_id = req.user.id;

    if (!comment_text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // ตรวจสอบว่า comment เป็นของ user คนนี้หรือไม่
    const { data: existingComment, error: checkError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (checkError || !existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existingComment.user_id !== user_id) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    const { data, error } = await supabase
      .from("comments")
      .update({ comment_text })
      .eq("id", id)
      .select(`
        *,
        users:user_id (
          id,
          username,
          name,
          profile_pic
        )
      `)
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Updated comment successfully",
      comment: data,
    });
  } catch (error) {
    console.error("Error in updateComment:", error);
    return res.status(500).json({ 
      message: "Server could not update comment",
      error: error.message 
    });
  }
};

// DELETE Comment by ID
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    // ตรวจสอบว่า comment มีอยู่และเป็นของ user คนนี้หรือ admin
    const { data: existingComment, error: checkError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (checkError || !existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // User สามารถลบ comment ของตัวเองได้ หรือ admin ลบได้ทั้งหมด
    if (existingComment.user_id !== user_id && user_role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.status(200).json({ message: "Deleted comment successfully" });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return res.status(500).json({ 
      message: "Server could not delete comment",
      error: error.message 
    });
  }
};

