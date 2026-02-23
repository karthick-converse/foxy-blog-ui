"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import type { Tag } from "../../interface/Tag";

export default function TagPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  const { token } = useAuth();
  const [editId, setEditId] = useState<string | null>(null);

  const handleReset = () => {
    setForm({ name: "", slug: "" });
    setEditId(null);
  };

  const fetchTags = async () => {
    const data = await apiClient(API_ENDPOINTS.tags, {
      method: "GET",
      token: token ?? undefined,
    });

    setTags(data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const endpoint = editId
      ? `${API_ENDPOINTS.tags}/${editId}`
      : API_ENDPOINTS.tags;

    await apiClient(endpoint, {
      method,
      token: token ?? undefined,
      body: form,
    });

    handleReset();
    fetchTags();
  };

  const handleEdit = (tag: Tag) => {
    setForm({
      name: tag.name,
      slug: tag.slug,
    });
    setEditId(tag._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return;

    await apiClient(`${API_ENDPOINTS.tags}/${id}`, {
      method: "DELETE",
      token: token ?? undefined,
    });

    fetchTags();
  };

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <div className="max-w-[1700px] mx-auto px-5 py-7">
        <h1 className={`text-4xl font-bold mb-5`}>Tag Management</h1>

        {/* ================= Form ================= */}
        <form
          onSubmit={handleSubmit}
          className={`shadow-md rounded-lg p-5 border ${colors.card} ${colors.border}`}
        >
          <h2 className={`text-lg font-semibold mb-4`}>
            {editId ? "Edit Tag" : "Create Tag"}
          </h2>

          <div className="flex flex-col lg:items-end lg:flex-row  gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-900">
                Tag Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className={`w-full border px-3 py-2 text-sm rounded-md ${colors.border}`}
              />
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600">Slug</label>
              <input
                type="text"
                value={form.slug}
                readOnly
                className={`w-full border px-3 py-2 text-sm rounded-md bg-gray-100 cursor-not-allowed ${colors.border}`}
              />
            </div>

            <div className="flex gap-2">
              {editId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className={`px-5 py-2  lg:h-[40px]  text-sm rounded-md transition ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>

        {/* ================= Tag List ================= */}
        <div
          className={`shadow-lg rounded-2xl p-6 border mt-8 ${colors.card} ${colors.border}`}
        >
          <h2 className={`text-xl font-semibold mb-6`}>All Tags</h2>

          {tags.length === 0 ? (
            <p className="text-gray-500">No tags found.</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
              {tags.map((tag) => (
                <div
                  key={tag._id}
                  className={`flex justify-between items-center border rounded-xl p-4 transition hover:opacity-90 ${colors.border}`}
                >
                  <div>
                    <h3 className={`font-semibold`}>{tag.name}</h3>
                    <p className="text-sm text-gray-500">Slug: {tag.slug}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-2 rounded-lg hover:bg-yellow-100 text-yellow-600 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(tag._id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
