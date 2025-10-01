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

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Email must be a valid email" });
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
  
      return res.status(200).json({
        message: "Login successful",
        session: data.session,
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



