import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { NavBar } from "../components/layout/NavBar";
import { UserSidebar } from "../components/layout/UserSidebar";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isResetting, setIsResetting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!formData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
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

  const handleResetClick = () => {
    if (!validateForm()) {
      return;
    }
    setShowModal(true);
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    setShowModal(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification
      toast.success("Password reset successfully", {
        description: "Your password has been updated",
        duration: 5000,
      });
      
      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
      setErrors({});
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <NavBar variant="user" />
      
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 min-h-0">
        <div className="max-w-6xl mx-auto">
          <div className="hidden sm:flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3">
              <img 
                src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=100&h=100&fit=crop&crop=face" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#75716B]">Moodeng ja</span>
            <span className="text-xl sm:text-2xl text-gray-400 mx-3">|</span>
            <span className="text-xl sm:text-2xl font-bold text-[#26231E]">Reset password</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* UserSidebar - Left side */}
            <div className="sm:w-64 flex-shrink-0">
              <UserSidebar />
            </div>
            
            {/* Password Reset Card - Right side */}
            <div className="flex-1">
              <div className="bg-[#efeeeb] rounded-2xl p-4 sm:p-8 max-w-lg">
              <div className="space-y-4 sm:space-y-6">
                {/* Current Password Field */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-2">
                    Current password
                  </label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`bg-white border-gray-300 ${errors.currentPassword ? 'border-red-500' : ''}`}
                    placeholder="Current password"
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-2">
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`bg-white border-gray-300 ${errors.newPassword ? 'border-red-500' : ''}`}
                    placeholder="New password"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-600 mb-2">
                    Confirm new password
                  </label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    className={`bg-white border-gray-300 ${errors.confirmNewPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmNewPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Button
                  onClick={handleResetClick}
                  disabled={isResetting}
                  className="px-6 sm:px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  {isResetting ? "Resetting..." : "Reset password"}
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset password"
        message="Do you want to reset your password?"
        confirmText="Reset"
        cancelText="Cancel"
      />
    </div>
  );
}
