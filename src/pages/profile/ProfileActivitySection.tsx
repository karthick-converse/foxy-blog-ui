import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, Share2, FileText } from "lucide-react";

export default function ProfileActivitySection() {
  const navigate = useNavigate();

  const items = [
    {
      title: "My Likes",
      icon: <Heart size={20} />,
      path: "/profile/likes",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      title: "My Bookmarks",
      icon: <Bookmark size={20} />,
      path: "/profile/bookmarks",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "My Shares",
      icon: <Share2 size={20} />,
      path: "/profile/shares",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "My Blogs",
      icon: <FileText size={20} />,
      path: "/profile/blogs",
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-5 space-x-4 ">
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-3 mb-11 ">
      <h3 className="text-xl font-semibold mb-6">My Activity</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className={`cursor-pointer p-4 rounded-xl transition hover:shadow-md border ${item.bg}`}
          >
            <div className={`${item.color} mb-2`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}