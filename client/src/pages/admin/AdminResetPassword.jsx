import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { toast } from "sonner";

export function AdminResetPassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast.success("Password reset successfully", {
        description: "Your password has been updated",
        duration: 3000,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Password reset failed", {
        description: "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reset password</h1>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </div>

      {/* Reset Password Form */}
      <div className="bg-[#F9F8F6] p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current password
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`bg-white border-gray-300 ${errors.currentPassword ? 'border-red-500' : ''}`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`bg-white border-gray-300 ${errors.newPassword ? 'border-red-500' : ''}`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`bg-white border-gray-300 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset password"
        message="Do you want to reset your password?"
        confirmText="Reset"
        cancelText="Cancel"
      />
    </div>
  );
}
