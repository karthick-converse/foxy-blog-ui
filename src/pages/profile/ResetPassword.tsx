import { useState } from "react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import InputPasswordDemo from "../../components/ui/password-input";
import { colors } from "../../theme/colors";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { toast } from "sonner";

export default function UserResetPassword() {
  const { token } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await apiClient(API_ENDPOINTS.users + "/password", {
        method: "PUT",
        token: token ?? undefined,
        body: {
          oldPassword,
          newPassword,
        },
      });

      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6"
        >
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Reset Password
            </h2>

            <p className="text-sm text-gray-500">
              Enter a new password for your account.
            </p>
          </div>

          {/* New Password */}
          <InputPasswordDemo name="newPassword" label="New Password" required />

          {/* Confirm Password */}
          <InputPasswordDemo
            name="confirmPassword"
            label="Confirm Password"
            required
          />

          {/* Submit Button */}
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

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Make sure your password is at least 8 characters long.
        </p>
      </div>
    </div>
  );
}
