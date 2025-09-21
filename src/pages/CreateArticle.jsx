import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Image } from "lucide-react";

export function CreateArticle() {
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({
    title: "",
    category: "",
    authorName: "Thompson P.",
    introduction: "",
    content: "",
    thumbnailImage: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Cat", "General", "Inspiration"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setArticleData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleImageUpload = () => {
    // In a real app, this would open file picker
    toast.info("Upload feature", {
      description: "Image upload functionality would be implemented here",
      duration: 3000,
    });
  };

  const handleSaveAsDraft = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Create article and saved as draft", {
        description: "You can publish article later",
        duration: 3000,
      });
    } catch (error) {
      console.error("Save draft error:", error);
      toast.error("Save failed", {
        description: "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Create article and published", {
        description: "Your article has been successfully published",
        duration: 3000,
      });
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Publish failed", {
        description: "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = () => {
    // Reset form
    setArticleData({
      title: "",
      category: "",
      authorName: "Thompson P.",
      introduction: "",
      content: "",
      thumbnailImage: null
    });
    
    toast.success("Article deleted", {
      description: "Article has been removed",
      duration: 3000,
    });
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen flex">
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create article</h1>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
              variant="outline"
              className="px-8 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              {isSubmitting ? "Saving..." : "Save as draft"}
            </Button>
            <Button
              onClick={handleSaveAndPublish}
              disabled={isSubmitting}
              className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              {isSubmitting ? "Publishing..." : "Save and publish"}
            </Button>
          </div>
        </div>

        {/* Article Form */}
        <div className="bg-[#F9F8F6] p-6">
          <form className="space-y-6">
            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail image
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-100 h-60 bg-[#EFEEEB] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {articleData.thumbnailImage ? (
                    <img 
                      src={articleData.thumbnailImage} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                        <Image />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  variant="outline"
                  className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  Upload thumbnail image
                </Button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={articleData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-100 bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author Name */}
            <div>
              <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                Author name
              </label>
              <Input
                id="authorName"
                name="authorName"
                type="text"
                value={articleData.authorName}
                onChange={handleInputChange}
                className="w-100 bg-[#EFEEEB] border-gray-300"
                readOnly
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Article title"
                value={articleData.title}
                onChange={handleInputChange}
                className="bg-white border-gray-300"
              />
            </div>

            {/* Introduction */}
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-2">
                Introduction (max 120 letters)
              </label>
              <textarea
                id="introduction"
                name="introduction"
                rows={4}
                placeholder="Introduction"
                value={articleData.introduction}
                onChange={handleInputChange}
                maxLength={120}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {articleData.introduction.length}/120 characters
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                placeholder="Content"
                value={articleData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
