import { Eye, MessageSquare } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentItem from "../components/common/commant";
import ShareDropdown from "../components/common/Share";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

/* ---------------- TYPES ---------------- */

interface CommentType {
  _id: string;
  authorId: {
    _id: string;
    name: string;
  };
  body: string;
  status: string;
  createdAt: string;
  replays: CommentType[];
}

type ReactionType = "like" | "love" | "fire" | "insightful";

const reactionTypes: ReactionType[] = ["like", "love", "fire", "insightful"];

const emojiMap: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  fire: "🔥",
  insightful: "💡",
};

/* ---------------- COMPONENT ---------------- */

export default function SingleBlog() {
  const { token } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [blog, setBlog] = useState<any>(null);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

  const { slug } = useParams();
  const navigator = useNavigate();

  const hasRecordedView = useRef(false);

  /* ---------------- FETCH BLOG ---------------- */
  useEffect(() => {
    if (!slug) return;

    const fetchBlogAndComments = async () => {
      try {
        const blogRes = await apiClient(`${API_ENDPOINTS.posts}/${slug}`);
        const blogData = blogRes?.data ?? blogRes;

        setBlog(blogData);

        if (blogData?._id) {
          const commentRes = await apiClient(
            API_ENDPOINTS.commentsByPost(blogData._id),
          );

          setComments(commentRes?.data ?? commentRes ?? []);

          if (!hasRecordedView.current) {
            hasRecordedView.current = true;
            recordView(blogData._id);
          }
        }
      } catch (err) {
        toast.error("Failed to load blog ❌");
      }
    };

    fetchBlogAndComments();
  }, [slug]);

  const recordView = async (postId: string) => {
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        let sessionId = localStorage.getItem("sessionId");

        if (!sessionId) {
          sessionId = crypto.randomUUID();
          localStorage.setItem("sessionId", sessionId);
        }

        headers["x-session-id"] = sessionId;
      }

      await fetch(`http://localhost:5000/api/posts/view/${postId}`, {
        method: "POST",
        headers,
      });
    } catch (error) {
      console.error("Failed to record view");
    }
  };

  /* ---------------- REACTION ---------------- */

  const handleReaction = async (reaction: ReactionType) => {
    if (!token) {
      toast.error("Please login to react");
      navigator("/signin");
      return;
    }

    const previousReaction = userReaction;
    const isRemoving = previousReaction === reaction;
    const newReaction = isRemoving ? null : reaction;

    setUserReaction(newReaction);

    setBlog((prev: any) => {
      const updated = { ...prev };
      const breakdown = { ...updated.stats.breakdown };

      if (previousReaction) {
        breakdown[previousReaction] = Math.max(
          breakdown[previousReaction] - 1,
          0,
        );
      }

      if (!isRemoving && newReaction) {
        breakdown[newReaction] += 1;
      }

      updated.stats.breakdown = breakdown;
      return updated;
    });

    try {
      await apiClient(API_ENDPOINTS.reactions, {
        method: "POST",
        token,
        body: {
          targetType: "post",
          targetId: blog._id,
          reaction: newReaction,
        },
      });
    } catch (err) {
      // rollback
      setUserReaction(previousReaction);
    }
  };

  /* ---------------- COMMENT ---------------- */

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    if (!token) {
      toast.error("Please login to add a comment");
      navigator("/signin");
      return;
    }

    const newComment = await apiClient(API_ENDPOINTS.commentsByPost(blog._id), {
      method: "POST",
      token,
      body: { body: commentText },
    });

    setComments((prev) => [newComment.data ?? newComment, ...prev]);

    setCommentText("");
  };

  if (!blog) {
    return <div className="text-center py-20">Loading blog...</div>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-gray-50 min-h-screen  px-4">
      <article className="mx-auto w-full max-w-5xl rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10 space-y-10">
        {" "}
        <article className="mx-auto w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10 space-y-10">
          {/* HEADER */}
          <header className="space-y-5 text-center sm:text-left">
            <Badge variant="secondary">{blog.category.name}</Badge>

            <h1 className="text-4xl font-bold">{blog.title}</h1>

            <div className="text-sm text-muted-foreground">
              By <strong>{blog.author.name}</strong> •{" "}
              {new Date(blog.createdAt).toDateString()}
            </div>
          </header>
          {/* IMAGE */}
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            className="rounded-2xl w-full h-30"
          />
          {/* STATS + REACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1">
                <Eye size={16} />
                {blog.stats?.views ?? 0}
              </span>

              <span className="flex items-center gap-1">
                <MessageSquare size={16} />
                {comments.length}
              </span>

              {/* REACTIONS */}
              <div className="flex items-center gap-4">
                {reactionTypes.map((type) => {
                  const count = blog.stats?.reactions.breakdown?.[type] ?? 0;
                  const isActive = userReaction === type;

                  return (
                    <button
                      key={type}
                      onClick={() => handleReaction(type)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition
                    ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600 scale-110"
                        : "hover:bg-gray-100"
                    }
                  `}
                    >
                      {emojiMap[type]} {count}
                    </button>
                  );
                })}
              </div>
            </div>

            <ShareDropdown slug={blog.slug} title={blog.title} />
          </div>
          {/* CONTENT */}
          <div
            className="
    prose 
    prose-sm 
    sm:prose-base 
    lg:prose-lg 
    xl:prose-xl
    max-w-none

    prose-headings:font-bold
    prose-headings:tracking-tight
    prose-h2:mt-10
    prose-h3:mt-8

    prose-p:text-muted-foreground
    prose-p:leading-relaxed

    prose-a:text-primary
    prose-a:no-underline
    hover:prose-a:underline

    prose-img:rounded-2xl
    prose-img:shadow-lg

    prose-blockquote:border-l-4
    prose-blockquote:border-primary
    prose-blockquote:pl-4
    prose-blockquote:italic
    prose-blockquote:text-muted-foreground

    prose-pre:bg-zinc-900
    prose-pre:text-white
    prose-pre:rounded-xl
    prose-pre:shadow-lg

    prose-table:border
    prose-th:bg-muted
    prose-th:p-2
    prose-td:p-2
    ProseMirror
  "
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
          />
          {/* GALLERY */}
          {blog.galleryImageUrls && blog.galleryImageUrls.length > 0 && (
            <section className="pt-8 border-t space-y-6">
              <h3 className="text-2xl font-semibold">Gallery</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {blog.galleryImageUrls.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl shadow-md group"
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
        {/* COMMENTS */}
        <section className="space-y-6 pt-8 border-t">
          <h3 className="text-2xl font-semibold">
            Comments ({comments.length})
          </h3>

          <textarea
            placeholder="Write a comment..."
            className="w-full border rounded-xl p-3"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <Button className={colors.primary.base} onClick={handleAddComment}>
            Post Comment
          </Button>

          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              blogId={blog._id}
            />
          ))}

          {/* RELATED BLOGS */}
          {blog.relatedPosts.length > 0 && (
            <section className="pt-10 border-t space-y-6">
              <h3 className="text-2xl font-semibold">Related Blogs</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blog.relatedPosts.map((item: any) => (
                  <div
                    key={item._id}
                    onClick={() => navigator(`/blog/${item.slug}`)}
                    className="cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group bg-white"
                  >
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />

                    <div className="p-4 space-y-2">
                      <Badge variant="secondary">{item.category?.name}</Badge>

                      <h4 className="font-semibold line-clamp-2 group-hover:text-indigo-600 transition">
                        {item.title}
                      </h4>

                      <div className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </article>
    </div>
  );
}
