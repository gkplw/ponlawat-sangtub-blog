import { supabase } from "../utils/supabase.js";

// CREATE Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // ตรวจสอบว่ามี category ชื่อนี้อยู่แล้วหรือไม่
    const { data: existingCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("name", name)
      .single();

    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Created category successfully",
      category: data,
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({ 
      message: "Server could not create category",
      error: error.message 
    });
  }
};

// READ All Categories
export const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      categories: data,
      total: data.length,
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return res.status(500).json({ 
      message: "Server could not fetch categories",
      error: error.message 
    });
  }
};

// READ Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Category not found" });
      }
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return res.status(500).json({ 
      message: "Server could not fetch category",
      error: error.message 
    });
  }
};

// UPDATE Category by ID
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // ตรวจสอบว่ามี category ชื่อนี้อยู่แล้วหรือไม่ (ยกเว้น category ปัจจุบัน)
    const { data: existingCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("name", name)
      .neq("id", id)
      .single();

    if (existingCategory) {
      return res.status(409).json({ message: "Category name already exists" });
    }

    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Category not found" });
      }
      throw error;
    }

    return res.status(200).json({
      message: "Updated category successfully",
      category: data,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return res.status(500).json({ 
      message: "Server could not update category",
      error: error.message 
    });
  }
};

// DELETE Category by ID
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามี posts ที่ใช้ category นี้อยู่หรือไม่
    const { data: postsWithCategory, error: checkError } = await supabase
      .from("posts")
      .select("id")
      .eq("category_id", id)
      .limit(1);

    if (checkError) throw checkError;

    if (postsWithCategory && postsWithCategory.length > 0) {
      return res.status(409).json({ 
        message: "Cannot delete category that is being used by posts" 
      });
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Category not found" });
      }
      throw error;
    }

    return res.status(200).json({ message: "Deleted category successfully" });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({ 
      message: "Server could not delete category",
      error: error.message 
    });
  }
};

