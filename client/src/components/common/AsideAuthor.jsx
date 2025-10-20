import { authAPI } from "../../services/api";
import { useState, useEffect } from "react";

export function AsideAuthor() {
    const [authorData, setAuthorData] = useState({
        name: "",
        bio: "",
        profile_pic: ""
      });
    
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
          }
        };
    
        fetchAuthorData();
      }, []);

    return (
        <div className="bg-[#EFEEEB] rounded-xl p-8 lg:sticky lg:top-6">
        <div className="border-b border-gray-300 pb-3 mb-3 flex items-center gap-3">
          <img
            src={authorData.profile_pic}
            alt={authorData.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-500">Author</p>
            <p className="font-semibold">{authorData.name}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
            {authorData.bio ? (
                authorData.bio.split('\n').map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>No bio available</p>
            )}
        </p>
      </div>
    )
}