import { useState } from "react";
import { Search, Edit, Trash2, Plus, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { toast } from "sonner";

export function CategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Cat" },
    { id: 2, name: "General" },
    { id: 3, name: "Inspiration" }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      id: Date.now(),
      name: newCategoryName.trim()
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setShowCreateModal(false);
    
    toast.success("Create category", {
      description: "Category has been successfully created.",
      duration: 3000,
    });
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      
      toast.success("Delete category", {
        description: "Category has been successfully deleted.",
        duration: 3000,
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setShowCreateModal(true);
  };

  const handleUpdateCategory = () => {
    if (!newCategoryName.trim() || !editingCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: newCategoryName.trim() }
        : cat
    ));
    
    setNewCategoryName("");
    setShowCreateModal(false);
    setEditingCategory(null);
    
    toast.success("Update category", {
      description: "Category has been successfully updated.",
      duration: 3000,
    });
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setEditingCategory(null);
    setNewCategoryName("");
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category management</h1>
        <Button
          onClick={openCreateModal}
          className="flex items-center justify-center space-x-2 px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors min-w-[160px]"
        >
          <Plus className="w-4 h-4" />
          <span>Create category</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-[#F9F8F6] rounded-t-lg shadow-md relative z-10">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Category</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredCategories.map((category, index) => (
            <div 
              key={category.id} 
              className={`px-6 py-4 flex items-center justify-between ${
                index % 2 === 0 ? 'bg-[#F9F8F6]' : 'bg-[#EFEEEB]'
              }`}
              >
              <span className="text-gray-800 font-medium text-sm leading-tight">{category.name}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(category)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No categories found
          </div>
        )}
      </div>

      {/* Create/Edit Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#efeeeb] rounded-lg p-6 w-full max-w-md mx-4 text-center">
            {/* Header */}
            <div className="flex items-center justify-center mb-4 relative">
              <h2 className="text-xl font-bold text-gray-800 text-center flex-grow">
                {editingCategory ? "Edit category" : "Create category"}
              </h2>
              <button
                onClick={closeCreateModal}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category name
                </label>
                <Input
                  type="text"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  className="px-6 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCategory}
        title="Delete category"
        message="Do you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
