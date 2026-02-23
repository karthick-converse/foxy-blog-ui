import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { colors } from "../../theme/colors";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { useAuth } from "../../context/AuthContext";
import type { BookmarkItem, BookmarkResponse } from "../../interface/BookMark";



export default function MyBookmarks() {
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); 
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);

        const res = await apiClient(API_ENDPOINTS.bookmark, {
          method: "GET",
          token: token ?? undefined,
        });

        const formatted = Array.isArray(res)
          ? (res as BookmarkResponse[]).map((b) => ({
              _id: b._id,
              post: b.postId,
              createdAt: b.createdAt,
            }))
          : [];

        setBookmarks(formatted);
      }  finally {
        setLoading(false);
      }
    };
    if (token)
    fetchBookmarks();
  }, [token]);

  if (loading) {
    return <div className="text-center py-10">Loading bookmarks...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/profile")}
        className={`
    inline-flex items-center gap-2
    px-4 py-2
    mb-6
    text-sm font-medium
    rounded-md
    shadow-sm
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${colors.primary.base}
    ${colors.primary.hover}
    ${colors.primary.text}
  `}
      >
        <ArrowLeft size={18} />
      </button>

      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="text-gray-500">No bookmarks yet.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {bookmarks.map((item) => {
            const post = item.post;

            return (
              <div
                key={post._id}
                onClick={() => navigate(`/blog/${post._id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{post.title}</h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(item.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
