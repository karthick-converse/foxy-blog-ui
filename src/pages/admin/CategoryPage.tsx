"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { colors } from "../../theme/colors";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const { token } = useAuth();

  const handleReset = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
    });
    setEditId(null);
  };
  const fetchCategories = async () => {
    try {
      const data = await apiClient(API_ENDPOINTS.categories, {
        token: token ?? undefined,
      });

      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
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
      ...prev,[e.target.name]:value,...(e.target.name === "name"&&{slug:generateSlug(value)})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await apiClient(`${API_ENDPOINTS.categories}/${editId}`, {
          method: "PUT",
          body: form,
          token: token ?? undefined,
        });
      } else {
        await apiClient(API_ENDPOINTS.categories, {
          method: "POST",
          body: form,
          token: token ?? undefined,
        });
      }

      setForm({ name: "", slug: "", description: "" });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleEdit = (category: Category) => {
    setForm(category);
    setEditId(category._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient(`${API_ENDPOINTS.categories}/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      });

      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className={`max-w-[1700px] mx-auto p-6 ${colors.background}`}>
      <h1 className={`text-3xl font-bold mb-8`}>
        Category Management
      </h1>

      <div>
        <form
          onSubmit={handleSubmit}
          className={`shadow-md rounded-lg p-5 border ${colors.card} ${colors.border}`}
        >
           <h2 className={`text-lg font-semibold mb-4`}>
            {editId ? "Edit Category" : "Create Category"}
          </h2>
          <div className="flex flex-col lg:flex-row items-end gap-4">
            {/* Category Name */}
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-900">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Category name"
                value={form.name}
                onChange={handleChange}
                required
                className={`w-full border px-3 py-2 text-sm rounded-md ${colors.border}`}
              />
            </div>

            {/* Slug */}
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-900">Slug</label>
              <input
                type="text"
                value={form.slug}
                readOnly
                className={`w-full border px-3 py-2 text-sm rounded-md bg-gray-100 cursor-not-allowed ${colors.border}`}
              />
            </div>

            {/* Description */}
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-900">
                Description
              </label>
              <input
                type="text"
                name="description"
                placeholder="Short description"
                value={form.description}
                onChange={handleChange}
                required
                className={`w-full border px-3 py-2 text-sm rounded-md ${colors.border}`}
              />
            </div>

            {/* Buttons */}
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
                className={`px-5 py-2 text-sm rounded-md transition ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div>
        <div
          className={`shadow-md rounded-lg p-6 mt-8 mb-20 border ${colors.card} ${colors.border}`}
        >
          <h2 className={`text-xl font-semibold mb-8`}>
            All Categories
          </h2>

          {categories.length === 0 ? (
            <p className={colors.text.muted}>No categories found.</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 ">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className={`flex justify-between items-center p-4 rounded-md border ${colors.border}`}
                >
                  <div>
                    <h3 className={`font-bold`}>
                      {cat.name}
                    </h3>
                    <p className={`text-sm  text-gray-500`}>
                      Slug: {cat.slug}
                    </p>
                    {cat.description && (
                      <p className={`text-sm`}>
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800"
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
