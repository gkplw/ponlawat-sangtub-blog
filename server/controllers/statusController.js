import { supabase } from "../utils/supabase.js";

// GET All Statuses
export const getAllStatuses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("statuses")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      statuses: data,
      total: data.length,
    });
  } catch (error) {
    console.error("Error in getAllStatuses:", error);
    return res.status(500).json({ 
      message: "Server could not fetch statuses",
      error: error.message 
    });
  }
};

// GET Status by ID
export const getStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("statuses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Status not found" });
      }
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getStatusById:", error);
    return res.status(500).json({ 
      message: "Server could not fetch status",
      error: error.message 
    });
  }
};

