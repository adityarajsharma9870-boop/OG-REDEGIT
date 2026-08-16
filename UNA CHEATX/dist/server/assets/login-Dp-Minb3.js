import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { b as LogoMark } from "./router-B87loaBw.js";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "@radix-ui/react-label";
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    const OWNER_PASSWORD = "aditya sharma owner of og redegit";
    setTimeout(() => {
      setBusy(false);
      if (password === OWNER_PASSWORD) {
        toast.success("Welcome Back, OG REDEGIT Owner!");
        localStorage.setItem("fake_admin_session", JSON.stringify({
          email: email.trim().toLowerCase() || "unknown@ogredegit.local",
          id: "fake-admin"
        }));
        window.dispatchEvent(new Event("fake_admin_login"));
        navigate({
          to: "/admin"
        });
      } else {
        toast.error("Invalid credentials. Use the owner password.");
      }
    }, 500);
  };
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-grid px-4", children: /* @__PURE__ */ jsxs("div", { className: "glass w-full max-w-md rounded-3xl p-8 animate-float-up", style: {
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsx(LogoMark, { className: "h-14 w-14" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-heading text-2xl font-bold", children: "OG REDEGIT Owner Login" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Use the owner credentials to open the admin panel." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsx("input", { type: "email", required: true, placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" }),
      /* @__PURE__ */ jsx("input", { type: "password", required: true, placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: busy, className: "w-full rounded-xl py-3 font-heading text-sm font-bold text-white disabled:opacity-60", style: {
        background: "var(--gradient-brand)"
      }, children: busy ? "Checking…" : "OPEN ADMIN PANEL" })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
      to: "/"
    }), "aria-label": "Back to home", className: "mx-auto mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg text-muted-foreground hover:bg-secondary/70", children: "←" })
  ] }) });
}
export {
  LoginPage as component
};
