import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../../context/authentication";
import { authAPI } from "../../services/api";

export function AdminProfile() {
  const { state, fetchUser } = useAuth();
  const user = state?.user || {};
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await authAPI.updateProfile({
        name: formData.name,
        username: formData.username,
        bio: formData.bio
      });
      
      // Refresh user data
      await fetchUser();
      
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
        duration: 3000,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await authAPI.uploadProfilePicture(file);
      await fetchUser();
      toast.success("Uploaded profile picture", {
        description: "Your profile picture has been updated",
        duration: 3000,
      });
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to upload";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Profile Form */}
      <div className="bg-[#F9F8F6] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={user.profile_pic}
                alt={user.name || user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              onClick={handleUploadClick}
              variant="outline"
              className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload profile picture"}
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-100 bg-white border-gray-300"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="w-100 bg-white border-gray-300"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-100 bg-white border-gray-300"
              disabled
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio (max 300 letters)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={6}
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={300}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.bio.length}/300 characters
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
