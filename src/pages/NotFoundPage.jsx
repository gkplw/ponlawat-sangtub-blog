import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-6">
          <span className="text-3xl">!</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <Link
          to="/"
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Go To Homepage
        </Link>
      </main>
    </div>
  );
}
