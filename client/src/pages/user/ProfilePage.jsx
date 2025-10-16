import { useState, useEffect, useRef } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { NavBar } from "../../components/layout/NavBar";
import { UserSidebar } from "../../components/layout/UserSidebar";
import { toast } from "sonner";
import { useAuth } from "../../context/authentication";
import { authAPI } from "../../services/api";

export function ProfilePage() {
  const { state, fetchUser } = useAuth();
  const user = state?.user || {};
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: ""
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
        email: user.email || ""
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

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await authAPI.updateProfile({
        name: formData.name,
        username: formData.username
      });
      
      // Refresh user data
      await fetchUser();
      
      // Show success notification
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
        duration: 5000,
      });
    } catch (error) {
      console.error("Save error:", error);
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
        duration: 5000,
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
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <NavBar variant="user" />
      
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 min-h-0">
        <div className="max-w-6xl mx-auto">
          <div className="hidden sm:flex items-center mb-4 sm:mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
              <img 
                src={user.profile_pic} 
                alt={user.name || user.username} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#75716B]">{user.username}</span>
            <span className="text-xl sm:text-2xl text-gray-400 mx-3">|</span>
            <span className="text-xl sm:text-2xl font-bold text-[#26231E]">Profile</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* UserSidebar - Left side */}
            <div className="sm:w-64 flex-shrink-0">
              <UserSidebar />
            </div>
            
            {/* Profile Card - Right side */}
            <div className="flex-1">
              <div className="bg-[#efeeeb] rounded-2xl p-4 sm:p-8 max-w-lg">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src={user.profile_pic} 
                    alt={user.name || user.username} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  className="px-4 sm:px-6 py-2 rounded-full border-gray-300 text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                  onClick={handleUploadClick}
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

              {/* Form Fields */}
              <div className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300"
                  />
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300"
                    disabled
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 sm:px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}