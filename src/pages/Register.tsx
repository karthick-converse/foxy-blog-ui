"use client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import InputPasswordDemo from "../components/ui/password-input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export default function SignUp() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are the same",
      });
      return;
    }

    await apiClient(API_ENDPOINTS.signup, {
      method: "POST",
      body: {
        name,
        email,
        password,
      },
    });

    toast.success("Verification email sent 📩", {
      description:
        "Please check your email and verify your account before signing in.",
    });

    e.currentTarget.reset();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${colors.background}`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE (hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <h1 className={`text-4xl font-bold`}>
            Join Us 🚀
          </h1>
          <p className={`text-lg `}>
            Create an account to start publishing blogs and managing your
            content.
          </p>
        </div>

        {/* RIGHT SIDE (Form Card) */}
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-md mx-auto space-y-6 rounded-2xl p-8 shadow-xl border backdrop-blur-sm ${colors.card} ${colors.border}`}
        >
          <h2
            className={`text-center text-2xl sm:text-3xl font-bold `}
          >
            Create Account
          </h2>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name</Label>
            <Input
              name="name"
              placeholder="Your name"
              required
              className={`${colors.primary.ring} h-11`}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className={`${colors.primary.ring} h-11`}
            />
          </div>

          {/* Password */}
          <InputPasswordDemo
            name="password"
            placeholder="Password"
            required
            className={`${colors.primary.ring} h-11`}
          />

          {/* Confirm Password */}
          <InputPasswordDemo
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            required
            className={`${colors.primary.ring} h-11`}
          />

          {/* Submit */}
          <Button
            type="submit"
            className={`w-full h-11 ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
          >
            Sign Up
          </Button>

          {/* Already have account */}
          <div className="text-center text-sm">
            <span className={colors.text.muted}>Already have an account? </span>
            <Link
              to="/signin"
              className={`${colors.primary.link} font-medium hover:underline`}
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
