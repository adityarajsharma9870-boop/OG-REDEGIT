import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/intergrations/supabase/client";
import { LoadingScreen } from "@/components/site/LoadingScreen";

type SearchParams = {
  code?: string;
  error?: string;
  error_description?: string;
};

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Authenticating..." }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as SearchParams;
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // If there's an error from OAuth provider
        if (search.error) {
          console.error('[auth/callback] OAuth error:', search.error, search.error_description);
          toast.error(search.error_description || "Authentication failed");
          setIsProcessing(false);
          setTimeout(() => navigate({ to: "/login" }), 2000);
          return;
        }

        // If there's a code, exchange it for session
        if (search.code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(search.code);
          if (error) {
            console.error('[auth/callback] Session exchange error:', error);
            toast.error("Failed to complete authentication");
            setIsProcessing(false);
            setTimeout(() => navigate({ to: "/login" }), 2000);
            return;
          }

          if (data?.session) {
            toast.success("Welcome!");
            setIsProcessing(false);
            navigate({ to: "/dashboard" });
            return;
          }
        }

        // No code and no error = something went wrong
        toast.error("Invalid authentication response");
        setIsProcessing(false);
        setTimeout(() => navigate({ to: "/login" }), 2000);
      } catch (err) {
        console.error('[auth/callback] Unexpected error:', err);
        toast.error("Authentication error. Please try again.");
        setIsProcessing(false);
        setTimeout(() => navigate({ to: "/login" }), 2000);
      }
    };

    handleCallback();
  }, [search, navigate]);

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid">
      <LoadingScreen />
    </div>
  );
}
