"use client";

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import InputPasswordDemo from "../components/ui/password-input";
import { toast } from "sonner";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import { colors } from "../theme/colors";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await apiClient(API_ENDPOINTS.resetPassword, {
        method: "POST",
        body: {
          token,
          newPassword,
        },
      });

      toast.success("Password updated 🔐", {
        description: "You can now sign in with your new password",
      });

      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 className="text-center text-2xl font-bold">Reset Password</h2>

        <p className="text-center text-sm text-muted-foreground">
          Enter a new password for your account.
        </p>

        {/* New Password */}
        <InputPasswordDemo name="newPassword" label="New Password" required />

        {/* Confirm Password */}
        <InputPasswordDemo
          name="confirmPassword"
          label="Confirm Password"
          required
        />

        <Button
          type="submit"
          className={`w-full ${colors.primary.base}
    ${colors.primary.hover} 
    ${colors.primary.text}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
