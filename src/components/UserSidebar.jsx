import { Link, useLocation } from "react-router-dom";
import { User, Lock } from "lucide-react";

export function UserSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/profile",
      label: "Profile",
      icon: User,
      active: location.pathname === "/profile"
    },
    {
      path: "/reset-password",
      label: "Reset password",
      icon: Lock,
      active: location.pathname === "/reset-password"
    }
  ];

  return (
    <aside className="w-full sm:w-64 bg-[#F9F8F6] border-r border-gray-200 sm:min-h-screen">
      <nav className="p-4 sm:p-6 h-auto sm:h-full">
        <ul className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="flex-1 sm:flex-none">
                <Link
                  to={item.path}
                  className={`flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    item.active
                      ? "bg-[#efeeeb] text-gray-800 font-medium"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
