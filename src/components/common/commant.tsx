import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, EyeOff, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";

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

interface CommentItemProps {
  comment: CommentType;
  depth?: number;
  blogId: string;
}

export default function CommentItem({
  comment,
  depth = 0,
  blogId,
}: CommentItemProps) {
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<CommentType[]>(comment.replays || []);
  const [status, setStatus] = useState(comment.status);
  const isAdmin = user?.role === "admin";

 const handleToggleVisibility = async () => {
  try {
    await apiClient(
      `/admin/comments/${comment._id}/hide`,
      {
        method: "PUT",
        token: token ?? undefined,
      }
    );

    setStatus("hidden");

    toast.success("Comment hidden successfully");
  } catch (error) {
    toast.error("Failed to hide comment");
  }
};

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    if (!isAuthenticated) {
      toast.error("Please login to add comment");
      setTimeout(() => navigate("/signin"), 1200);
      return;
    }

    try {
      const res = await apiClient(API_ENDPOINTS.commentsByPost(blogId), {
        method: "POST",
        token: token ?? undefined,
        body: {
          body: replyText,
          parentCommentId: comment._id,
        },
      });

      const newReply = res.data ?? res;
      setReplies((prev) => [...prev, newReply]);

      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
    } catch {
      toast.error("Failed to add reply");
    }
  };

  if (status !== "visible" && !isAdmin) return null;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold uppercase">
          {comment?.authorId?.name?.charAt(0) ?? "U"}
        </div>

        <div className="flex-1">
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.authorId.name}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.createdAt), "dd MMM yyyy")}
              </span>

              {/* 🔥 Admin Block Button */}
              {isAdmin && (
                <button
                  onClick={handleToggleVisibility}
                  className="ml-2 text-red-500 hover:text-red-700"
                  title={status === "visible" ? "Hide comment" : "Show comment"}
                >
                  {status === "visible" ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              )}
            </div>

            <p
              className={`mt-1 text-sm ${
                status !== "visible" ? "italic text-gray-400" : ""
              }`}
            >
              {status === "visible" ? comment.body : "[Hidden by admin]"}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <button
              onClick={() => setShowReplyInput((prev) => !prev)}
              className="hover:text-black"
            >
              {showReplyInput ? "Cancel" : "Reply"}
            </button>

            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies((prev) => !prev)}
                className="flex items-center gap-1 hover:text-black transition"
              >
                {showReplies ? (
                  <>
                    <ChevronUp size={14} />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    {replies.length}
                  </>
                )}
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Write a reply..."
              />
              <button
                onClick={handleReplySubmit}
                className={`${colors.primary.base} px-3 py-1 text-xs text-white rounded-md`}
              >
                Post Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div
          className="pl-4 border-l space-y-4"
          style={{ marginLeft: depth * 20 }}
        >
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              blogId={blogId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
