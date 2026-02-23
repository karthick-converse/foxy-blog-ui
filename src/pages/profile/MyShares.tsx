import {
  ArrowLeft,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { useAuth } from "../../context/AuthContext";
import type { ShareResponse } from "../../interface/share";
import type { Share } from "../../types/share";

export default function MyShares() {
  const navigate = useNavigate();
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  useEffect(() => {
    const fetchShares = async () => {
      try {
        setLoading(true);

        const res = await apiClient(API_ENDPOINTS.userShare, {
          method: "GET",
          token: token ?? undefined,
        });

       

        const formatted = Array.isArray(res?.data)
          ? (res.data as ShareResponse[]).map((s) => ({
              _id: s._id,
              sharedAt: s.sharedAt || s.createdAt,
              platform: s.platform,
              post: s.postId,
            }))
          : [];

        setShares(formatted);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchShares();
  }, [token]);

  const renderPlatform = (platform: string) => {
    switch (platform) {
      case "twitter":
        return (
          <span className="flex items-center gap-1 text-blue-500 text-xs font-medium">
            <Twitter size={14} /> Twitter
          </span>
        );
      case "linkedin":
        return (
          <span className="flex items-center gap-1 text-blue-700 text-xs font-medium">
            <Linkedin size={14} /> LinkedIn
          </span>
        );
      case "facebook":
        return (
          <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
            <Facebook size={14} /> Facebook
          </span>
        );
      case "whatsapp":
        return (
          <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
            <MessageCircle size={14} /> WhatsApp
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-gray-500 capitalize">
            {platform}
          </span>
        );
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading shares...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
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
      <h1 className="text-2xl font-bold mb-6">My Shares</h1>

      {shares.length === 0 ? (
        <div className="text-gray-500">No shared posts yet.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {shares.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/blog/${item.post.slug}`)}
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <img
                src={item.post.coverImageUrl}
                alt={item.post.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-2">
                  {item.post.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(item.sharedAt).toDateString()}
                </p>

                {/* ✅ Platform Display */}
                {renderPlatform(item.platform)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
