import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { Menu, Bell, ChevronDown, User, Lock, LogOut, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "../../context/authentication";

export function NavBar({ variant = "auto" }) {
  const { isAuthenticated, logout: authLogout, state } = useAuth();

  const handleLogout = () => {
    authLogout();
  };

  const actualVariant = variant === "auto" ? (isAuthenticated ? "user" : "public") : variant;
  const user = state?.user || {};

  // Public navbar (for login, signup, home pages)
  if (actualVariant === "public") {
    return (
      <>
        <nav className="flex items-center justify-between py-4 px-4 md:px-10 border-b bg-[#F9F8F6]">
          <Link to="/" className="text-2xl font-bold">
            hh<span className="text-green-500">.</span>
          </Link>
          
          {/* Desktop buttons - horizontal layout */}
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="px-9 py-2 bg-white rounded-full border hover:bg-gray-50 transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2">
                <Menu className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-0 bg-[#F9F8F6]">
              <div className="py-2">
                <DropdownMenuItem asChild className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                  <Link to="/login" className="flex items-center space-x-3 w-full">
                    <LogIn className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Log in</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                  <Link to="/signup" className="flex items-center space-x-3 w-full">
                    <UserPlus className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Sign up</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </nav>
      </>
    );
  }

  // User navbar (for profile, reset password pages)
  return (
    <>
      <nav className="flex items-center justify-between py-4 px-4 border-b bg-[#F9F8F6]">
        <Link to="/" className="text-2xl font-bold">
          hh<span className="text-green-500">.</span>
        </Link>

        {/* Desktop - Right side - Notifications and Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Notification Bell */}
          <button className="text-gray-600 hover:text-gray-800 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile Section with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 px-2 py-1">
                {/* Profile Picture */}
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src={user.profile_pic} 
                    alt={user.username || user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Username */}
                <span className="p-2 text-gray-800 font-medium">{user.username || user.name || "User"}</span>

                {/* Dropdown Arrow */}
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-0 bg-[#F9F8F6]">
              {/* Menu Items */}
              <div className="py-2">
                <DropdownMenuItem asChild className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                  <Link to="/profile" className="flex items-center space-x-3 w-full">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                  <Link to="/reset-password" className="flex items-center space-x-3 w-full">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Reset password</span>
                  </Link>
                </DropdownMenuItem>
                <div className="border-t border-gray-200 my-1"></div>
                <DropdownMenuItem 
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2">
                <Menu className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-0 bg-[#F9F8F6]">
              {/* Menu Items */}
              <div className="py-2">
                <DropdownMenuItem asChild className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                  <Link to="/profile" className="flex items-center space-x-3 w-full">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50">
                  <Link to="/reset-password" className="flex items-center space-x-3 w-full">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Reset password</span>
                  </Link>
                </DropdownMenuItem>
                <div className="border-t border-gray-200 my-1"></div>
                <DropdownMenuItem 
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}