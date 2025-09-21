import { Routes, Route, Navigate } from "react-router-dom";
import { AdminSidebar } from "../components/layout/AdminSidebar";
import { ArticleManagement } from "./ArticleManagement";
import { CategoryManagement } from "./CategoryManagement";
import { AdminProfile } from "./AdminProfile";
import { NotificationPage } from "./NotificationPage";
import { AdminResetPassword } from "./AdminResetPassword";
import { CreateArticle } from "./CreateArticle";
import { EditArticle } from "./EditArticle";

export function AdminDashboard() {
  return (
    <div className="bg-[#F9F8F6] min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          {/* Default redirect to articles */}
          <Route path="/" element={<Navigate to="/admin/articles" replace />} />
          
          {/* Article Management */}
          <Route path="/articles" element={<ArticleManagement />} />
          <Route path="/articles/create" element={<CreateArticle />} />
          <Route path="/articles/edit/:id" element={<EditArticle />} />
          
          {/* Category Management */}
          <Route path="/categories" element={<CategoryManagement />} />
          
          {/* Profile */}
          <Route path="/profile" element={<AdminProfile />} />
          
          {/* Notifications */}
          <Route path="/notifications" element={<NotificationPage />} />
          
          {/* Reset Password */}
          <Route path="/reset-password" element={<AdminResetPassword />} />
        </Routes>
      </div>
    </div>
  );
}
