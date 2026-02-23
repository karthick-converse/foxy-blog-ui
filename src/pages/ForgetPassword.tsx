"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = new FormData(e.currentTarget).get("email");

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient(API_ENDPOINTS.forgetPassword, {
        method: "POST",
        body: { email },
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to send reset email");
      }

      toast.success("Password reset email sent 📩", {
        description:
          "Check your inbox for a reset link. The link expires in 15 minutes.",
      });

      e.currentTarget.reset();
    } 
  finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${colors.background}`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* LEFT SIDE (hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <h1 className={`text-4xl font-bold ${colors.text.primary}`}>
            Reset Your Password 🔐
          </h1>
          <p className={`text-lg ${colors.text.muted}`}>
            Enter your registered email and we’ll send you a secure password reset link.
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
            Forgot Password
          </h2>

          <p className={`text-center text-sm ${colors.text.muted}`}>
            Enter your email and we’ll send a reset link.
          </p>

          {/* Email */}
          <div className="space-y-2">
            <Label className={colors.text.primary}>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={loading}
              className={`${colors.primary.ring} h-11`}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-11 ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Back to login */}
          <div className="text-center text-sm">
            <span className={colors.text.muted}>
              Remember your password?{" "}
            </span>
            <Link
              to="/signin"
              className={`${colors.primary.link} font-medium hover:underline`}
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
