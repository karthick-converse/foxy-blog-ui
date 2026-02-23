import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import blogLogo from "../../assets/blog_logo.png";
import dummyAvatar from "../../assets/dummy.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NotificationLink from "./Notification";
import { PenSquare } from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";

/* ---------------- NAV LINK STYLE ---------------- */

const navLink =
  "text-sm font-medium text-stone-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1";
/* ---------------- NOTIFICATION LINK ---------------- */

/* ---------------- NAVBAR ---------------- */

export default function Navbar() {
  const { isAuthenticated, user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  /* -------- Fetch profile -------- */
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMe = async () => {
      try {
        const data = await apiClient(API_ENDPOINTS.users, {
          token: token ?? undefined,
        });

        setProfile(data);
      } catch {
        console.error("Failed to fetch profile");
      }
    };
    if (token) fetchMe();
  }, [isAuthenticated, token]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const avatarSrc = profile?.profile?.avatarUrl || dummyAvatar;

  return (
    <header
      className={`border-b ${colors.border} ${colors.card} shadow-sm sticky top-0 z-50`}
    >
      <div className="mx-auto flex max-w-[1700px] items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={blogLogo}
            alt="Foxy Blog"
            className="h-9 w-9 sm:h-11 sm:w-11"
          />
          <span className={`text-lg font-bold ${colors.primary.link}`}>
            Foxy Blog
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {!isAuthenticated ? (
            <>
              <Link to="/signin" className={navLink}>
                Sign In
              </Link>

              <Link to="/register" className={navLink}>
                Register
              </Link>

              <Link
                className={`${navLink} hidden sm:flex items-center gap-2`}
                to="/signin"
              >
                <PenSquare size={18} />
                Write Blog
              </Link>
            </>
          ) : (
            <>
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-6">
                <Link className={navLink} to="/">
                  Home
                </Link>

                {user?.role !== "admin" && (
                  <>
                    <Link
                      className={`${navLink} flex items-center gap-1`}
                      to="/add-blog"
                    >
                      <PenSquare size={18} />
                      Write Blog
                    </Link>
                    <NotificationLink />
                  </>
                )}

                {user?.role === "admin" && (
                  <>
                    <Link className={navLink} to="/admin/allblogs">
                      Blogs
                    </Link>

                    <Link className={navLink} to="/admin/tag">
                      Tag
                    </Link>

                    <Link className={navLink} to="/admin/category">
                      Category
                    </Link>

                    <Link className={navLink} to="/admin/users">
                      Users
                    </Link>
                    <NotificationLink />
                  </>
                )}
              </nav>

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2">
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="h-9 w-9 rounded-full border"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {/* Mobile Nav (shown inside dropdown) */}
                  <div className="lg:hidden">
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      Home
                    </DropdownMenuItem>

                    {user?.role !== "admin" && (
                      <DropdownMenuItem onClick={() => navigate("/add-blog")}>
                        Write Blog
                      </DropdownMenuItem>
                    )}

                    {user?.role === "admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/admin/allblogs")}
                        >
                          Blogs
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate("/admin/tag")}
                        >
                          Tag
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate("/admin/category")}
                        >
                          Category
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate("/admin/users")}
                        >
                          Users
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => navigate("/admin/dashboard")}
                        >
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                  </div>

                  {/* Common Options */}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate("/user-reset-password")}
                  >
                    Password
                  </DropdownMenuItem>

                  {user?.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
