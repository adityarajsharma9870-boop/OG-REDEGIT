import { jsxs, jsx } from "react/jsx-runtime";
import { u as useAuth, B as Button, C as Card, a as CardContent } from "./router-uDuRmyto.js";
import { useNavigate } from "@tanstack/react-router";
import "@tanstack/react-query";
import "react";
import "@supabase/supabase-js";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "@radix-ui/react-label";
function DashboardPage() {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate({
      to: "/login"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900", children: [
    /* @__PURE__ */ jsx("nav", { className: "bg-black/20 backdrop-blur-md border-b border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: "UNA CHEATX" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-300", children: "Dashboard" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-white", children: user?.email }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleLogout, className: "text-white border-white/30 hover:bg-white/10", children: "Logout" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "max-w-7xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(Card, { className: "border-purple-400/20 bg-white/5 backdrop-blur", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-white mb-2", children: [
          "Welcome, ",
          user?.firstName || user?.email,
          "!"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: "Your account has been successfully authenticated." })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "border-purple-400/20 bg-white/5 backdrop-blur", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Account Information" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-black/20 rounded-lg", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Email" }),
            /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: user?.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-black/20 rounded-lg", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "First Name" }),
            /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: user?.firstName || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-black/20 rounded-lg", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Last Name" }),
            /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: user?.lastName || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-black/20 rounded-lg", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Role" }),
            /* @__PURE__ */ jsx("span", { className: "text-white font-semibold capitalize", children: user?.role })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-black/20 rounded-lg", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "Email Verified" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400 font-semibold", children: "✓ Verified" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "border-purple-400/20 bg-white/5 backdrop-blur", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Authentication Features" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
            " Secure JWT Authentication"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
            " Email Verification"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
            " Password Reset with Email"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
            " Google OAuth Integration"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
            " HTTP-Only Cookies"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-gray-300", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-400", children: "✓" }),
            " Rate Limiting"
          ] })
        ] })
      ] }) }),
      user?.role === "admin" && /* @__PURE__ */ jsx(Card, { className: "border-blue-400/20 bg-blue-500/5 backdrop-blur", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "🔐 Admin Panel" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-4", children: "You have admin access to this application." }),
        /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
          to: "/admin"
        }), className: "bg-blue-600 hover:bg-blue-700", children: "Go to Admin Panel" })
      ] }) })
    ] }) })
  ] });
}
export {
  DashboardPage as component
};
