import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../components/ui/command";
import { Badge } from "../components/ui/badge";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import RichTextEditor from "../components/common/RichTextEditor";
import { colors } from "../theme/colors";
import type { Tag } from "../interface/Tag";
import type { Category } from "../interface/Category";

export default function CreatePost() {
  const { token } = useAuth();


  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const initialFormState = {
    title: "",
    excerpt: "",
    contentHtml: "",
    contentJson: null as Record<string, unknown> | null,
    status: "draft",
    seoKeywords: "",
    categoryId: "",
    tagIds: [] as string[],
    coverImageUrl: "",
    galleryImageUrls: [] as string[],
  };

  const [form, setForm] = useState(initialFormState);

  /* ---------------- FETCH META ---------------- */

  useEffect(() => {
    const fetchMeta = async () => {
      const [cats, tgs] = await Promise.all([
        apiClient(API_ENDPOINTS.categories, {
          token: token ?? undefined,
        }),
        apiClient(API_ENDPOINTS.tags, {
          token: token ?? undefined,
        }),
      ]);
      setCategories(cats.data || cats);
      setTags(tgs.data || tgs);
    };
    fetchMeta();
  }, []);

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadCover = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await apiClient(API_ENDPOINTS.blogCover, {
      method: "POST",
      body: formData,
      token: token ?? undefined,
    });

    setForm((prev) => ({ ...prev, coverImageUrl: res.url }));
    setCoverPreview(res.url);
  };

  const uploadGallery = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    const res = await apiClient(API_ENDPOINTS.blogGallery, {
      method: "POST",
      body: formData,
      token: token ?? undefined,
    });

    const urls = (res.images as Array<{ url: string }>).map((img) => img.url);

    setForm((prev) => ({
      ...prev,
      galleryImageUrls: [...prev.galleryImageUrls, ...urls],
    }));

    setGalleryPreviews((prev) => [...prev, ...urls]);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const toastId = toast.loading("Publishing...");

    try {
      setLoading(true);
      await apiClient(API_ENDPOINTS.posts, {
        method: "POST",
        body: {
          ...form,
          seoKeywords: form.seoKeywords
            ? form.seoKeywords.split(",").map((k) => k.trim())
            : [],
        },
        token: token ?? undefined,
      });

      setForm(initialFormState);
      setCoverPreview(null);
      setGalleryPreviews([]);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
      toast.success("Post Created", { id: toastId });
      setLoading(false);
    } catch {
      toast.error("Failed to publish", { id: toastId });
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl bg-white p-10 rounded-2xl shadow-sm space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Create Blog Post
        </h1>

        {/* ---------- TITLE ---------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Title</label>
          <Input
            placeholder="Enter post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* ---------- EXCERPT ---------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Excerpt</label>
          <Textarea
            rows={2}
            placeholder="Short description"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

        {/* ---------- CATEGORY + TAGS ---------- */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Category
            </label>

            <Select
              value={form.categoryId}
              onValueChange={(value) => setForm({ ...form, categoryId: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                className="max-h-60 overflow-y-auto"
              >
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Tags</label>

            <Popover>
              <PopoverTrigger asChild>
                <div className="min-h-[42px] border rounded-md px-3 py-2 flex flex-wrap gap-2 cursor-pointer bg-white">
                  {form.tagIds.length === 0 && (
                    <span className="text-sm text-gray-400">Select tags</span>
                  )}

                  {form.tagIds.map((id) => {
                    const tag = tags.find((t) => t._id === id);
                    return (
                      <Badge key={id}>
                        {tag?.name}
                        <X
                          size={14}
                          className="ml-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((prev) => ({
                              ...prev,
                              tagIds: prev.tagIds.filter((tid) => tid !== id),
                            }));
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="center"
                className="w-[520px] p-0"
              >
                {" "}
                <Command>
                  <CommandInput placeholder="Search tags..." />

                  <CommandEmpty>No tags found</CommandEmpty>

                  {/* 🔥 Scrollable Area */}
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {tags.map((tag) => {
                      const selected = form.tagIds.includes(tag._id);

                      return (
                        <CommandItem
                          key={tag._id}
                          onSelect={() =>
                            setForm((prev) => ({
                              ...prev,
                              tagIds: selected
                                ? prev.tagIds.filter((id) => id !== tag._id)
                                : [...prev.tagIds, tag._id],
                            }))
                          }
                        >
                          <div className="flex justify-between w-full">
                            {tag.name}
                            {selected && <Check size={14} />}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* ---------- COVER ---------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">
            Cover Image
          </label>
          <Input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            onChange={(e) => e.target.files && uploadCover(e.target.files[0])}
          />

          {coverPreview && (
            <div className="relative mt-4">
              <img
                src={coverPreview}
                className="h-60 w-full object-cover rounded-xl"
              />
              <button
                onClick={() => {
                  setCoverPreview(null);
                  setForm((prev) => ({
                    ...prev,
                    coverImageUrl: "",
                  }));
                }}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ---------- GALLERY ---------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">
            Image Gallery
          </label>
          <Input
            type="file"
            multiple
            accept="image/*"
            ref={galleryInputRef}
            onChange={(e) => e.target.files && uploadGallery(e.target.files)}
          />

          {galleryPreviews.length > 0 && (
            <div className="flex gap-4 mt-4 overflow-x-auto">
              {galleryPreviews.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="h-28 w-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setGalleryPreviews((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- STATUS + SEO ---------- */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Status</label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              SEO Keywords
            </label>
            <Input
              placeholder="react, javascript"
              value={form.seoKeywords}
              onChange={(e) =>
                setForm({
                  ...form,
                  seoKeywords: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ---------- RICH TEXT ---------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Content</label>
          <RichTextEditor
            value={form.contentHtml}
            onChange={(html, json) =>
              setForm((prev) => ({
                ...prev,
                contentHtml: html,
                contentJson: json,
              }))
            }
          />
        </div>

        {/* ---------- BUTTON ---------- */}
        <div className="flex justify-end pt-4 ">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 h-11 ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
