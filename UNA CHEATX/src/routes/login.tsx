import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/site/LogoMark";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/intergrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — OG REDEGIT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAdmin, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const cleanPass = password.trim().toLowerCase().replace(/\s+/g, " ");
    const OWNER_PASSWORDS = [
      "aditya sharma owner of og redegit",
      "aditya sharma",
      "og redegit",
      "ogredegit",
      "devadmine1234",
      "adityarajsharma9070@gmail.com",
      "adityasharma4518@gmail.com",
    ];

    const isOwner = OWNER_PASSWORDS.includes(cleanPass);
    const cleanEmail = email.trim().toLowerCase() || "adityarajsharma9070@gmail.com";

    if (isOwner) {
      loginAsAdmin(cleanEmail);
      toast.success("Welcome Back, OG REDEGIT Owner!");
      setBusy(false);
      navigate({ to: "/admin" });
      return;
    }

    // Attempt Supabase login as fallback
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password.trim(),
      });

      if (!error && data.user) {
        toast.success("Logged in successfully!");
        setBusy(false);
        navigate({ to: "/admin" });
        return;
      }
    } catch {}

    setBusy(false);
    toast.error("Invalid credentials. Please enter the owner password.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid px-4">
      <div className="glass w-full max-w-md rounded-3xl p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-4 font-heading text-2xl font-bold">OG REDEGIT Owner Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use the owner credentials to open the admin panel.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="text"
            name="username_or_email"
            id="username_or_email"
            autoComplete="username"
            placeholder="Email or Username (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-secondary/80 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            required
            placeholder="Owner Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-input bg-secondary/80 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl py-3 font-heading text-sm font-bold text-white transition-opacity duration-150 hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-60"
            style={{ background: "var(--gradient-brand)" }}
          >
            {busy ? "Signing in…" : "OPEN ADMIN PANEL"}
          </button>
        </form>

        <Link
          to="/"
          aria-label="Back to home"
          className="mx-auto mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg text-muted-foreground transition-colors hover:bg-secondary/70 cursor-pointer"
        >
          ←
        </Link>
      </div>
    </div>
  );
}
