import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Check } from "lucide-react";
import { NavBar } from "../components/layout/NavBar";

export function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <NavBar />

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#efeeeb] rounded-2xl p-6 sm:p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 sm:w-12 sm:h-12 px-2 py-2 text-white bg-[#12B279] rounded-full" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
              Registration success
            </h1>

            {/* Continue Button */}
            <Button
              asChild
              className="px-8 py-2 bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <Link to="/login">
                Continue
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
