"use client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import InputPasswordDemo from "../components/ui/password-input";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS, BASE_URL } from "../lib/endpoints";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      toast.error("Missing fields");
      return;
    }

    const res = await apiClient(API_ENDPOINTS.login, {
      method: "POST",
      body: { email, password },
    });

    const { accessToken, role } = res.data;

    login(accessToken, { email: String(email), role });

    toast.success("Login successful 👋", {
      description: `Logged in as ${role}`,
    });

    navigate(role === "admin" ? "/admin/dashboard" : "/");
  };

  const handleGoogleLogin = () => {
    window.location.href = BASE_URL + API_ENDPOINTS.googleOauth;
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${colors.background}`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE (Brand Section - hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <h1 className={`text-4xl font-bold ${colors.text.primary}`}>
            Welcome Back 👋
          </h1>
          <p className={`text-lg ${colors.text.muted}`}>
            Sign in to continue managing your blogs, posts and dashboard.
          </p>
        </div>

        {/* RIGHT SIDE (Form Card) */}
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-md mx-auto space-y-6 rounded-2xl p-8 shadow-xl border backdrop-blur-sm ${colors.card} ${colors.border}`}
        >
          <h2
            className={`text-center text-2xl sm:text-3xl font-bold ${colors.text.primary}`}
          >
            Sign In
          </h2>

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label className={colors.text.primary}>Email</Label>
              <Input
                name="email"
                type="email"
                required
                className={`${colors.primary.ring} h-11`}
              />
            </div>

            {/* Password */}
            <InputPasswordDemo
              name="password"
              required
              className={`${colors.primary.ring} h-11`}
            />

            {/* Submit */}
            <Button
              type="submit"
              className={`w-full h-11 ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
            >
              Sign In
            </Button>
          </div>

          {/* Divider */}
          <div className="relative text-center text-sm">
            <span
              className={`px-2 relative z-10 ${colors.text.muted} ${colors.card}`}
            >
              or continue with
            </span>
            <div
              className={`absolute inset-x-0 top-1/2 h-px ${colors.border}`}
            />
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className={`w-full h-11 flex items-center justify-center gap-3 ${colors.secondary.border} ${colors.secondary.text} ${colors.secondary.hoverBg}`}
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className={`${colors.primary.link} hover:underline`}
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
