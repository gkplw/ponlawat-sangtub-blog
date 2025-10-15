import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Image, Trash2 } from "lucide-react";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { postsAPI, categoriesAPI, statusesAPI } from "../../services/api";
import { LoadingScreen } from "../../components/common/LoadingScreen";

export function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const [articleData, setArticleData] = useState({
    title: "",
    category_id: "",
    description: "",
    content: "",
    image: "",
    status_id: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Fetch categories, statuses, and article data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoriesRes, statusesRes, articleRes] = await Promise.all([
          categoriesAPI.getAll(),
          statusesAPI.getAll(),
          postsAPI.getById(id),
        ]);
        
        setCategories(categoriesRes.data.categories || []);
        setStatuses(statusesRes.data.statuses || []);
        
        const article = articleRes.data;
        setArticleData({
          title: article.title || "",
          category_id: article.category_id || "",
          description: article.description || "",
          content: article.content || "",
          image: article.image || "",
          status_id: article.status_id || "",
        });
        setImagePreview(article.image);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load article data");
        navigate("/admin/articles");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, navigate]);

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
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
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

    setIsSubmitting(true);
    
    try {
      // Update article data (without image for now)
      await postsAPI.update(id, {
        title: articleData.title,
        image: articleData.image, // Keep existing image URL
        category_id: parseInt(articleData.category_id),
        description: articleData.description,
        content: articleData.content,
        status_id: parseInt(articleData.status_id),
      });
      
      toast.success("Article updated", {
        description: "Your article has been successfully updated",
        duration: 3000,
      });
      
      navigate("/admin/articles");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update article", {
        description: error.response?.data?.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteArticle = async () => {
    try {
      await postsAPI.delete(id);
      setShowDeleteModal(false);
      toast.success("Article deleted", {
        description: "Article has been removed",
        duration: 3000,
      });
      navigate("/admin/articles");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit article</h1>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save"}
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
                      <p className="text-sm text-gray-500">No image</p>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  variant="outline"
                  className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  Change thumbnail image
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

            {/* Delete Article Button */}
            <div>
              <button
                type="button"
                onClick={openDeleteModal}
                className="flex items-center space-x-2 text-[#26231E] hover:text-red-600 underline cursor-pointer transition-colors bg-transparent border-none p-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete article</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteArticle}
        title="Delete article"
        message="Do you want to delete this article?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
