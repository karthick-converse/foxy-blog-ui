import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";
import { apiClient } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../lib/endpoints";

/* ---------- Type Definition ---------- */
type Reaction = {
  _id: string;
  reaction: "like" | "love" | "fire" | "insightful";
  createdAt: string;
  targetId: {
    _id: string;
    title: string;
    slug: string;
    coverImageUrl: string;
  };
};

export default function MyLikes() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [likes, setLikes] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Reactions ---------- */
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);

        const res = await apiClient(API_ENDPOINTS.userReactions, {
          method: "GET",
          token: token ?? undefined,
        });

        setLikes(Array.isArray(res?.data) ? res.data : []);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchReactions();
  }, [token]);

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading likes...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* ---------- Back Button ---------- */}
      <button
        onClick={() => navigate("/profile")}
        className={`
          inline-flex items-center gap-2
          px-4 py-2 mb-6
          text-sm font-medium
          rounded-md shadow-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${colors.primary.base}
          ${colors.primary.hover}
          ${colors.primary.text}
        `}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* ---------- Page Title ---------- */}
      <h1 className="text-2xl font-bold mb-6">My Likes</h1>

      {/* ---------- Empty State ---------- */}
      {likes.length === 0 ? (
        <div className="text-gray-500 text-lg">
          You haven't reacted to any posts yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {likes.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/blog/${item.targetId.slug}`)}
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* ---------- Cover Image ---------- */}
              <img
                src={item.targetId.coverImageUrl}
                alt={item.targetId.title}
                className="h-48 w-full object-cover"
              />

              {/* ---------- Content ---------- */}
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">
                  {item.targetId.title}
                </h3>

                <p className="text-sm mt-2 capitalize">
                  {getReactionEmoji(item.reaction)} {item.reaction}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Helper: Reaction Emoji ---------- */
function getReactionEmoji(type: string) {
  switch (type) {
    case "like":
      return "👍";
    case "love":
      return "❤️";
    case "fire":
      return "🔥";
    case "insightful":
      return "💡";
    default:
      return "";
  }
}