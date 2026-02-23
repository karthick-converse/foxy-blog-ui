import { useRoutes } from "react-router-dom";
import Layout from "./Layout";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import SingleBlog from "./pages/SingleBlog";
import OAuthCallback from "./pages/OAuthCallback";
import ProfilePage from "./pages/profile/ProfilePage";
import CreatePost from "./pages/CreatePost";
import UserResetPassword from "./pages/profile/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryPage from "./pages/admin/CategoryPage";
import TagPage from "./pages/admin/TagPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminBlogPage from "./pages/admin/AdminBlogPage";

import MyBlogs from "./pages/profile/MyBlogs";
import MyLikes from "./pages/profile/MyLikes";
import MyShares from "./pages/profile/MyShares";
import MyBookmarks from "./pages/profile/MyBookmarks";

import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

export default function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/signin", element: <SignIn /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "/blog/:slug", element: <SingleBlog /> },
        { path: "/google/callback", element: <OAuthCallback /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/add-blog", element: <CreatePost /> },
        { path: "/user-reset-password", element: <UserResetPassword /> },

        { path: "/profile/blogs", element: <MyBlogs /> },
        { path: "/profile/likes", element: <MyLikes /> },
        { path: "/profile/shares", element: <MyShares /> },
        { path: "/profile/bookmarks", element: <MyBookmarks /> },

        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/category", element: <CategoryPage /> },
        { path: "/admin/tag", element: <TagPage /> },
        { path: "/admin/users", element: <AdminUsersPage /> },
        { path: "/admin/allblogs", element: <AdminBlogPage /> },
      ],
    },

    { path: "/verify-email", element: <VerifyEmail /> },

    { path: "*", element: <NotFound /> },
  ]);
}
