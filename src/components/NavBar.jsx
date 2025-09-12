import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function NavBar() {
  return (
    <>
      <nav className="flex items-center justify-between py-4 px-19 border-b bg-[#F9F8F6]">
        <a href="/" className="text-2xl font-bold">
          hh<span className="text-green-500">.</span>
        </a>
        
        {/* Desktop buttons - horizontal layout */}
        <div className="hidden md:flex space-x-4">
          <a href="/login" className="px-9 py-2 bg-white rounded-full border hover:bg-gray-50 transition-colors">
            Log in
          </a>
          <a
            href="/signup"
            className="px-8 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            Sign up
          </a>
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
              <a href="/login">Log in</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/signup">Sign up</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </nav>

      {/* Mobile buttons - full width vertical layout */}
      <div className="md:hidden px-19 py-6 bg-[#F9F8F6]">
        <div className="flex flex-col space-y-4">
          <a href="/login" className="w-full py-4 bg-white rounded-full border text-center font-medium hover:bg-gray-50 transition-colors">
            Log in
          </a>
          <a
            href="/signup"
            className="w-full py-4 bg-gray-900 text-white rounded-full text-center font-medium hover:bg-gray-700 transition-colors"
          >
            Sign up
          </a>
        </div>
      </div>
    </>
  );
}
