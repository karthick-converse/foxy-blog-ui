"use client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye,
  MessageSquare,
  Bookmark,
  Heart,
  ThumbsUp,
  Sparkles,
  Lightbulb,
} from "lucide-react";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import ShareDropdown from "../components/common/Share";
import ReactionPopover from "../components/common/Reaction";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import { colors } from "../theme/colors";

/* ---------------- REACTION TYPES ---------------- */

type ReactionType = "like" | "love" | "fire" | "insightful";

const reactionIcons = {
  like: ThumbsUp,
  love: Heart,
  insightful: Lightbulb,
  fire: Sparkles, 
};

/* ---------------- COMPONENT ---------------- */

function BlogCard({
  blog,
  isBookmarked,
  userReaction,
  onBookmarkToggle,
  onReactionChange,
}: {
  blog: any;
  isBookmarked: boolean;
  isReacted: boolean;
  userReaction: ReactionType | null;
  onBookmarkToggle: (postId: string, next: boolean) => void;
  onReactionChange: (postId: string, reaction: ReactionType | null) => void;
}) {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const views = blog.stats?.totalViews ?? 0;

  /* ---------------- BOOKMARK ---------------- */

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark");
      setTimeout(() => navigate("/signin"), 1200);
      return;
    }

    const next = !isBookmarked;
    onBookmarkToggle(blog._id, next);

    try {
      await apiClient(`${API_ENDPOINTS.bookmark}/${blog.id}`, {
        method: "POST",
        token: token ?? undefined,
      });
    } catch {
      onBookmarkToggle(blog._id, !next);
      toast.error("Bookmark failed");
    }
  };

  /* ---------------- REACTION DATA ---------------- */
  const safeBreakdown: Record<ReactionType, number> = {
    like: blog?.stats?.breakdown?.like ?? 0,
    love: blog?.stats?.breakdown?.love ?? 0,
    fire: blog?.stats?.breakdown?.fire ?? 0,
    insightful: blog?.stats?.breakdown?.insightful ?? 0,
  };

  const totalReactions =
    blog?.stats?.total ??
    Object.values(safeBreakdown).reduce((a, b) => a + b, 0);

  const reactions = (Object.keys(reactionIcons) as ReactionType[]).map(
    (type) => ({
      type,
      icon: reactionIcons[type],
      count: safeBreakdown[type],
    }),
  );

  /* ---------------- UI ---------------- */

  return (
    <Card className="group max-h-full flex flex-col bg-white rounded-2xl border border-gray-200  transition-all duration-300 hover:shadow-xl  relative">
      {/* IMAGE */}
      <div className="relative ">
        {blog.category && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span
              className={`${colors.primary.base} text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-md`}
            >
              {blog.category.name}
            </span>
          </div>
        )}

        <button
          onClick={handleBookmark}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <Bookmark
            size={16}
            className={
              isBookmarked
                ? "fill-indigo-600 text-indigo-600"
                : "text-white-500"
            }
          />
        </button>

        <Link to={`/blog/${blog.slug}`}>
          <img
            src={blog.coverImage?.url}
            alt={blog.title}
            className="h-44 sm:h-52 md:h-56 w-full object-cover rounded-t-md shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] 
 transition duration-500 "
          />
        </Link>
      </div>
      <div className="p-4 sm:p-5 space-y-4 max-h-full ">
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900  group-hover:text-indigo-600 transition leading-snug">
            {blog.title}
          </h3>
        </Link>

        <p
          className="text-xs sm:text-sm text-gray-500 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: blog.excerpt }}
        />

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap">
          {blog.tags?.slice(0, 3).map((tag: any) => (
            <span
              key={tag._id || tag.id}
              className="text-[10px] sm:text-xs bg-indigo-100 text-gray-600 px-2 py-1 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
      {/* BODY */}
      <div className="px-4 pt-4 pb-3 flex items-end    h-full ">
        {/* FOOTER */}
        <div className=" pt-4 w-full flex flex-col gap-2 justify-end pb-0! text-[11px] h-full  sm:text-xs text-gray-500 ">
          {/* AUTHOR */}
          <div className="flex justify-between border-t border-gray-100 pt-2 flex-wrap gap-2">
            <span>
              By <strong>{blog.author?.name}</strong>
            </span>
          </div>

          {/* STATS + REACTIONS */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            {/* LEFT STATS */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Eye size={14} /> {views}
              </span>

              <span className="flex items-center gap-1">
                <MessageSquare size={14} /> {blog.stats?.totalComments ?? 0}
              </span>

              <ShareDropdown slug={blog.slug} title={blog.title} />
            </div>

            {/* REACTIONS */}
            <div className="flex items-center gap-2 flex-wrap">
              {totalReactions > 0 && (
                <span className="text-[11px] sm:text-xs text-gray-600 whitespace-nowrap">
                  {blog.userReaction
                    ? totalReactions === 1
                      ? "You"
                      : totalReactions === 2
                        ? "You and 1 other"
                        : `You and ${totalReactions - 1} others`
                    : totalReactions}
                </span>
              )}

              <ReactionPopover
                targetId={blog.id}
                targetType="post"
                totalCount={totalReactions}
                initialReaction={userReaction}
                breakdown={safeBreakdown}
                reactions={reactions}
                token={token}
                isAuthenticated={isAuthenticated}
                onReactionChange={(reaction) =>
                  onReactionChange(blog.id, reaction)
                }
              />
            </div>
          </div>

          {/* READ MORE BUTTON */}
          <Link to={`/blog/${blog.slug}`}>
            <Button
              variant="outline"
              className="w-full mt-3 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition text-sm"
            >
              Read More
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default BlogCard;
