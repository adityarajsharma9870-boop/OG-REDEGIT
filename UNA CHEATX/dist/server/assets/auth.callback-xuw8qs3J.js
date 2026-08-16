import { jsx } from "react/jsx-runtime";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { L as LoadingScreen, s as supabase } from "./router-B87loaBw.js";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "@radix-ui/react-label";
function AuthCallback() {
  const navigate = useNavigate();
  const search = useSearch({
    strict: false
  });
  const [isProcessing, setIsProcessing] = useState(true);
  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (search.error) {
          console.error("[auth/callback] OAuth error:", search.error, search.error_description);
          toast.error(search.error_description || "Authentication failed");
          setIsProcessing(false);
          setTimeout(() => navigate({
            to: "/login"
          }), 2e3);
          return;
        }
        if (search.code) {
          const {
            data,
            error
          } = await supabase.auth.exchangeCodeForSession(search.code);
          if (error) {
            console.error("[auth/callback] Session exchange error:", error);
            toast.error("Failed to complete authentication");
            setIsProcessing(false);
            setTimeout(() => navigate({
              to: "/login"
            }), 2e3);
            return;
          }
          if (data?.session) {
            toast.success("Welcome!");
            setIsProcessing(false);
            navigate({
              to: "/dashboard"
            });
            return;
          }
        }
        toast.error("Invalid authentication response");
        setIsProcessing(false);
        setTimeout(() => navigate({
          to: "/login"
        }), 2e3);
      } catch (err) {
        console.error("[auth/callback] Unexpected error:", err);
        toast.error("Authentication error. Please try again.");
        setIsProcessing(false);
        setTimeout(() => navigate({
          to: "/login"
        }), 2e3);
      }
    };
    handleCallback();
  }, [search, navigate]);
  if (!isProcessing) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-grid", children: /* @__PURE__ */ jsx(LoadingScreen, {}) });
}
export {
  AuthCallback as component
};
