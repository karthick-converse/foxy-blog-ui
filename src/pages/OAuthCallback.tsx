import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    const handleGoogleLogin = async () => {
      const code = params.get("code");

      if (!code) {
        toast.error("Google login failed");
        window.location.replace("/signin");
        return;
      }

      try {
        const data = await apiClient(
          `${API_ENDPOINTS.googleCallback}?code=${encodeURIComponent(code)}`
        );

        const { accessToken, user } = data.result;

        if (!accessToken || !user) {
          throw new Error("Invalid auth response");
        }

        login(accessToken, user);

        toast.success("Logged in with Google 🎉");

        window.location.replace("/");
      } catch (error) {
        console.error(error);
        toast.error("Google login failed");
        window.location.replace("/signin");
      }
    };

    handleGoogleLogin();
  }, [params, login]);

  return (
    <p className="mt-10 text-center text-slate-600">
      Signing you in with Google…
    </p>
  );
}
