import { useState, useEffect } from "react";
import { authAPI } from "../../services/api";

export function HeroSection() {
  const [authorData, setAuthorData] = useState({
    name: "",
    bio: "",
    profile_pic: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // ดึงข้อมูล admin (author) จาก API
        const response = await authAPI.getAdminPublic();
        setAuthorData({
          name: response.data.user.name || "",
          bio: response.data.user.bio || "",
          profile_pic: response.data.user.profile_pic || ""
        });
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#F9F8F6]">
        <main className="container px-4 py-8 lg:py-16 mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Stay <br className="hidden lg:block" />
                Informed, <br />
                Stay Inspired,
              </h1>
              <p className="text-lg text-gray-500">
                Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
                Inspiration and Information.
              </p>
            </div>
            <div className="h-[530px] bg-gray-200 rounded-lg shadow-lg lg:w-1/3 mx-4 mb-8 lg:mb-0 animate-pulse"></div>
            <div className="lg:w-1/3 lg:pl-8">
              <h2 className="text-xl font-semibold mb-2">-Author</h2>
              <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6]">
      <main className="container px-4 py-8 lg:py-16 mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Stay <br className="hidden lg:block" />
              Informed, <br />
              Stay Inspired,
            </h1>
            <p className="text-lg text-gray-500">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
              Inspiration and Information.
            </p>
          </div>
          <img
            src={authorData.profile_pic || "/api/placeholder/400/530"}
            alt={authorData.name || "Author"}
            className="h-[530px] object-cover rounded-lg shadow-lg lg:w-1/3 mx-4 mb-8 lg:mb-0"
            onError={(e) => {
              e.target.src = "/api/placeholder/400/530";
            }}
          />
          <div className="lg:w-1/3 lg:pl-8">
            <h2 className="text-xl font-semibold mb-2">-Author</h2>
            <h3 className="text-2xl font-bold mb-4">{authorData.name}</h3>
            <div className="text-gray-500">
              {authorData.bio ? (
                authorData.bio.split('\n').map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>No bio available</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}