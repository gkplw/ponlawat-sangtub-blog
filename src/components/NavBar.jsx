import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Bell, ChevronDown } from "lucide-react"

export function NavBar({ variant = "public" }) {
  // Public navbar (for login, signup, home pages)
  if (variant === "public") {
    return (
      <>
        <nav className="flex items-center justify-between py-4 px-4 border-b bg-[#F9F8F6]">
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
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link to="/login">Log in</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup">Sign up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </nav>

        {/* Mobile buttons - full width vertical layout */}
        <div className="md:hidden px-4 py-6 bg-[#F9F8F6]">
          <div className="flex flex-col space-y-4">
            <Link to="/login" className="w-full py-4 bg-white rounded-full border text-center font-medium hover:bg-gray-50 transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="w-full py-4 bg-gray-900 text-white rounded-full text-center font-medium hover:bg-gray-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </>
    );
  }

  // User navbar (for profile, reset password pages)
  return (
    <nav className="flex items-center justify-between py-4 px-4 border-b bg-[#F9F8F6]">
      <Link to="/" className="text-2xl font-bold">
        hh<span className="text-green-500">.</span>
      </Link>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=100&h=100&fit=crop&crop=face" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Username */}
          <span className="text-gray-800 font-medium">Moodeng ja</span>

          {/* Dropdown Arrow */}
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </nav>
  );
}
