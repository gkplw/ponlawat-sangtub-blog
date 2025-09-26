import { supabase } from "../utils/supabase.js";

// CREATE Post
export const createPost = async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body;

    if (!title || !image || !category_id || !description || !content || !status_id) {
      return res.status(400).json({ message: "Server could not create post because there are missing data from client" });
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, image, category_id, description, content, status_id }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Created post successfully",
      post_id: data.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server could not create post because database connection" });
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
