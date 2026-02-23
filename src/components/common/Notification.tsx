import { Bell, Check, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationLink() {
  const { token } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient(`${API_ENDPOINTS.notification}`, {
        method: "GET",
        token: token ?? undefined,
      });
      setNotifications(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await apiClient(
        `${API_ENDPOINTS.notification}/unread-count`,
        {
          method: "GET",
          token: token ?? undefined,
        },
      );
      setUnreadCount(res.unread);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient(`${API_ENDPOINTS.notification}/${id}/read`, {
        method: "PUT",
        token: token ?? undefined,
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient(`${API_ENDPOINTS.notification}/read-all`, {
        method: "PUT",
        token: token ?? undefined,
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      setUnreadCount(0);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Bell className="h-5 w-5 text-stone-600 hover:text-stone-900 transition" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 rounded-xl shadow-lg border"
      >
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold text-sm">Notifications</span>

          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
          >
            <CheckCheck size={16} strokeWidth={3} />
            Mark all
          </button>
        </div>

        {/* ---------- LIST ---------- */}
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No notifications 🎉
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n._id}
                className={`group flex items-center justify-between gap-3 px-4 py-3 text-sm transition ${
                  !n.read ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                {/* Message */}
                <div className="flex-1">
                  <p className={!n.read ? "font-semibold" : ""}>{n.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Center Thick Check */}
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-blue-100 transition"
                  >
                    <Check
                      size={18}
                      strokeWidth={3}
                      className="text-blue-600"
                    />
                  </button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {/* ---------- FOOTER ---------- */}
        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem asChild className="justify-center py-2">
          <Link
            to="/notifications"
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
