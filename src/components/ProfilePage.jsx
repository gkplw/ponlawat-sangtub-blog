import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavBar } from "./NavBar";
import { UserSidebar } from "./UserSidebar";
import { toast } from "sonner";

export function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "Moodeng ja",
    username: "moodeng.cute",
    email: "moodeng.cute@gmail.com"
  });

  const [isSaving, setIsSaving] = useState(false);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
        duration: 5000,
      });
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <NavBar variant="user" />
      
      <div className="flex flex-col sm:flex-row flex-1">
        <UserSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 min-h-0">
          <div className="max-w-4xl">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Profile</h1>
            
            {/* Profile Card */}
            <div className="bg-[#efeeeb] rounded-2xl p-4 sm:p-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=100&h=100&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  className="px-4 sm:px-6 py-2 border-gray-300 text-gray-800 hover:bg-gray-50 text-sm sm:text-base"
                >
                  Upload profile picture
                </Button>
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
        </main>
      </div>
    </div>
  );
}
