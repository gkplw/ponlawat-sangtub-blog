import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Image, Trash2 } from "lucide-react";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import authorImage from "@/assets/author-image.jpg";

export function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [articleData, setArticleData] = useState({
    title: "",
    category: "",
    authorName: "Thompson P.",
    introduction: "",
    content: "",
    thumbnailImage: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const categories = ["Cat", "General", "Inspiration"];

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    // Simulate fetching article data
    const mockArticles = {
      1: {
        title: "The Fascinating World of Cats: Why We Love Our Furry Friends",
        category: "Cat",
        authorName: "Thompson P.",
        introduction: "Cats have captivated human hearts for thousands of years. Whether lounging in a sunny spot or playfully chasing a string, these furry companions bring warmth and joy to millions of homes. But what makes cats so special? Let's dive into the unique traits, behaviors, and quirks that make cats endlessly fascinating.",
        content: "1. Independent Yet Affectionate\n\nOne of the most remarkable traits of cats is their balance between independence and affection. Unlike dogs, who are often eager for constant attention, cats enjoy their alone time. They can spend hours grooming themselves, exploring the house, or napping in quiet corners. However, when they want affection, they know how to seek it out with a soft purr, a gentle nuzzle, or by curling up on your lap.\n\nThis quality makes cats appealing to many people who appreciate the fact that their feline companions are low-maintenance but still loving. It's like having a roommate who enjoys your company but doesn't demand too much of your time!\n\n2. Playful Personalities\n\nCats are naturally curious and playful. From kittens to adults, they enjoy engaging with toys, climbing furniture, or chasing after imaginary prey. Their play often mimics hunting behavior, which is a nod to their wild ancestors. Whether they're pouncing on a feather or chasing across the room after a laser pointer, their agility and energy are mesmerizing to watch.\n\nThis playfulness also serves as mental stimulation for cats. Providing toys and opportunities to climb or explore helps them stay active and reduces boredom, which is important for indoor cats.\n\n3. Communication Through Body Language\n\nCats are master communicators, though they do so in subtle ways. Understanding a cat's body language can deepen the bond between you and your pet. Here are some common signals:\n\nPurring: Usually a sign of contentment, though cats may also purr when anxious or in pain.",
        thumbnailImage: authorImage
      }
    };

    if (mockArticles[id]) {
      setArticleData(mockArticles[id]);
    }
  }, [id]);

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
      
      // Navigate back to articles list
      navigate("/admin/articles");
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

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteArticle = () => {
    setShowDeleteModal(false);
    toast.success("Article deleted", {
      description: "Article has been removed",
      duration: 3000,
    });
    navigate("/admin/articles");
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
              {isSubmitting ? "Publishing..." : "Save"}
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
