import { supabase } from "../utils/supabase.js";

// TOGGLE Like (Like/Unlike)
export const toggleLike = async (req, res) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id; // จาก middleware protectUser

    if (!post_id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // ตรวจสอบว่า post มีอยู่จริงหรือไม่
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, likes_count")
      .eq("id", post_id)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ตรวจสอบว่า user ได้ like post นี้แล้วหรือยัง
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", post_id)
      .eq("user_id", user_id)
      .single();

    if (existingLike) {
      // Unlike: ลบ like และลด likes_count
      const { error: deleteLikeError } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteLikeError) throw deleteLikeError;

      // อัปเดต likes_count ใน posts table
      const newLikesCount = Math.max(0, (post.likes_count || 0) - 1);
      const { error: updatePostError } = await supabase
        .from("posts")
        .update({ likes_count: newLikesCount })
        .eq("id", post_id);

      if (updatePostError) throw updatePostError;

      return res.status(200).json({
        message: "Unliked post successfully",
        isLiked: false,
        likes_count: newLikesCount,
      });
    } else {
      // Like: เพิ่ม like และเพิ่ม likes_count
      const { error: insertLikeError } = await supabase
        .from("likes")
        .insert({ post_id, user_id });

      if (insertLikeError) throw insertLikeError;

      // อัปเดต likes_count ใน posts table
      const newLikesCount = (post.likes_count || 0) + 1;
      const { error: updatePostError } = await supabase
        .from("posts")
        .update({ likes_count: newLikesCount })
        .eq("id", post_id);

      if (updatePostError) throw updatePostError;

      return res.status(201).json({
        message: "Liked post successfully",
        isLiked: true,
        likes_count: newLikesCount,
      });
    }
  } catch (error) {
    console.error("Error in toggleLike:", error);
    return res.status(500).json({ 
      message: "Server could not process like",
      error: error.message 
    });
  }
};

// CHECK if user liked a post
export const checkUserLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const user_id = req.user.id;

    const { data: like, error } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user_id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return res.status(200).json({
      isLiked: !!like,
    });
  } catch (error) {
    console.error("Error in checkUserLike:", error);
    return res.status(500).json({ 
      message: "Server could not check like status",
      error: error.message 
    });
  }
};

// GET all likes by user
export const getUserLikes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
      .from("likes")
      .select(`
        *,
        posts:post_id (
          id,
          title,
          image,
          category_id,
          description
        )
      `, { count: "exact" })
      .eq("user_id", user_id)
      .order("liked_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      likes: data,
      totalLikes: count,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error in getUserLikes:", error);
    return res.status(500).json({ 
      message: "Server could not fetch user likes",
      error: error.message 
    });
  }
};

