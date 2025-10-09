import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "../../context/authentication";

export function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await loginAdmin(formData);
      
      if (result?.error) {
        // Show error notification
        toast.error("Invalid email or password", {
          description: result.error || "Please check your credentials and try again",
          duration: 5000,
        });
      } else {
        // Success - loginAdmin will handle navigation
        toast.success("Login successful!", {
          description: "Welcome to admin panel",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-[#F9F8F6] flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex justify-center items-center px-4 flex-1">
        <div className="w-full max-w-md">
          <div className="bg-[#efeeeb] rounded-2xl p-6 sm:p-8">
            {/* Admin Panel Label */}
            <div className="text-center mb-4">
              <span className="text-sm text-[#E8A87C] font-medium">Admin panel</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
              Log in
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`bg-white border-gray-300 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`bg-white border-gray-300 ${errors.password ? 'border-red-500' : ''}`}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
}
