import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { toast } from "sonner";
import { postsAPI, categoriesAPI, statusesAPI } from "../../services/api";

export function ArticleManagement() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch categories and statuses on mount
  useEffect(() => {
    async function fetchFilters() {
      try {
        const [categoriesRes, statusesRes] = await Promise.all([
          categoriesAPI.getAll(),
          statusesAPI.getAll(),
        ]);
        setCategories(categoriesRes.data.categories || []);
        setStatuses(statusesRes.data.statuses || []);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    }
    fetchFilters();
  }, []);

  // Fetch articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const response = await postsAPI.getAll({
          ...(searchTerm && { keyword: searchTerm }),
          ...(categoryFilter !== "all" && { category: categoryFilter }),
          ...(statusFilter !== "all" && { status: statusFilter }),
          limit: 100, // Get all for admin
        });
        setArticles(response.data.posts || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [searchTerm, categoryFilter, statusFilter]);

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      await postsAPI.delete(selectedArticle.id);
      setArticles(articles.filter(article => article.id !== selectedArticle.id));
      setShowDeleteModal(false);
      setSelectedArticle(null);
      
      toast.success("Delete article", {
        description: "Article has been successfully deleted.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const openDeleteModal = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const handleCreateArticle = () => {
    navigate("/admin/articles/create");
  };

  const getStatusBadge = (statusId) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1";
    const status = statuses.find(s => s.id === statusId);
    const statusName = status?.status || "Unknown";
    
    if (statusName.toLowerCase() === "published") {
      return (
        <span className={`${baseClasses} text-green-600`}>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{statusName}</span>
        </span>
      );
    } else if (statusName.toLowerCase() === "draft") {
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-600`}>
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span>{statusName}</span>
        </span>
      );
    }
    
    return (
      <span className={`${baseClasses} bg-green-100 text-green-600`}>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>{statusName}</span>
      </span>
    );
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Article management</h1>
        <Button
          onClick={handleCreateArticle}
          className="flex items-center justify-center space-x-2 px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors min-w-[160px]"
        >
          <Plus className="w-4 h-4" />
          <span>Create article</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status.id} value={status.status.toLowerCase()}>
                  {status.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-[#F9F8F6] rounded-t-lg shadow-md relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="flex-1 min-w-0 pr-8">
                <span className="font-medium text-gray-700">Article title</span>
              </div>
              <div className="w-32 mr-8">
                <span className="font-medium text-gray-700">Category</span>
              </div>
              <div className="w-32 mr-16">
                <span className="font-medium text-gray-700">Status</span>
              </div>
            </div>
            <div className="w-20">
              {/* Space for action buttons */}
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="px-6 py-8 text-center">
              <Loader2 className="animate-spin w-6 h-6 mx-auto text-gray-600" />
              <p className="mt-2 text-gray-500">Loading articles...</p>
            </div>
          ) : articles.length > 0 ? (
            articles.map((article, index) => (
              <div 
                key={article.id} 
                className={`px-6 py-4 ${
                  index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="text-gray-800 font-medium text-sm leading-tight">
                        {article.title.length > 65
                          ? `${article.title.substring(0, 65)} ...` 
                          : article.title
                        }
                      </h3>
                    </div>
                    <div className="w-32 mr-8">
                      <span className="text-gray-600 text-sm">{getCategoryName(article.category_id)}</span>
                    </div>
                    <div className="w-32 mr-16">
                      {getStatusBadge(article.status_id)}
                    </div>
                  </div>
                  <div className="w-20 flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(article)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No articles found
            </div>
          )}
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
