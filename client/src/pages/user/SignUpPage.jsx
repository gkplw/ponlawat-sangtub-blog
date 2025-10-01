import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { NavBar } from "../../components/layout/NavBar";
import { useAuth } from "../../context/authentication";
import { toast } from "sonner";

export function SignUpPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email must be a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    const result = await register(formData);
    
    if (result?.error) {
      // Show specific error notification
      toast.error(result.error, {
        description: result.description || "Please try again",
        duration: 5000,
      });
    } else {
      // Success case
      window.location.href = "/signup-success";
    }
  } catch (error) {
    console.error("Sign up error:", error);
    toast.error("Sign up failed", {
      description: "Please try again later",
      duration: 5000,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <NavBar />

      {/* Main Content */}
      <main className="flex justify-center px-4 mt-6 sm:mt-12 flex-1">
        <div className="w-full max-w-md">
          <div className="bg-[#efeeeb] rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
              Sign up
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`bg-white border-gray-300 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`bg-white border-gray-300 ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
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
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-gray-800 underline hover:text-gray-600">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
