import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LogoMark } from "@/components/site/LogoMark";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — OG REDEGIT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const OWNER_PASSWORD = "aditya sharma owner of og redegit";

    setTimeout(() => {
      setBusy(false);
      if (password === OWNER_PASSWORD) {
        toast.success("Welcome Back, OG REDEGIT Owner!");
        localStorage.setItem("fake_admin_session", JSON.stringify({ email: email.trim().toLowerCase() || "unknown@ogredegit.local", id: "fake-admin" }));
        window.dispatchEvent(new Event("fake_admin_login"));
        navigate({ to: "/admin" });
      } else {
        toast.error("Invalid credentials. Use the owner password.");
      }
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid px-4">
      <div className="glass w-full max-w-md rounded-3xl p-8 animate-float-up" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-4 font-heading text-2xl font-bold">OG REDEGIT Owner Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use the owner credentials to open the admin panel.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl py-3 font-heading text-sm font-bold text-white disabled:opacity-60"
            style={{ background: "var(--gradient-brand)" }}
          >
            {busy ? "Checking…" : "OPEN ADMIN PANEL"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          aria-label="Back to home"
          className="mx-auto mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg text-muted-foreground hover:bg-secondary/70"
        >
          ←
        </button>
      </div>
    </div>
  );
}
