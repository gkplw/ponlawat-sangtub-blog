import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import authorImage from "@/assets/author-image.jpg";

export function AdminProfile() {
  const [profileData, setProfileData] = useState({
    name: "Thompson P.",
    username: "thompson",
    email: "thompson.p@gmail.com",
    bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.\n\nWhen I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes."
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
        duration: 3000,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Update failed", {
        description: "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadImage = () => {
    // In a real app, this would open file picker
    toast.info("Upload feature", {
      description: "Image upload functionality would be implemented here",
      duration: 3000,
    });
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Profile Form */}
      <div className="bg-[#F9F8F6] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={authorImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                No Image
              </div>
            </div>
            <Button
              type="button"
              onClick={handleUploadImage}
              variant="outline"
              className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Upload profile picture
            </Button>
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
              value={profileData.name}
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
              value={profileData.username}
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
              value={profileData.email}
              onChange={handleInputChange}
              className="w-100 bg-white border-gray-300"
              disabled
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio (max 120 letters)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={6}
              value={profileData.bio}
              onChange={handleInputChange}
              maxLength={120}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {profileData.bio.length}/120 characters
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
