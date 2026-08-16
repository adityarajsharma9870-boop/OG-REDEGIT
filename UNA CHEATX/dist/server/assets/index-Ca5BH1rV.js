import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, X, MessageCircle, Shield, LogOut, Users, ChevronRight, Lock, Zap, Cpu, Check, ShoppingCart } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { c as cn, d as useAuth, s as supabase, L as LoadingScreen, b as LogoMark } from "./router-uDuRmyto.js";
import { D as DEFAULT_BRAND_SETTINGS, f as fetchProducts, l as loadBrandSettings, a as accentOf } from "./brand-D1Ku2tWZ.js";
import "@supabase/supabase-js";
import "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("faq-accordion-item border-none", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "faq-accordion-trigger flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer text-left transition-all duration-300 [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "faq-accordion-content overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const SPOTS = [
  { left: "12%", top: "22%", size: 12, color: "var(--magenta)" },
  { left: "36%", top: "40%", size: 10, color: "var(--violet)" },
  { left: "72%", top: "18%", size: 14, color: "var(--cyan)" },
  { left: "18%", top: "72%", size: 9, color: "var(--magenta)" },
  { left: "58%", top: "64%", size: 11, color: "var(--violet)" },
  { left: "84%", top: "48%", size: 8, color: "var(--magenta)" }
];
function BackgroundSpots() {
  const container = useRef(null);
  const refs = useRef([]);
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      refs.current.forEach((r) => {
        if (!r) return;
        const rr = r.getBoundingClientRect();
        const rx = rr.left + rr.width / 2 - rect.left;
        const ry = rr.top + rr.height / 2 - rect.top;
        const dx = cx - rx;
        const dy = cy - ry;
        const d = Math.sqrt(dx * dx + dy * dy);
        const max = 220;
        const proximity = Math.max(0, 1 - d / max);
        const scale = 1 + proximity * 0.65;
        const opacity = 0.25 + proximity * 0.9;
        r.style.transform = `translate3d(0,0,0) scale(${scale})`;
        r.style.opacity = String(opacity);
        r.style.filter = `drop-shadow(0 0 ${6 + proximity * 18}px ${getComputedStyle(r).getPropertyValue("--spot-color") || "rgba(255,0,255,0.7)"} )`;
      });
    };
    const onLeave = () => {
      refs.current.forEach((r) => {
        if (!r) return;
        r.style.transform = "scale(1)";
        r.style.opacity = "0.25";
        r.style.filter = "";
      });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: container, className: "pointer-events-none fixed inset-0 z-10", children: SPOTS.map((s, i) => /* @__PURE__ */ jsx(
    "div",
    {
      ref: (el) => refs.current[i] = el,
      className: "bg-spot",
      style: {
        left: s.left,
        top: s.top,
        width: s.size,
        height: s.size,
        ["--spot-color"]: s.color,
        ["--fall-delay"]: `${i * 1.2}s`,
        ["--fall-duration"]: `${10 + i * 2}s`
      }
    },
    i
  )) });
}
const DISCORD_URL = "https://discord.gg/NheAdhyT";
function BuyModal({ product, onClose }) {
  const hasScanner = !!product?.scanner_url;
  useEffect(() => {
    if (!product) return;
    if (!hasScanner) {
      window.open(DISCORD_URL, "_blank");
      onClose();
    }
  }, [product, hasScanner, onClose]);
  if (!product) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "glass relative w-full max-w-md rounded-2xl p-6 animate-float-up", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute right-4 top-4 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx("p", { className: "font-heading text-[11px] tracking-[0.3em] text-cyan", children: "COMPLETE PURCHASE" }),
    /* @__PURE__ */ jsxs("h3", { className: "mt-1 font-heading text-2xl font-bold", children: [
      "Buy ",
      product.name
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Scan the QR below and message us on Discord to confirm." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 rounded-2xl bg-white p-5 text-center text-black", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs text-neutral-500", children: product.price }),
      hasScanner ? /* @__PURE__ */ jsx("img", { src: product.scanner_url, alt: `${product.name} payment scanner`, className: "mx-auto h-80 w-80 object-contain" }) : /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-56 w-56 place-items-center text-neutral-400", children: "No scanner available" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-[11px] text-neutral-400", children: "Message us once you complete the payment." })
    ] }),
    /* @__PURE__ */ jsxs("a", { href: DISCORD_URL, target: "_blank", rel: "noreferrer", className: "btn-animated mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center font-heading text-sm font-semibold text-white", style: { background: "var(--gradient-brand)" }, children: [
      /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
      " Message us on Discord"
    ] })
  ] }) });
}
const FEATURE_ICONS = {
  shield: Shield,
  cpu: Cpu,
  zap: Zap,
  lock: Lock
};
function Index() {
  const {
    user,
    isAdmin: authIsAdmin,
    loading
  } = useAuth();
  const isAdmin = authIsAdmin || user?.email?.toLowerCase() === "adityasharma4518@gmail.com" || user?.email?.toLowerCase() === "devadmine1234@gmail.com";
  const [brandSettings, setBrandSettings] = useState(DEFAULT_BRAND_SETTINGS);
  const [buying, setBuying] = useState(null);
  const [visits, setVisits] = useState(null);
  const {
    data: products = []
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts
  });
  const handleFaqPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 14;
    event.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    event.currentTarget.style.setProperty("--faq-glow-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--faq-glow-y", `${y * 100}%`);
  };
  const handleFaqPointerLeave = (event) => {
    event.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    event.currentTarget.style.setProperty("--faq-glow-x", "50%");
    event.currentTarget.style.setProperty("--faq-glow-y", "50%");
  };
  useEffect(() => {
    setBrandSettings(loadBrandSettings());
  }, []);
  useEffect(() => {
    let active = true;
    (async () => {
      if (sessionStorage.getItem("ux_counted")) {
        const {
          data: data2
        } = await supabase.from("site_stats").select("visits").eq("id", 1).maybeSingle();
        if (active) setVisits(data2?.visits ?? null);
        return;
      }
      const {
        data
      } = await supabase.rpc("increment_visits");
      if (active && typeof data === "number") {
        setVisits(data);
        sessionStorage.setItem("ux_counted", "1");
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(BackgroundSpots, {}),
    /* @__PURE__ */ jsx(LoadingScreen, {}),
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 glass", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(LogoMark, { className: "h-9 w-9", src: brandSettings.logoUrl || void 0 }),
        /* @__PURE__ */ jsxs("div", { className: "leading-none", children: [
          /* @__PURE__ */ jsx("p", { className: "font-heading text-lg font-bold tracking-[0.35em] uppercase text-gradient", children: brandSettings.siteName }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] tracking-[0.3em] text-muted-foreground", children: brandSettings.tagline })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-7 font-heading text-xs tracking-widest text-muted-foreground md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "#panels", className: "hover:text-foreground", children: "PANELS" }),
        /* @__PURE__ */ jsx("a", { href: "#why", className: "hover:text-foreground", children: "WHY US" }),
        /* @__PURE__ */ jsx("a", { href: "#faq", className: "hover:text-foreground", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: "#cta", className: "hover:text-foreground", children: "CONTACT" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        isAdmin && /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "btn-outline-animated flex items-center gap-1.5 rounded-lg border border-violet/40 px-3 py-2 font-heading text-xs tracking-widest text-violet hover:text-foreground", style: {
          boxShadow: "var(--glow-violet)"
        }, children: [
          /* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5" }),
          " ADMIN PANEL"
        ] }),
        user ? /* @__PURE__ */ jsxs("button", { onClick: () => supabase.auth.signOut(), className: "btn-animated flex items-center gap-2 rounded-lg px-4 py-2 font-heading text-xs font-semibold tracking-widest text-white", style: {
          background: "var(--gradient-brand)"
        }, children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" }),
          " SIGN OUT"
        ] }) : /* @__PURE__ */ jsx(Link, { to: "/login", className: "btn-animated rounded-lg px-4 py-2 font-heading text-xs font-semibold tracking-widest text-white", style: {
          background: "var(--gradient-brand)"
        }, children: "LOGIN" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "relative mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:pt-24", children: [
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-violet/40 px-4 py-1.5 font-heading text-[11px] tracking-[0.25em] text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-grass animate-pulse-glow" }),
        " LIFETIME UPDATES · INSTANT DELIVERY"
      ] }),
      visits !== null && /* @__PURE__ */ jsxs("div", { className: "mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5 font-heading text-[11px] tracking-[0.2em] text-cyan", children: [
        /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5" }),
        " ",
        visits.toLocaleString(),
        " TOTAL VISITORS"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-7 text-center font-heading text-5xl font-bold leading-[0.95] sm:text-7xl", children: [
        "Premium ",
        /* @__PURE__ */ jsx("span", { className: "font-heading text-gradient", children: brandSettings.siteName }),
        /* @__PURE__ */ jsx("br", {}),
        "Panel. Truly",
        /* @__PURE__ */ jsx("br", {}),
        "Unpatable."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground", children: brandSettings.heroDescription }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("a", { href: "#panels", className: "btn-animated inline-flex items-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-semibold text-white", style: {
          background: "var(--gradient-brand)",
          boxShadow: "var(--glow-violet)"
        }, children: [
          "BROWSE PANELS ",
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "#cta", className: "btn-outline-animated inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-heading text-sm font-semibold glass", children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
          " CONTACT US ON DISCORD"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4", children: brandSettings.stats.map((s) => /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl px-4 py-5 product-card relative", children: [
        /* @__PURE__ */ jsx("div", { className: "card-spot" }),
        /* @__PURE__ */ jsx("p", { className: "font-heading text-2xl font-bold text-cyan", children: s.value }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-heading text-[10px] tracking-[0.2em] text-muted-foreground", children: s.label })
      ] }, `${s.label}-${s.value}`)) })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "why", className: "mx-auto max-w-6xl px-4 pb-4", children: /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: brandSettings.featureHighlights.map((highlight, index) => {
      const Icon = FEATURE_ICONS[highlight.icon] ?? Shield;
      return /* @__PURE__ */ jsxs("div", { className: `glass rounded-2xl p-6 product-card relative`, children: [
        /* @__PURE__ */ jsx("div", { className: "card-spot" }),
        /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl border border-violet/40 text-violet", style: {
          boxShadow: "var(--glow-violet)"
        }, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-heading text-lg font-bold", children: highlight.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: highlight.description })
      ] }, `${highlight.title}-${index}`);
    }) }) }),
    /* @__PURE__ */ jsxs("section", { id: "panels", className: "mx-auto max-w-6xl px-4 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-heading text-xs tracking-[0.35em] text-magenta", children: "THE OG REDEGIT" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-2 font-heading text-4xl font-bold sm:text-5xl", children: [
          "Choose Your ",
          /* @__PURE__ */ jsx("span", { className: "font-heading text-gradient", children: "Panel" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: "Every panel ships with lifetime updates within 20–30 minutes of any AC patch." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: products.map((p) => {
        const a = accentOf(p.accent);
        return /* @__PURE__ */ jsxs("div", { className: `product-card glass flex flex-col rounded-2xl border ${a.ring} p-6`, style: {
          ["--card-accent"]: a.glow
        }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "font-heading text-[11px] tracking-[0.25em] text-muted-foreground", children: p.tag }),
            p.badge && /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-[10px] font-bold ${a.btn}`, children: p.badge })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: `mt-2 font-heading text-2xl font-bold ${a.text}`, children: p.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: p.tagline }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2 text-sm", children: p.features.map((f, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(Check, { className: `mt-0.5 h-4 w-4 shrink-0 ${a.text}` }),
            /* @__PURE__ */ jsx("span", { children: f })
          ] }, i)) }),
          p.tiers?.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-1.5", children: p.tiers.map((t, i) => /* @__PURE__ */ jsxs("div", { className: "pointer-events-none flex items-center justify-between rounded-lg bg-secondary/60 px-4 py-2 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-heading tracking-wider text-muted-foreground", children: t.label }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t.price })
          ] }, i)) }),
          /* @__PURE__ */ jsxs("button", { onClick: () => p.scanner_url ? setBuying(p) : window.open("https://discord.gg/NheAdhyT", "_blank"), className: `buy-btn btn-animated mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-heading text-sm font-bold ${a.btn}`, children: [
            /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }),
            " BUY NOW →"
          ] })
        ] }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "faq", className: "mx-auto max-w-3xl px-4 py-16", children: [
      /* @__PURE__ */ jsx("p", { className: "font-heading text-xs tracking-[0.35em] text-grass text-center", children: brandSettings.faqSectionEyebrow }),
      /* @__PURE__ */ jsx("h2", { className: "faq-title mt-3 text-center font-heading text-4xl font-bold sm:text-5xl", children: brandSettings.faqSectionTitle.split(new RegExp(`(${brandSettings.faqSectionHighlightedWord})`, "gi")).map((part, index) => part.toLowerCase() === brandSettings.faqSectionHighlightedWord.toLowerCase() ? /* @__PURE__ */ jsx("span", { className: "text-gradient", children: part }, index) : /* @__PURE__ */ jsx("span", { children: part }, index)) }),
      /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "mt-8", children: brandSettings.faqItems.map((item, i) => /* @__PURE__ */ jsxs(AccordionItem, { value: `f${i}`, className: "faq-accordion-item mb-3 px-4", onMouseMove: handleFaqPointerMove, onMouseLeave: handleFaqPointerLeave, children: [
        /* @__PURE__ */ jsx(AccordionTrigger, { className: "font-heading text-lg text-left hover:no-underline", children: item.question }),
        /* @__PURE__ */ jsx(AccordionContent, { className: "text-base text-muted-foreground", children: item.answer })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "cta", className: "mx-auto max-w-5xl px-4 py-20 text-center", children: /* @__PURE__ */ jsxs("div", { className: "glass rounded-3xl px-6 py-16", style: {
      boxShadow: "var(--shadow-card)"
    }, children: [
      /* @__PURE__ */ jsx("p", { className: "font-heading text-xs tracking-[0.35em] text-grass", children: "READY TO DOMINATE?" }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-3 font-heading text-4xl font-bold sm:text-6xl", children: [
        "FOR ANY QUERY",
        /* @__PURE__ */ jsx("span", { className: "text-gradient" }),
        " DM US."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "UPI · Binance · Bkash supported. Custom packages, seller credits & bulk deals available." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxs("a", { href: "#panels", className: "btn-animated inline-flex items-center gap-2 rounded-xl px-7 py-3 font-heading text-sm font-bold text-white", style: {
          background: "var(--gradient-brand)",
          boxShadow: "var(--glow-violet)"
        }, children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" }),
          " BUY NOW"
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "https://discord.gg/NheAdhyT", target: "_blank", rel: "noreferrer", className: "btn-outline-animated inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3 font-heading text-sm font-bold glass", children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
          " CONTACT US ON DISCORD"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-6 font-heading text-[11px] tracking-[0.25em] text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: "UPI (IN)" }),
        /* @__PURE__ */ jsx("span", { children: "BINANCE" }),
        /* @__PURE__ */ jsx("span", { children: "BKASH (BD)" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "border-t border-border py-8 text-center font-heading text-xs tracking-widest text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " UNA CHEATX · ALL RIGHTS RESERVED"
    ] }),
    /* @__PURE__ */ jsx(BuyModal, { product: buying, onClose: () => setBuying(null) })
  ] });
}
export {
  Index as component
};
