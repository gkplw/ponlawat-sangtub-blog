import { Link } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useState, useEffect } from "react";

export function BlogCard(props) {
    const { id, image, category, title, description, date } = props;
    
    const [authorData, setAuthorData] = useState({
      name: "",
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
      <div className="flex flex-col gap-4">
        <Link to={`/posts/${id}`} className="relative h-[212px] sm:h-[360px]">
          <img className="w-full h-full object-cover rounded-md" src={image} alt={title} />
        </Link>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
              {category}
            </span>
          </div>
          <Link to={`/posts/${id}`}>
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {description}
          </p>
          <div className="flex items-center text-sm">
            <img className="w-12 h-12 rounded-full object-cover mr-2" src={authorData.profile_pic} alt={authorData.name} />
            <span>{authorData.name}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    );
  }