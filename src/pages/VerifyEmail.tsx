"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "../lib/endpoints";
import { apiClient } from "../lib/apiClient";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus("error");
          return;
        }

        await apiClient(`${API_ENDPOINTS.emailverify}/${token}`, {
          method: "GET",
        });

        setStatus("success");

        toast.success("Email verified successfully 🎉");

        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (error) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleResend = async () => {
    try {
      const email = params.get("email");

      if (!email) {
        toast.error("Email not available");
        return;
      }

      setResending(true);
      await apiClient(API_ENDPOINTS.resendemail, {
        method: "POST",
        body: email,
      });

      toast.success("Verification email sent again 📩");
    } catch {
      toast.error("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-6 p-8 border rounded-2xl shadow-sm bg-white">
        {/* LOADING */}
        {status === "loading" && (
          <>
            <Loader2
              className="mx-auto animate-spin text-indigo-600"
              size={40}
            />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
            <p className="text-sm text-gray-500">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-600" size={48} />
            <h2 className="text-2xl font-semibold">Email Verified 🎉</h2>
            <p className="text-gray-500 text-sm">
              Your email has been successfully verified. Redirecting to sign
              in...
            </p>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-600" size={48} />
            <h2 className="text-2xl font-semibold">Verification Failed</h2>
            <p className="text-gray-500 text-sm">
              The link may be invalid or expired.
            </p>

            <button
              onClick={handleResend}
              disabled={resending}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend Verification Email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
