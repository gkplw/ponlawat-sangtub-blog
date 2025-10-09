import { Link, useLocation } from "react-router-dom";
import { FileText, FolderOpen, User, Bell, Lock, ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "../../context/authentication";

export function AdminSidebar() {
  const location = useLocation();
  const { logout: authLogout } = useAuth();
  const menuItems = [
    {
      icon: FileText,
      label: "Article management",
      path: "/admin/articles"
    },
    {
      icon: FolderOpen,
      label: "Category management", 
      path: "/admin/categories"
    },
    {
      icon: User,
      label: "Profile",
      path: "/admin/profile"
    },
    {
      icon: Bell,
      label: "Notification",
      path: "/admin/notifications"
    },
    {
      icon: Lock,
      label: "Reset password",
      path: "/admin/reset-password"
    }
  ];

  const handleLogout = () => {
    authLogout();
  };

  return (
    <div className="w-64 bg-[#efeeeb] min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="text-2xl font-bold">
          hh<span className="text-green-500">.</span>
        </Link>
        <p className="text-[#E8A87C] text-sm font-medium">Admin panel</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[#d4d2cc] text-gray-800" 
                      : "text-gray-600 hover:bg-[#DAD6D1] hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-2">
        {/* Website Link */}
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-[#DAD6D1] hover:text-gray-800 rounded-lg transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="text-sm font-medium">hh. website</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-[#d4d2cc] hover:text-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}
