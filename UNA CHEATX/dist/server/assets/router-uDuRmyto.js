import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, useNavigate, useSearch, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Toaster as Toaster$1, toast } from "sonner";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import * as LabelPrimitive from "@radix-ui/react-label";
const appCss = "/assets/styles-Cj_B29ze.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function createSupabaseClient() {
  const SUPABASE_URL = "https://tsjaphhtxltdhtyvvlse.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzamFwaGh0eGx0ZGh0eXZ2bHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzkyODksImV4cCI6MjA5NTY1NTI4OX0.c9Ji8Y-yV8zCzwRCHdG30j_dRn_gfdAi64gTigrn8aE";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const Ctx = createContext({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {
  }
});
function AuthProvider$1({ children }) {
  const FAKE_ADMIN_EMAIL = "adityasharma4518@gmail.com";
  const FAKE_ADMIN_KEY = "fake_admin_session";
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadFakeAdmin = () => {
      if (typeof window === "undefined") return false;
      const stored = localStorage.getItem(FAKE_ADMIN_KEY);
      if (!stored) return false;
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.email?.toLowerCase() !== FAKE_ADMIN_EMAIL) {
          localStorage.removeItem(FAKE_ADMIN_KEY);
          return false;
        }
        const fakeSession = { user: { id: parsed.id || "fake-admin", email: parsed.email } };
        setSession(fakeSession);
        setIsAdmin(true);
        return true;
      } catch {
        localStorage.removeItem(FAKE_ADMIN_KEY);
        return false;
      }
    };
    const checkAdmin = async (uid, email) => {
      if (email?.toLowerCase() === FAKE_ADMIN_EMAIL) {
        setIsAdmin(true);
        return;
      }
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) {
        setSession(s);
        checkAdmin(s.user?.id, s.user?.email);
      } else {
        setSession(null);
        if (!loadFakeAdmin()) setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        checkAdmin(data.session.user?.id, data.session.user?.email);
      } else if (!loadFakeAdmin()) {
        setSession(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    window.addEventListener("fake_admin_login", loadFakeAdmin);
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("fake_admin_login", loadFakeAdmin);
    };
  }, []);
  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(FAKE_ADMIN_KEY);
    }
    setSession(null);
    setIsAdmin(false);
    await supabase.auth.signOut();
  };
  return /* @__PURE__ */ jsx(Ctx.Provider, { value: { user: session?.user ?? null, session, isAdmin, loading, signOut }, children });
}
const useAuth$1 = () => useContext(Ctx);
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateAuth = useCallback((newUser, newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    if (newUser) {
      localStorage.setItem("admin_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("admin_user");
    }
    setUser(newUser);
    setToken(newToken);
  }, []);
  const API_URL = "http://localhost:5000/api/auth";
  const signup = useCallback(async (email, password, firstName = "", lastName = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      return {
        success: true,
        message: data.message,
        user: data.user
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.verified === false) {
          return {
            success: false,
            message: data.message,
            verified: false,
            email
          };
        }
        throw new Error(data.message || "Login failed");
      }
      if (data.token) {
        updateAuth(data.user, data.token);
      } else {
        setUser(data.user);
      }
      return {
        success: true,
        message: data.message,
        user: data.user,
        token: data.token
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);
  const verifyEmail = useCallback(async (token2) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token2 })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Email verification failed");
      }
      return {
        success: true,
        message: data.message
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);
  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Forgot password failed");
      }
      return {
        success: true,
        message: data.message
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);
  const resetPassword = useCallback(async (token2, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token2, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }
      return {
        success: true,
        message: data.message
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);
  const resendVerificationEmail = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }
      return {
        success: true,
        message: data.message
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);
  const getCurrentUser = useCallback(async () => {
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      });
      if (!response.ok) {
        localStorage.removeItem("authToken");
        setToken(null);
        return null;
      }
      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (err) {
      return null;
    }
  }, [token]);
  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    getCurrentUser,
    updateAuth,
    isAuthenticated: !!token && !!user
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function CursorGlow() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("cursor-host");
    let rx = 0, ry = 0, x = 0, y = 0, raf = 0;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-host");
    };
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: dot, className: "pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-magenta shadow-[0_0_14px_4px_oklch(0.66_0.27_330/0.8)]" }),
    /* @__PURE__ */ jsx("div", { ref: ring, className: "pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-violet/60" })
  ] });
}
const logoMark = "/assets/logo-mark-SLElYU2K.png";
const LOGO_SRC = logoMark;
function LogoMark({ className = "h-9 w-9", src }) {
  if (src) {
    return /* @__PURE__ */ jsx("img", { src, alt: "Brand logo", width: 512, height: 512, className: `${className} object-contain` });
  }
  {
    return /* @__PURE__ */ jsx("img", { src: LOGO_SRC, alt: "UNA CHEATX logo", width: 512, height: 512, className: `${className} object-contain` });
  }
}
function LoadingScreen() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("og_redegit_loading_done");
    }
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Orbitron:wght@600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const t = setInterval(() => {
      setPct((p) => {
        const n = Math.min(100, p + Math.random() * 14 + 4);
        if (n >= 100) {
          clearInterval(t);
          setTimeout(() => {
            setDone(true);
          }, 500);
        }
        return n;
      });
    }, 180);
    return () => clearInterval(t);
  }, []);
  if (done) return null;
  return /* @__PURE__ */ jsxs("div", { className: `fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background bg-grid transition-opacity duration-500 ${pct >= 100 ? "opacity-0" : "opacity-100"}`, children: [
    /* @__PURE__ */ jsx(LogoMark, { className: "mb-6 h-16 w-16 animate-pulse-glow" }),
    /* @__PURE__ */ jsx("h1", { className: "loading-brand", children: "OG REDEGIT" }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 h-[3px] w-64 overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full transition-all duration-200", style: { width: `${pct}%`, background: "var(--gradient-brand)" } }) }),
    /* @__PURE__ */ jsxs("p", { className: "mt-4 font-heading text-xs tracking-[0.35em] text-muted-foreground uppercase", children: [
      "OPTIMIZING SYSTEM... ",
      Math.floor(pct),
      "%"
    ] })
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$a = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$a.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AuthProvider$1, { children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(CursorGlow, {}),
    /* @__PURE__ */ jsx(LoadingScreen, {}),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", theme: "dark", richColors: true })
  ] }) }) });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Route$9 = createFileRoute("/verify-email-sent")({
  head: () => ({ meta: [{ title: "Verify Email Sent — UNA CHEATX" }] }),
  component: VerifyEmailSentPage
});
function VerifyEmailSentPage() {
  const navigate = useNavigate();
  const { resendVerificationEmail } = useAuth();
  const search = useSearch({ from: "/verify-email-sent" });
  const email = search?.email || "";
  const [resending, setResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    setResending(true);
    try {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        setResendCount((prev) => prev + 1);
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(result.message);
      }
    } finally {
      setResending(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-16 h-16 text-green-500" }) }),
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Check Your Email" }),
      /* @__PURE__ */ jsxs(CardDescription, { children: [
        "Verification email sent to ",
        email
      ] })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "We've sent a verification link to your email. Click the link to verify your account and complete your registration." }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-blue-800", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Link expires in 24 hours" }),
            /* @__PURE__ */ jsx("p", { children: "Make sure to verify your email within this time." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("strong", { children: "Tip:" }),
          " Check your spam folder if you don't see the email."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: "w-full bg-purple-600 hover:bg-purple-700",
            onClick: () => navigate({ to: "/login" }),
            children: "Back to Login"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "w-full",
            onClick: handleResendEmail,
            disabled: resending,
            children: resending ? "Sending..." : "Resend Email"
          }
        ),
        resendCount > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-gray-600", children: [
          "Verification email resent ",
          resendCount,
          " time(s)"
        ] })
      ] })
    ] })
  ] }) });
}
const Route$8 = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify Email — UNA CHEATX" }] }),
  component: VerifyEmailPage
});
function VerifyEmailPage() {
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const search = useSearch({ from: "/verify-email" });
  const token = search?.token || "";
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!token) {
      setError("Verification token not found");
      setLoading(false);
      return;
    }
    const performVerification = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setVerified(true);
        toast.success(result.message);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
      setLoading(false);
    };
    performVerification();
  }, [token, verifyEmail]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsx(Card, { className: "w-full max-w-md", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "relative w-12 h-12 mb-4", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-purple-600 rounded-full animate-spin" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Verifying your email..." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "space-y-2 text-center", children: verified ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-16 h-16 text-green-500" }) }),
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Email Verified!" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Your account is now fully activated" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-16 h-16 text-red-500" }) }),
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Verification Failed" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "We couldn't verify your email" })
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: verified ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Your email has been verified successfully. You can now log in and start using all features of UNA CHEATX." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-600 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-800", children: [
          /* @__PURE__ */ jsx("strong", { children: "Account Status:" }),
          " Active"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          className: "w-full bg-purple-600 hover:bg-purple-700",
          onClick: () => navigate({ to: "/login" }),
          children: "Go to Login"
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: error }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-red-800", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Possible reasons:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Token expired (valid for 24 hours)" }),
            /* @__PURE__ */ jsx("li", { children: "Token already used" }),
            /* @__PURE__ */ jsx("li", { children: "Invalid token" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          className: "w-full bg-purple-600 hover:bg-purple-700",
          onClick: () => navigate({ to: "/login" }),
          children: "Back to Login"
        }
      )
    ] }) })
  ] }) });
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const Route$7 = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Signup — UNA CHEATX" }] }),
  component: SignupPage
});
function SignupPage() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api/auth";
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    setPasswordStrength(strength);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwordStrength < 4) {
      toast.error(
        "Password is not strong enough. Use uppercase, lowercase, numbers, and special characters"
      );
      return;
    }
    const result = await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );
    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        navigate({ to: "/verify-email-sent", search: { email: formData.email } });
      }, 1500);
    } else {
      toast.error(result.message);
    }
  };
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Create Account" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Sign up to get started with UNA CHEATX" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "firstName", children: "First Name (Optional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "firstName",
            name: "firstName",
            value: formData.firstName,
            onChange: handleChange,
            placeholder: "John"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "lastName", children: "Last Name (Optional)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "lastName",
            name: "lastName",
            value: formData.lastName,
            onChange: handleChange,
            placeholder: "Doe"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            name: "email",
            type: "email",
            value: formData.email,
            onChange: handleChange,
            placeholder: "you@example.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            name: "password",
            type: "password",
            value: formData.password,
            onChange: handleChange,
            placeholder: "At least 8 characters",
            required: true
          }
        ),
        formData.password && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-1 flex-1 rounded-full ${i < passwordStrength ? getStrengthColor() : "bg-gray-300"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Requirements: 8+ chars, uppercase, lowercase, number, special character" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "confirmPassword",
            name: "confirmPassword",
            type: "password",
            value: formData.confirmPassword,
            onChange: handleChange,
            placeholder: "Confirm your password",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "w-full bg-purple-600 hover:bg-purple-700",
          disabled: loading,
          children: loading ? "Creating account..." : "Sign Up"
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-gray-600", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/login" }),
            className: "text-purple-600 hover:text-purple-700 font-semibold",
            children: "Log in"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative my-4", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-gray-300" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: "px-2 bg-white text-gray-500", children: "Or continue with" }) })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "w-full",
          onClick: () => {
            window.location.href = `${API_BASE}/google`;
          },
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 mr-2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("text", { x: "50%", y: "50%", dominantBaseline: "middle", textAnchor: "middle", fontSize: "14", children: "G" }) }),
            "Google"
          ]
        }
      )
    ] }) })
  ] }) });
}
const Route$6 = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — UNA CHEATX" }] }),
  component: ResetPasswordPage
});
function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const search = useSearch({ from: "/reset-password" });
  const token = search?.token || "";
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    setPasswordStrength(strength);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Reset token not found");
      return;
    }
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwordStrength < 4) {
      toast.error(
        "Password is not strong enough. Use uppercase, lowercase, numbers, and special characters"
      );
      return;
    }
    const result = await resetPassword(token, formData.password);
    if (result.success) {
      setResetSuccess(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  if (resetSuccess) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Password Reset" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Your password has been reset successfully" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "You can now log in with your new password." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: "w-full bg-purple-600 hover:bg-purple-700",
            onClick: () => navigate({ to: "/login" }),
            children: "Go to Login"
          }
        )
      ] }) })
    ] }) });
  }
  if (!token) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Invalid Link" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Reset token not found" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: "The password reset link is invalid or has expired. Please request a new one." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: "w-full bg-purple-600 hover:bg-purple-700",
            onClick: () => navigate({ to: "/forgot-password" }),
            children: "Request New Link"
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Reset Your Password" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Create a new password for your account" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "New Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            name: "password",
            type: "password",
            value: formData.password,
            onChange: handleChange,
            placeholder: "At least 8 characters",
            required: true
          }
        ),
        formData.password && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-1 flex-1 rounded-full ${i < passwordStrength ? getStrengthColor() : "bg-gray-300"}`
            },
            i
          )) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600", children: "Requirements: 8+ chars, uppercase, lowercase, number, special character" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "confirmPassword",
            name: "confirmPassword",
            type: "password",
            value: formData.confirmPassword,
            onChange: handleChange,
            placeholder: "Confirm your password",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "w-full bg-purple-600 hover:bg-purple-700",
          disabled: loading,
          children: loading ? "Resetting..." : "Reset Password"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-600", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/login" }),
          className: "text-purple-600 hover:text-purple-700 font-semibold",
          children: "Back to Login"
        }
      ) })
    ] }) })
  ] }) });
}
const $$splitComponentImporter$4 = () => import("./login-CPSiNVfR.js");
const Route$5 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — OG REDEGIT"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const Route$4 = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — UNA CHEATX" }] }),
  component: ForgotPasswordPage
});
function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  if (submitted) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Check Your Email" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Password reset link sent" })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            "If an account exists with the email ",
            /* @__PURE__ */ jsx("strong", { children: email }),
            ", you will receive a password reset link within minutes."
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-blue-800", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Link expires in 1 hour" }),
            /* @__PURE__ */ jsx("p", { children: "Make sure to reset your password within this time." })
          ] }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            /* @__PURE__ */ jsx("strong", { children: "Tip:" }),
            " Check your spam folder if you don't see the email."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            className: "w-full bg-purple-600 hover:bg-purple-700",
            onClick: () => navigate({ to: "/login" }),
            children: "Back to Login"
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Forgot Password?" }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Enter your email and we'll send you a link to reset your password" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "you@example.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "w-full bg-purple-600 hover:bg-purple-700",
          disabled: loading,
          children: loading ? "Sending..." : "Send Reset Link"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-600", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/login" }),
          className: "text-purple-600 hover:text-purple-700 font-semibold",
          children: "Back to Login"
        }
      ) })
    ] }) })
  ] }) });
}
const $$splitComponentImporter$3 = () => import("./dashboard-CWrNB86M.js");
const Route$3 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard – UNA CHEATX"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin-BRrirnl9.js");
const Route$2 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Panel — OG REDEGIT"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-Ca5BH1rV.js");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "OG REDEGIT — Premium OG REDEGIT Panel. Truly Undetected."
    }, {
      name: "description",
      content: "AI Aimbot, ESP, UID Bypass & Optimizer. Stealth-focused, instant delivery, lifetime updates. Built for tournament players and live streamers."
    }, {
      property: "og:title",
      content: "OG REDEGIT — Premium Panel"
    }, {
      property: "og:description",
      content: "AI Aimbot, ESP, UID Bypass & Optimizer. Instant delivery, lifetime updates."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./auth.callback-BmmeB_pL.js");
const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{
      title: "Authenticating..."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VerifyEmailSentRoute = Route$9.update({
  id: "/verify-email-sent",
  path: "/verify-email-sent",
  getParentRoute: () => Route$a
});
const VerifyEmailRoute = Route$8.update({
  id: "/verify-email",
  path: "/verify-email",
  getParentRoute: () => Route$a
});
const SignupRoute = Route$7.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$a
});
const ResetPasswordRoute = Route$6.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$a
});
const LoginRoute = Route$5.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$a
});
const ForgotPasswordRoute = Route$4.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$a
});
const DashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$a
});
const AdminRoute = Route$2.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$a
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const AuthCallbackRoute = Route.update({
  id: "/auth/callback",
  path: "/auth/callback",
  getParentRoute: () => Route$a
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  DashboardRoute,
  ForgotPasswordRoute,
  LoginRoute,
  ResetPasswordRoute,
  SignupRoute,
  VerifyEmailRoute,
  VerifyEmailSentRoute,
  AuthCallbackRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Card as C,
  LoadingScreen as L,
  CardContent as a,
  LogoMark as b,
  cn as c,
  useAuth$1 as d,
  router as r,
  supabase as s,
  useAuth as u
};
