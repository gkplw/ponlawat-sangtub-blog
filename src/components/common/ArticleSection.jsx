import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import authorImage from "../assets/author-image.jpg";
import axios from "axios";

function BlogCard(props) {
  const { id, image, category, title, description, author, date } = props;
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
          <img className="w-8 h-8 rounded-full mr-2" src={authorImage} alt={author} />
          <span>{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

const categories = ["Highlight", "Cat", "Inspiration", "General"];

export function ArticlesFilter() {
  const [category, setCategory] = useState("Highlight");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://blog-post-project-api.vercel.app/posts`,
          {
            params: {
              page,
              limit: 6,
              ...(category !== "Highlight" && { category }),
              ...(search && { keyword: search }),
            }
          }
        );

        if (page === 1) {
          setData(response.data.posts); // reset ข้อมูล
        } else {
          setData((prev) => [...prev, ...response.data.posts]); // append ข้อมูล
        }

        setTotalPages(response.data.totalPages);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage("Unable to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [search, category, page]); // 👈 รวม logic ไว้ที่เดียว

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ฟังก์ชันสำหรับค้นหาบทความ
  const handleSearch = async (searchTerm) => {
    if (searchTerm.length < 1) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await axios.get(
        `https://blog-post-project-api.vercel.app/posts`,
        {
          params: {
            keyword: searchTerm,
            limit: 6, // จำกัดผลลัพธ์ให้แสดงแค่ 6 รายการ
          }
        }
      );
      setSearchResults(response.data.posts);
      setShowSearchDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // ฟังก์ชันสำหรับเลือกบทความ
  const handleSelectArticle = (articleId) => {
    setShowSearchDropdown(false);
    setSearch("");
    setSearchResults([]);
    // Navigate to article page
    window.location.href = `/posts/${articleId}`;
  };

  return (
    <div className="w-full space-y-2 bg-[#F9F8F6] px-4 py-4">
      <h2 className="text-2xl font-semibold">Latest articles</h2>

      {/* Mobile layout */}
      <div className="flex flex-col gap-2 lg:hidden p-3 rounded-xl bg-[#EFEEEB]">
        <div className="relative" ref={searchRef}>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              handleSearch(value);
            }}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowSearchDropdown(true);
              }
            }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          
          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchLoading ? (
                <div className="p-3 text-center text-gray-500">
                  <Loader2 className="animate-spin w-4 h-4 mx-auto mb-2" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => handleSelectArticle(article.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No articles found
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm mb-1">Category</p>
          <Select
            value={category}
            onValueChange={(val) => {
              setPage(1); // reset page
              setCategory(val);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="pt-4 pb-4 px-6 hidden lg:flex items-center justify-between rounded-xl bg-[#EFEEEB]">
        <div className="flex gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant="ghost"
              className={`rounded-xl transition-colors ${
                c === category 
                  ? "bg-[#d4d2cc] text-gray-800 hover:bg-[#DAD6D1] hover:text-gray-800" 
                  : "text-gray-600 hover:bg-[#DAD6D1] hover:text-gray-800"
              }`}
              onClick={() => {
                setPage(1); // reset page
                setCategory(c);
              }}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="relative" ref={searchRef}>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              handleSearch(value);
            }}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowSearchDropdown(true);
              }
            }}
            className="w-80 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          
          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchLoading ? (
                <div className="p-3 text-center text-gray-500">
                  <Loader2 className="animate-spin w-4 h-4 mx-auto mb-2" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => handleSelectArticle(article.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No articles found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog posts grid */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        {data.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          />
        ))}
      </article>

      {/* View More Link */}
      {!loading && page < totalPages && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setPage((prev) => prev + 1)}
            className="text-[#26231E] hover:text-gray-600 underline cursor-pointer transition-colors"
          >
            View more
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-4">
          <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </div>
  );
}
