import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import authorImage from "@/assets/author-image.jpg";
import { HeartPlus, Copy, Facebook, Twitter, Linkedin, X } from 'lucide-react';
import { toast } from "sonner";
import { NavBar } from "../../components/layout/NavBar";
import { Footer } from "../../components/layout/Footer";
import { postsAPI, commentsAPI, likesAPI } from "../../services/api";
import { useAuth } from "../../context/authentication";

export function ViewPostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, state } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await postsAPI.getById(params.postId);
        setPost(response.data);
        setLikeCount(response.data.likes_count || 0);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setErrorMessage("Unable to load data. Please try again.");
      }
    }
    fetchData();
  }, [params.postId]);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        setLoadingComments(true);
        const response = await commentsAPI.getByPostId(params.postId);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    }
    if (params.postId) {
      fetchComments();
    }
  }, [params.postId]);

  // Check if user liked the post
  useEffect(() => {
    async function checkLike() {
      if (!isAuthenticated) return;
      try {
        const response = await likesAPI.checkUserLike(params.postId);
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error("Error checking like:", error);
      }
    }
    if (params.postId && isAuthenticated) {
      checkLike();
    }
  }, [params.postId, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }
    
    try {
      const response = await likesAPI.toggle(params.postId);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likes_count);
      
      toast.success(response.data.isLiked ? "Liked!" : "Unliked", {
        description: response.data.isLiked ? "Added to your favorites" : "Removed from your favorites",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    try {
      setSubmittingComment(true);
      const response = await commentsAPI.create({
        post_id: params.postId,
        comment_text: newComment,
      });
      
      setComments([response.data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleCreateAccount = () => {
    setShowLoginAlert(false);
    navigate('/signup');
  };

  const handleLogin = () => {
    setShowLoginAlert(false);
    navigate('/login');
  };

  if (errorMessage) {
    return (
      <p className="container px-4 py-8 text-red-500 text-center">
        {errorMessage}
      </p>
    );
  }

  if (!post) {
    return (
      <p className="container px-4 py-8 text-center text-gray-500">
        Loading...
      </p>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <NavBar />
    <div className="bg-[#F9F8F6] px-4">
      {/* Login Alert Dialog */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#efeeeb] rounded-lg p-6 max-w-md mx-4 relative">
          <button
                onClick={() => setShowLoginAlert(false)}
                className="absolute right-2 top-2 font-bold text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
          <div className="relative mb-2">
              <h2 className="text-xl font-bold text-gray-900 text-center">
                Create an account to continue
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={handleCreateAccount}
                className="px-6 w-fit py-2 self-center bg-[#26231e] text-white rounded-full hover:bg-gray-700 transition-colors"
              >
                Create account
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account? <span onClick={handleLogin} className="text-gray-900 underline cursor-pointer">Log in</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <main className="container mx-auto py-10 lg:py-14 max-w-5xl">
        {/* Image */}
        <div className="w-full h-[220px] sm:h-[360px] lg:h-[420px] overflow-hidden rounded-xl mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600">
            {post.category}
          </span>
          <span className="text-gray-400 text-sm">{formattedDate}</span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Content */}
          <article className="order-1 lg:flex-1 lg:w-2/3">
            <section className="markdown text-gray-700">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </section>

        {/* Like / Share */}
            <div className="mt-8 rounded-lg p-3 bg-[#EFEEEB] space-y-3 lg:space-y-0">
              {/* Mobile Layout */}
              <div className="lg:hidden">
                {/* Like button - full width */}
                <button 
                  onClick={handleLike}
                  className={`w-full flex items-center justify-center gap-2 rounded-full px-4 py-2 shadow-sm transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <HeartPlus className={isLiked ? 'fill-current' : ''} />
                  <span className="text-sm">{post ? (isLiked ? likeCount : post.likes) : 0}</span>
                </button>
                
                {/* Copy and Social buttons */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={handleCopy}
                    className="bg-white rounded-full px-4 py-2 shadow-sm text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Copy />
                    Copy link
                  </button>
                  <div className="flex items-center gap-3">
                    <a
                      className="bg-white rounded-full px-2 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      href={`https://www.facebook.com/share.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <Facebook />
                    </a>
                    <a
                      className="bg-white rounded-full px-2 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin />
                    </a>
                    <a
                      className="bg-white rounded-full px-2 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      href={`https://www.twitter.com/share?&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter />
                    </a>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-sm transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <HeartPlus className={isLiked ? 'fill-current' : ''} />
                  <span className="text-sm">{likeCount}</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="bg-white rounded-full px-4 py-2 shadow-sm text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Copy />
                    Copy link
                  </button>
                  <a
                    className="bg-white rounded-full px-2 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    href={`https://www.facebook.com/share.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                  >
                    <Facebook />
                  </a>
                  <a
                    className="bg-white rounded-full px-2 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin />
                  </a>
                  <a
                    className="bg-white rounded-full px-2 py-2 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    href={`https://www.twitter.com/share?&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                  >
                    <Twitter />
                  </a>
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="mt-10">
              <label className="block mb-2 text-sm font-medium">Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full h-28 rounded-lg border p-3 focus:outline-none focus:ring-2 bg-white focus:ring-gray-400"
                placeholder="What are your thoughts?"
                disabled={submittingComment}
              ></textarea>
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={handleComment}
                  disabled={submittingComment}
                  className="px-6 py-2 bg-[#26231E] text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? "Sending..." : "Send"}
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-8 space-y-6">
              {loadingComments ? (
                <p className="text-center text-gray-500">Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className={`pb-6 ${index !== comments.length - 1 ? 'border-b border-gray-300' : ''}`}
                  >
                    <p className="font-semibold">{comment.users?.name || comment.users?.username || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                    <p className="mt-1 text-gray-700">{comment.comment_text}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </article>

          {/* Aside: Author */}
          <aside className="order-2 lg:w-1/3">
            <div className="bg-[#EFEEEB] rounded-xl p-6 lg:sticky lg:top-6">
              <div className="flex items-center gap-3">
                <img
                  src={authorImage}
                  alt={post.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-xs text-gray-500">Author</p>
                  <p className="font-semibold">{post.author}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                I am a pet enthusiast and freelance writer who specializes in
                animal behavior and care. With a deep love for cats, I enjoy
                sharing insights on feline companionship and wellness.
              </p>
              <p className="text-sm text-gray-600 mt-3">
                When I'm not writing, I spend time volunteering at my local
                animal shelter, helping cats find loving homes.
              </p>
            </div>
          </aside>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
