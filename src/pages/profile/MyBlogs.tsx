import { useEffect, useState } from "react";
import { apiClient } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { colors } from "../../theme/colors";

export default function MyBlogs() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await apiClient("/posts/myblog?status=published", {
          method: "GET",
          token: token ?? undefined,
        });
        setBlogs(res.data ?? res ?? []);
      } catch (error) {
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBlogs();
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
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
      <h1 className="text-2xl font-bold mb-6">My Blogs</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => navigate(`/blog/${blog.slug}`)}
            className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition"
          >
            <img
              src={blog.coverImageUrl}
              alt={blog.title}
              className="h-48 w-full object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(blog.createdAt).toDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
