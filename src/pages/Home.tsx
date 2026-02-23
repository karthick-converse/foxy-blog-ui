import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BlogCard from "./BlogCard";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import BlogCarousel from "../components/common/scrollimage";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";
import type { ReactionType } from "../components/common/Reaction";

type BookmarkResponse = {
  _id: string;
  postId: {
    _id: string;
    title: string;
    coverImageUrl: string;
  };
  createdAt: string;
};
export default function Home() {
  const { token, isAuthenticated } = useAuth();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [userReactions, setUserReactions] = useState<
    Record<string, ReactionType>
  >({});
  const [heroBlog, setHeroBlog] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 9;

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiClient(API_ENDPOINTS.categories, {
          method: "GET",
        });

        const categoryList = data?.categories || data || [];
        setCategories(categoryList.slice(0, 6));
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  /* ================= FETCH HERO BLOG ================= */
  useEffect(() => {
    const fetchHeroBlog = async () => {
      try {
        const res = await apiClient(`${API_ENDPOINTS.posts}?page=1&limit=10`, {
          method: "GET",
        });

        setHeroBlog(res?.data?.blogs || null);
      } catch (error) {
        console.error("Hero blog error:", error);
      }
    };

    fetchHeroBlog();
  }, []);

  /* ================= FETCH BLOGS ================= */
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (activeCategoryId) {
          params.append("categoryId", activeCategoryId);
        }

        if (debouncedSearch) {
          params.append("title", debouncedSearch);
        }

        const res = await apiClient(
          `${API_ENDPOINTS.posts}?${params.toString()}`,
          {
            method: "GET",
          },
        );

        setBlogs(res?.data?.blogs || []);
      } catch (error) {
        console.error("Blog fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [activeCategoryId, debouncedSearch, page]);

  /* ================= FETCH BOOKMARKS ================= */
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchBookmarks = async () => {
      try {
        const res = await apiClient(API_ENDPOINTS.bookmark, {
          method: "GET",
          token,
        });

        const ids = Array.isArray(res)
          ? (res as BookmarkResponse[]).map((b) => b.postId._id)
          : [];
          console.log('ids', ids)
        setBookmarkedIds(ids);
      } catch (err) {
        console.error("Bookmark fetch error:", err);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, token]);

  /* ================= FETCH USER REACTIONS ================= */
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchUserReactions = async () => {
      try {
        const res = await apiClient(API_ENDPOINTS.userReactions, {
          method: "GET",
          token,
        });

        const reactionsArray = res?.data ?? [];
        if (!Array.isArray(reactionsArray)) {
          console.error("Reactions is not array:", reactionsArray);
          return;
        }

        const reactionMap: Record<string, ReactionType> = {};

        reactionsArray.forEach((r: any) => {
          reactionMap[r.targetId._id] = r.reaction;
        });

        setUserReactions(reactionMap);
      } catch (err) {
        console.error("Reaction fetch error:", err);
      }
    };

    fetchUserReactions();
  }, [isAuthenticated, token]);

  const handleReactionChange = (
    postId: string,
    reaction: ReactionType | null,
  ) => {
    setUserReactions((prev) => {
      const updated = { ...prev };

      if (reaction) {
        updated[postId] = reaction;
      } else {
        delete updated[postId];
      }

      return updated;
    });
  };
  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-6 pt-6 lg:pt-1 sm:pt-20 pb-6">
        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          Browse Our Resources
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl">
          We provide tips and resources from industry leaders.
        </p>
      </div>

      <div className="w-full relative left-1/2 right-1/2 -mx-[50vw]">
        <BlogCarousel blogs={heroBlog} />
      </div>
      {/* ================= CATEGORY + SEARCH ================= */}
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-6">
          {/* Top Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {/* All Button */}
              <button
                onClick={() => {
                  setActiveCategoryId(null);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  !activeCategoryId
                    ? `${colors.primary.base} ${colors.primary.text} shadow-md`
                    : `${colors.secondary.base} ${colors.secondary.text} ${colors.secondary.hoverBg}`
                }`}
              >
                All
              </button>

              {/* Category Buttons */}
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setActiveCategoryId(cat._id);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategoryId === cat._id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
                className="relative w-full lg:w-80"
              >
                <input
                  type="text"
                  placeholder="Search blog..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm 
      focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />

                {/* Search Icon */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </motion.div>

              {/* Search Icon */}
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* ================= BLOG GRID ================= */}
        <section className="pb-20 min-h-[300px]">
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No blogs found.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  isBookmarked={bookmarkedIds.includes(blog.id)}
                  isReacted={!!userReactions[blog.id]}
                  userReaction={userReactions[blog.id] ?? null}
                  onBookmarkToggle={(postId: string, next: boolean) => {
                    setBookmarkedIds((prev) =>
                      next
                        ? [...prev, postId]
                        : prev.filter((id) => id !== postId),
                    );
                  }}
                  onReactionChange={handleReactionChange}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
