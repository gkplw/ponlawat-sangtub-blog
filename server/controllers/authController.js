import { supabase } from "../utils/supabase.js";
import validateEmail from "../utils/validateEmail.js";

//User Controller
// Register user
export const register = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!name || !username) {
      return res.status(400).json({ error: "Name and username are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Email must be a valid email" });
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUser) {
      return res.status(409).json({ 
        error: "Username already exists", 
        message: "Please choose a different username."
      });
    }

    // ถ้า checkError เป็น "PGRST116" แปลว่าไม่มี record ซ้ำ (ปกติ)
    // ถ้าเป็น error อื่นๆ ให้ return error
    if (checkError && checkError.code !== "PGRST116") {
      console.error("Username check error:", checkError);
      return res.status(500).json({ 
        error: "Failed to validate username", 
        message: "Please try again later."
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes("User already registered")) {
        return res.status(409).json({ 
          error: "Email already exists", 
          message: "Please use a different email or try logging in."
        });
      }
      if (error.message.includes("Password should be at least")) {
        return res.status(400).json({ 
          error: "Weak password", 
          message: "Password should be at least 6 characters long."
        });
      }
      // Generic error for other cases
      return res.status(400).json({ 
        error: "Registration failed", 
        message: error.message 
      });
    }

    const userId = data.user.id;
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ id: userId, name, username, role: "user" }]);

    if (insertError) {
      console.error("Insert error:", insertError);
      
      // ตรวจสอบว่าเป็น error เรื่อง username ซ้ำหรือไม่
      if (insertError.code === "23505" && insertError.message.includes("username")) {
        // ลบ user ที่สร้างไปแล้วใน Supabase auth
        try {
          await supabase.auth.admin.deleteUser(userId);
        } catch (deleteError) {
          console.error("Failed to cleanup user:", deleteError);
        }
        
        return res.status(409).json({ 
          error: "Username already exists", 
          message: "Please choose a different username."
        });
      }
      
      return res.status(500).json({ 
        error: "Failed to create user profile", 
        message: "Registration completed but failed to create user profile."
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: userId, name, username },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      error: "Failed to register user", 
      message: "Something went wrong. Please try again later."
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Email must be a valid email" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: "Invalid credentials" });

    return res.status(200).json({
      message: "Login successful",
      access_token: data.session.access_token,
      user: data.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to login" });
  }
};

// Get user
export const getUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Fetched user successfully",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, username } = req.body;
    const userId = req.user.id;

    if (!name && !username) {
      return res.status(400).json({ error: "At least one field (name or username) is required" });
    }

    // Check if username is already taken by another user
    if (username) {
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .neq("id", userId)
        .single();

      if (existingUser) {
        return res.status(409).json({ 
          error: "Username already exists", 
          message: "Please choose a different username." 
        });
      }

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Username check error:", checkError);
        return res.status(500).json({ 
          error: "Failed to validate username", 
          message: "Please try again later." 
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;

    // Update user profile
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ 
        error: "Failed to update profile", 
        message: "Please try again later." 
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: { ...req.user, ...data },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({ 
      error: "Failed to update profile", 
      message: "Please try again later." 
    });
  }
};

// Reset Password user
export const resetPassword = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
    const { oldPassword, newPassword } = req.body;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
  
    try {
      // ตั้งค่า session ด้วย token ที่ส่งมา
      const { data: userData, error: userError } = await supabase.auth.getUser(
        token
      );
  
      if (userError) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: userData.user.email,
          password: oldPassword,
        });
  
      if (loginError) {
        return res.status(400).json({ error: "Invalid old password" });
      }
  
      // อัปเดตรหัสผ่านของผู้ใช้
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json({
        message: "Password updated successfully",
        user: data.user,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
// Logout user
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to logout" });
  }
};

// ------------------------------------------------------------------------------------------

// Admin Controller
// Get admin
export const getAdmin = async (req, res) => {
    try {
      return res.status(200).json({
        message: "Fetched admin successfully",
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch admin" });
    }
  };

// Login admin
export const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Email must be a valid email" });
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) return res.status(401).json({ error: "Invalid credentials" });

      // ตรวจสอบว่าเป็น admin หรือไม่
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError || !userData || userData.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
  
      return res.status(200).json({
        message: "Admin login successful",
        access_token: data.session.access_token,
        user: data.user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to login" });
    }
  };

  // Reset Password admin
  export const resetPasswordAdmin = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
    const { oldPassword, newPassword } = req.body;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
  
    try {
      // ตั้งค่า session ด้วย token ที่ส่งมา
      const { data: userData, error: userError } = await supabase.auth.getUser(
        token
      );
  
      if (userError) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: userData.user.email,
          password: oldPassword,
        });
  
      if (loginError) {
        return res.status(400).json({ error: "Invalid old password" });
      }
  
      // อัปเดตรหัสผ่านของผู้ใช้
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json({
        message: "Password updated successfully",
        user: data.user,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

// Logout admin
export const logoutAdmin = async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to logout" });
    }
  };



