"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, RotateCcw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { colors } from "../../theme/colors";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { MdOutlineUnpublished } from "react-icons/md";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

interface Blog {
  _id: string;
  title: string;
  coverImageUrl: string;
  slug: string;
  status: string;
  createdAt: string;
  isDeleted: boolean;
  authorId: { name: string };
  categoryId: { name: string };
}

export default function AdminBlogPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filter, setFilter] = useState("all");

  const fetchBlogs = async () => {
    try {
      const data = await apiClient(API_ENDPOINTS.adminBlogs, {
        token: token ?? undefined,
      });

      const blogData = data?.data ?? [];
      setBlogs(blogData);
    } catch {
      toast.error("Failed to load blogs");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBlogs();
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;

    try {
      await apiClient(API_ENDPOINTS.adminBlogs + `/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      });

      toast.success("Blog deleted");
      fetchBlogs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "published" | "draft",
  ) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";

      await apiClient(API_ENDPOINTS.adminBlogs + `/${id}/status`, {
        method: "PATCH",
        token: token ?? undefined,
        body: { status: newStatus },
      });

      toast.success(
        `Post ${newStatus === "published" ? "published" : "unpublished"} successfully`,
      );

      fetchBlogs();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await apiClient(`${API_ENDPOINTS.adminBlogs}/${id}/restore`, {
        method: "PATCH",
        token: token ?? undefined,
      });

      toast.success("Blog restored");
      fetchBlogs();
    } catch {
      toast.error("Restore failed");
    }
  };

  const filteredBlogs =
    filter === "all" ? blogs : blogs.filter((b) => b.status === filter);

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        {/* ================= Header ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          {/* Title */}
          <h1 className="text-3xl font-bold">Blog Management</h1>

          {/* Filter */}
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[280px] h-11 rounded-xl border bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="bg-white rounded-xl shadow-md">
              <SelectItem value="all">All Blogs</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* ================= Table Card ================= */}
        <div
          className={`rounded-2xl shadow-lg ${colors.card} border ${colors.border}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              {/* ================= Table Head ================= */}
              <thead className={`${colors.background} sticky top-0 z-10`}>
                <tr className={`border-b ${colors.border}`}>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Blog</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Author</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Created</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>

              {/* ================= Table Body ================= */}
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className={`border-b ${colors.border} hover:bg-gray-50 transition`}
                  >
                    {/* ID */}
                    <td className="p-2 text-xs text-gray-500">
                      {blog._id.slice(-6)}
                    </td>

                    {/* Blog Image + Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-4 justify-center">
                        {/* Image */}
                        <img
                          src={blog.coverImageUrl || "/placeholder.png"}
                          alt="cover"
                          className="w-16 h-12 object-cover rounded-lg border"
                        />

                        {/* Text */}
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            /blog/{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-2">{blog.categoryId?.name}</td>

                    {/* Author */}
                    <td className="p-2">{blog.authorId?.name}</td>

                    {/* Status Badge */}
                    <td className="p-2">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-2">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-2">
                      <div className="flex justify-center gap-3">
                        {blog.status === "published" && !blog.isDeleted && (
                          <button
                            onClick={() => navigate(`/blog/${blog.slug}`)}
                            title="View Blog"
                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                          >
                            <Eye size={18} />
                          </button>
                        )}

                        {!blog.isDeleted && (
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                blog._id,
                                blog.status as "published" | "draft",
                              )
                            }
                            title={
                              blog.status === "published"
                                ? "Unpublish"
                                : "Publish"
                            }
                            className={`p-2 rounded-lg transition ${
                              blog.status === "published"
                                ? "hover:bg-red-100 text-red-600"
                                : "hover:bg-green-100 text-green-600"
                            }`}
                          >
                            {blog.status === "published" ? (
                              <MdOutlineUnpublished />
                            ) : (
                              <MdOutlinePublishedWithChanges />
                            )}
                          </button>
                        )}

                        {blog.isDeleted ? (
                          <button
                            onClick={() => handleRestore(blog._id)}
                            title="Restore Blog"
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                          >
                            <RotateCcw size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(blog._id)}
                            title="Delete Blog"
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No blogs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
