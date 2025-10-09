import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้โดยใช้ API service
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      
      const response = await authAPI.getUser();
      
      setState((prevState) => ({
        ...prevState,
        user: response.data.user,
        getUserLoading: false,
      }));
      
    } catch (error) {
      console.error("Fetch user error:", error);
      
      // ถ้าเป็น 401 error ให้ล้าง token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setState((prevState) => ({
          ...prevState,
          user: null,
          getUserLoading: false,
        }));
        return;
      }

      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มต้น
  }, []);

  // ล็อกอินผู้ใช้
  const login = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await authAPI.login(data);
      
      const token = response.data.access_token;
      
      if (!token) {
        console.error("No access token in response:", response.data);
        throw new Error("No access token received");
      }
      
      localStorage.setItem("token", token);

      // ดึงและตั้งค่าข้อมูลผู้ใช้
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      await fetchUser();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  // ล็อกอิน Admin
  const loginAdmin = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await authAPI.loginAdmin(data);
      
      const token = response.data.access_token;
      
      if (!token) {
        console.error("No access token in response:", response.data);
        throw new Error("No access token received");
      }
      
      localStorage.setItem("token", token);

      // ดึงและตั้งค่าข้อมูล admin
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      await fetchUser();
      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  // ลงทะเบียนผู้ใช้
  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await authAPI.register(data);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      
      let errorMessage = "Registration failed";
      let errorDescription = "Please try again later";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        errorDescription = error.response.data.message || errorMessage;
      }

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      
      return { 
        error: errorMessage,
        description: errorDescription
      };
    }
  };

  // ล็อกเอาท์ผู้ใช้
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        // ตรวจสอบ role เพื่อเรียก endpoint ที่ถูกต้อง
        if (state.user?.role === 'admin') {
          await authAPI.logoutAdmin();
        } else {
          await authAPI.logout();
        }
      }
    } catch (error) {
      console.error("Logout API error:", error);
      // ถึงแม้ API จะ error ก็ยังต้อง logout ฝั่ง client
    } finally {
      // ล้าง token และ state ทุกกรณี
      localStorage.removeItem("token");
      setState({ user: null, error: null, loading: null, getUserLoading: false });
      navigate("/");
    }
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        loginAdmin,
        logout,
        register,
        isAuthenticated,
        fetchUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับใช้งาน AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };

