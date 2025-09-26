import { supabase } from "../utils/supabase.js";

// Protect user
export const protectUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    try {
      // ใช้ Supabase ตรวจสอบ token และดึงข้อมูลผู้ใช้
      const { data, error } = await supabase.auth.getUser(token);
  
      if (error || !data.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      // แนบข้อมูลผู้ใช้เข้ากับ request object
      req.user = { ...data.user };
  
      // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
      next();
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
};

// Protect admin
export const protectAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    try {
      // ใช้ Supabase ดึงข้อมูลผู้ใช้จาก token
      const { data, error } = await supabase.auth.getUser(token);
  
      if (error || !data.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      // ดึง user ID จากข้อมูลผู้ใช้ Supabase
      const supabaseUserId = data.user.id;
  
      // ดึงข้อมูล role ของผู้ใช้จากฐานข้อมูล PostgreSQL
      const values = [supabaseUserId];
      const { data: userData, error: dbError } = await supabase.from("users").select("role").eq("id", supabaseUserId).single();
  
      if (error || !userData) {
        return res.status(404).json({ error: "User role not found" });
      }
      if (dbError) {
        return res.status(404).json({ error: "User role not found" });
      }
  
      // แนบข้อมูลผู้ใช้พร้อม role เข้ากับ request object
      req.user = { ...data.user, role: userData.role };
  
      // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: You do not have admin access" });
      }
  
      // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
      next();
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
