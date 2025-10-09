import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Image } from "lucide-react";
import { postsAPI, categoriesAPI, statusesAPI } from "../../services/api";
import { useAuth } from "../../context/authentication";

export function CreateArticle() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const fileInputRef = useRef(null);
  
  const [articleData, setArticleData] = useState({
    title: "",
    category_id: "",
    description: "",
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Fetch categories and statuses
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, statusesRes] = await Promise.all([
          categoriesAPI.getAll(),
          statusesAPI.getAll(),
        ]);
        setCategories(categoriesRes.data.categories || []);
        setStatuses(statusesRes.data.statuses || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories and statuses");
      }
    }
    fetchData();
  }, []);

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
      category_id: value
    }));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveArticle = async (isDraft) => {
    // Validation
    if (!articleData.title.trim()) {
      toast.error("Please enter article title");
      return;
    }
    if (!articleData.category_id) {
      toast.error("Please select a category");
      return;
    }
    if (!articleData.description.trim()) {
      toast.error("Please enter article description");
      return;
    }
    if (!articleData.content.trim()) {
      toast.error("Please enter article content");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Find status ID for draft or published
      const statusName = isDraft ? "Draft" : "Published";
      const status = statuses.find(s => s.status === statusName);
      
      if (!status) {
        throw new Error("Status not found");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("title", articleData.title);
      formData.append("category_id", articleData.category_id);
      formData.append("description", articleData.description);
      formData.append("content", articleData.content);
      formData.append("status_id", status.id);
      formData.append("imageFile", imageFile);

      await postsAPI.create(formData);
      
      toast.success(isDraft ? "Article saved as draft" : "Article published", {
        description: isDraft 
          ? "You can publish it later" 
          : "Your article has been successfully published",
        duration: 3000,
      });

      navigate("/admin/articles");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save article", {
        description: error.response?.data?.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => handleSaveArticle(true);
  const handleSaveAndPublish = () => handleSaveArticle(false);

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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center space-x-4">
                <div className="w-100 h-60 bg-[#EFEEEB] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                        <Image />
                      </div>
                      <p className="text-sm text-gray-500">No image selected</p>
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
              <Select value={articleData.category_id?.toString()} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-100 bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (max 200 characters)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Brief description of the article"
                value={articleData.description}
                onChange={handleInputChange}
                maxLength={200}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {articleData.description.length}/200 characters
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
                placeholder="Article content (supports Markdown)"
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
