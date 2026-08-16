import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Pencil, Package, X, Save, Plus, Trash2 } from "lucide-react";
import { d as useAuth, s as supabase, b as LogoMark } from "./router-B87loaBw.js";
import { D as DEFAULT_BRAND_SETTINGS, f as fetchProducts, l as loadBrandSettings, A as ACCENTS, a as accentOf, s as saveBrandSettings, u as updateLocalProduct, c as createLocalProduct, d as deleteLocalProduct } from "./brand-CF2eJztP.js";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, a as createServerFn } from "./server-oUqY8gDK.js";
import { z } from "zod";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const uploadScannerImage = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  base64: z.string().min(1)
})).handler(createSsrRpc("b3cb49f8aeff22e6afa32f8cd54a0000a6b65a2328f41b890e6c2ce7970b4be6"));
const productPayloadSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  tag: z.string().default(""),
  tagline: z.string().default(""),
  badge: z.string().default(""),
  price_label: z.string().default(""),
  price: z.string().min(1, "Price is required"),
  credits: z.number().default(0),
  accent: z.string().default("violet"),
  features: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  tiers: z.array(z.object({
    label: z.string(),
    price: z.string()
  })).default([]),
  scanner_url: z.string().default(""),
  sort_order: z.number().default(99)
}).strict();
const createProductInput = z.union([productPayloadSchema, z.object({
  data: productPayloadSchema
})]);
const updateProductInput = z.union([z.object({
  id: z.string().min(1),
  payload: productPayloadSchema.partial()
}), z.object({
  data: z.object({
    id: z.string().min(1),
    payload: productPayloadSchema.partial()
  })
})]);
const deleteProductInput = z.union([z.object({
  id: z.string().min(1)
}), z.object({
  data: z.object({
    id: z.string().min(1)
  })
})]);
const createProduct = createServerFn({
  method: "POST"
}).inputValidator(createProductInput).handler(createSsrRpc("44fd00a102131b500ed02f43bb7e9a42a6ee826507a0c18467e08f2fabd746ac"));
const updateProduct = createServerFn({
  method: "POST"
}).inputValidator(updateProductInput).handler(createSsrRpc("31346170704f8ba412fe0f8c5ba3a0194309320623f98c37727162827577c918"));
const deleteProduct = createServerFn({
  method: "POST"
}).inputValidator(deleteProductInput).handler(createSsrRpc("215f16a3e22d771b84486f221661bd7f828b61d801022f7cdd19659138e0f166"));
const empty = {
  name: "",
  tag: "CUSTOM",
  tagline: "",
  badge: "",
  price_label: "Lifetime",
  price: "",
  credits: 0,
  accent: "violet",
  features: "",
  notes: "",
  tiers: "1 DAY = ₹100\nLIFETIME = ₹3,000",
  sort_order: 99,
  scanner_url: ""
};
function AdminPage() {
  const {
    user,
    isAdmin: authIsAdmin,
    loading,
    signOut
  } = useAuth();
  const isAdmin = authIsAdmin || user?.email?.toLowerCase() === "adityasharma4518@gmail.com" || user?.email?.toLowerCase() === "devadmine1234@gmail.com";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [brandSettings, setBrandSettings] = useState(DEFAULT_BRAND_SETTINGS);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {
    data: products = []
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts
  });
  const {
    data: visits = 0
  } = useQuery({
    queryKey: ["site-visits"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("site_stats").select("visits").eq("id", 1).maybeSingle();
      return data?.visits ?? 0;
    }
  });
  useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [loading, user, navigate]);
  useEffect(() => {
    setBrandSettings(loadBrandSettings());
  }, []);
  useEffect(() => {
    const ch = supabase.channel("products-admin").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "products"
    }, () => qc.invalidateQueries({
      queryKey: ["products"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center text-muted-foreground", children: "Loading…" });
  if (user && !isAdmin) {
    return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center px-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "glass max-w-md rounded-2xl p-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-heading text-2xl font-bold", children: "Not an admin" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
        "This account (",
        user.email,
        ") doesn't have admin access. Sign in with the admin account."
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: signOut, className: "btn-animated mt-5 rounded-xl px-5 py-2 font-heading text-sm font-bold text-white", style: {
        background: "var(--gradient-brand)"
      }, children: "Sign out" })
    ] }) });
  }
  const parseTiers = (s) => s.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [label, price] = l.split("=").map((x) => x.trim());
    return {
      label: label ?? "",
      price: price ?? ""
    };
  });
  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      tag: form.tag,
      tagline: form.tagline,
      badge: form.badge,
      price_label: form.price_label,
      price: form.price,
      credits: Number(form.credits) || 0,
      accent: form.accent,
      features: form.features.split("\n").map((x) => x.trim()).filter(Boolean),
      notes: form.notes.split("\n").map((x) => x.trim()).filter(Boolean),
      tiers: parseTiers(form.tiers),
      sort_order: Number(form.sort_order) || 99,
      scanner_url: form.scanner_url
    };
    try {
      if (editingId) {
        try {
          await updateProduct({
            data: {
              id: editingId,
              payload
            }
          });
          toast.success("Product updated permanently!");
        } catch (supabaseError) {
          console.warn("[Admin] Supabase update failed, using local storage:", supabaseError);
          const updated = updateLocalProduct(editingId, payload);
          if (updated) {
            toast.success("Product updated (local cache - sync pending)");
          } else {
            throw new Error("Product not found");
          }
        }
      } else {
        try {
          await createProduct({
            data: payload
          });
          toast.success("Product saved permanently!");
        } catch (supabaseError) {
          console.warn("[Admin] Supabase create failed, using local storage:", supabaseError);
          createLocalProduct(payload);
          toast.success("Product saved (local cache - sync pending)");
        }
      }
      setForm(empty);
      setEditingId(null);
      qc.invalidateQueries({
        queryKey: ["products"]
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save product.";
      toast.error(message);
    }
  };
  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      tag: p.tag ?? "",
      tagline: p.tagline ?? "",
      badge: p.badge ?? "",
      price_label: p.price_label ?? "Lifetime",
      price: p.price ?? "",
      credits: p.credits ?? 0,
      accent: p.accent ?? "violet",
      features: (p.features ?? []).join("\n"),
      notes: (p.notes ?? []).join("\n"),
      tiers: (p.tiers ?? []).map((t) => `${t.label} = ${t.price}`).join("\n"),
      sort_order: p.sort_order ?? 99,
      scanner_url: p.scanner_url ?? ""
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };
  const uploadScanner = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const commaIndex = result.indexOf(",");
          resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
        } else {
          reject(new Error("Unable to read file."));
        }
      };
      reader.onerror = () => reject(new Error("Unable to read file."));
      reader.readAsDataURL(file);
    });
    try {
      try {
        const response = await uploadScannerImage({
          data: {
            fileName: file.name,
            contentType: file.type,
            base64
          }
        });
        setForm((f) => ({
          ...f,
          scanner_url: response.publicUrl
        }));
        toast.success("Scanner image uploaded.");
      } catch (serverError) {
        console.warn("[Admin] Scanner upload failed, using local data URL fallback:", serverError);
        const localUrl = `data:${file.type};base64,${base64}`;
        setForm((f) => ({
          ...f,
          scanner_url: localUrl
        }));
        toast.success("Scanner image saved locally - sync pending");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };
  const del = async (p) => {
    if (!confirm(`Delete "${p.name}" permanently?`)) return;
    try {
      try {
        await deleteProduct({
          id: p.id
        });
        toast.success("Deleted permanently.");
      } catch (supabaseError) {
        console.warn("[Admin] Supabase delete failed, using local storage:", supabaseError);
        const deleted = deleteLocalProduct(p.id);
        if (deleted) {
          toast.success("Deleted (local cache - sync pending)");
        } else {
          throw new Error("Product not found");
        }
      }
      if (editingId === p.id) cancelEdit();
      qc.invalidateQueries({
        queryKey: ["products"]
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete product.";
      toast.error(message);
    }
  };
  const saveBrand = (e) => {
    e.preventDefault();
    saveBrandSettings(brandSettings);
    toast.success("Brand settings saved.");
  };
  const updateStat = (index, key, value) => {
    setBrandSettings((current) => ({
      ...current,
      stats: current.stats.map((stat, idx) => idx === index ? {
        ...stat,
        [key]: value
      } : stat)
    }));
  };
  const addStat = () => {
    setBrandSettings((current) => ({
      ...current,
      stats: [...current.stats, {
        value: "NEW",
        label: "NEW LABEL"
      }]
    }));
  };
  const removeStat = (index) => {
    setBrandSettings((current) => ({
      ...current,
      stats: current.stats.filter((_, idx) => idx !== index)
    }));
  };
  const updateHighlight = (index, key, value) => {
    setBrandSettings((current) => ({
      ...current,
      featureHighlights: current.featureHighlights.map((highlight, idx) => idx === index ? {
        ...highlight,
        [key]: value
      } : highlight)
    }));
  };
  const addHighlight = () => {
    setBrandSettings((current) => ({
      ...current,
      featureHighlights: [...current.featureHighlights, {
        icon: "shield",
        title: "NEW FEATURE",
        description: "New feature description."
      }]
    }));
  };
  const removeHighlight = (index) => {
    setBrandSettings((current) => ({
      ...current,
      featureHighlights: current.featureHighlights.filter((_, idx) => idx !== index)
    }));
  };
  const updateFaqItem = (index, key, value) => {
    setBrandSettings((current) => ({
      ...current,
      faqItems: current.faqItems.map((item, idx) => idx === index ? {
        ...item,
        [key]: value
      } : item)
    }));
  };
  const addFaqItem = () => {
    setBrandSettings((current) => ({
      ...current,
      faqItems: [...current.faqItems, {
        question: "New question",
        answer: "New answer."
      }]
    }));
  };
  const removeFaqItem = (index) => {
    setBrandSettings((current) => ({
      ...current,
      faqItems: current.faqItems.filter((_, idx) => idx !== index)
    }));
  };
  const inp = "w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(LogoMark, { className: "h-10 w-10" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl font-bold text-gradient", children: "Admin Panel" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Add, edit & delete panels. Changes save permanently." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "btn-outline-animated rounded-lg border border-border px-4 py-2 font-heading text-xs tracking-widest", children: "VIEW SITE" }),
        /* @__PURE__ */ jsxs("button", { onClick: signOut, className: "btn-animated flex items-center gap-2 rounded-lg px-4 py-2 font-heading text-xs tracking-widest text-white", style: {
          background: "var(--gradient-brand)"
        }, children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
          " SIGN OUT"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-heading text-[11px] tracking-widest text-muted-foreground", children: "TOTAL PANELS" }),
        /* @__PURE__ */ jsx("p", { className: "font-heading text-3xl font-bold text-cyan", children: products.length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-heading text-[11px] tracking-widest text-muted-foreground", children: "TOTAL VISITORS" }),
        /* @__PURE__ */ jsx("p", { className: "font-heading text-3xl font-bold text-magenta", children: visits.toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-heading text-[11px] tracking-widest text-muted-foreground", children: "ADMIN" }),
        /* @__PURE__ */ jsx("p", { className: "truncate font-heading text-lg font-bold", children: user?.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-heading text-[11px] tracking-widest text-muted-foreground", children: "STATUS" }),
        /* @__PURE__ */ jsx("p", { className: "font-heading text-lg font-bold text-grass", children: "● LIVE" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: saveBrand, className: "glass mt-8 rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl font-bold text-gradient", children: "Brand & Logo" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Update your site title, tagline, logo URL, and stats that appear on the homepage." })
        ] }),
        brandSettings.logoUrl ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-3xl border border-input bg-background/80 px-4 py-3", children: [
          /* @__PURE__ */ jsx(LogoMark, { className: "h-12 w-12", src: brandSettings.logoUrl }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-heading text-sm font-semibold text-foreground", children: "Logo preview" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Shown in the top header." })
          ] })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsx(Field, { l: "SITE NAME", children: /* @__PURE__ */ jsx("input", { className: inp, value: brandSettings.siteName, onChange: (e) => setBrandSettings({
          ...brandSettings,
          siteName: e.target.value
        }), placeholder: "OG REDEGIT" }) }),
        /* @__PURE__ */ jsx(Field, { l: "TAGLINE", children: /* @__PURE__ */ jsx("input", { className: inp, value: brandSettings.tagline, onChange: (e) => setBrandSettings({
          ...brandSettings,
          tagline: e.target.value
        }), placeholder: "PREMIUM PANEL · LIFETIME UPDATES" }) }),
        /* @__PURE__ */ jsx(Field, { l: "HERO DESCRIPTION", children: /* @__PURE__ */ jsx("textarea", { rows: 3, className: inp, value: brandSettings.heroDescription, onChange: (e) => setBrandSettings({
          ...brandSettings,
          heroDescription: e.target.value
        }), placeholder: "AI Aimbot, ESP, UID Bypass & Optimizer..." }) }),
        /* @__PURE__ */ jsx(Field, { l: "LOGO IMAGE URL", children: /* @__PURE__ */ jsx("input", { className: inp, value: brandSettings.logoUrl, onChange: (e) => setBrandSettings({
          ...brandSettings,
          logoUrl: e.target.value
        }), placeholder: "https://..." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-3xl border border-input bg-background/80 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold", children: "Homepage Stats" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Edit the stat cards shown under the hero section." })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: addStat, className: "btn-outline-animated rounded-xl border border-border px-4 py-2 font-heading text-xs tracking-widest", children: "+ ADD STAT" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: brandSettings.stats.map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-secondary/50 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-heading text-xs tracking-widest text-muted-foreground", children: [
              "STAT ",
              index + 1
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeStat(index), className: "text-destructive text-xs font-semibold hover:text-destructive/80", children: "Remove" })
          ] }),
          /* @__PURE__ */ jsx(Field, { l: "VALUE", children: /* @__PURE__ */ jsx("input", { className: inp, value: stat.value, onChange: (e) => updateStat(index, "value", e.target.value), placeholder: "10000+" }) }),
          /* @__PURE__ */ jsx(Field, { l: "LABEL", children: /* @__PURE__ */ jsx("input", { className: inp, value: stat.label, onChange: (e) => updateStat(index, "label", e.target.value), placeholder: "ACTIVE USERS" }) })
        ] }, `${stat.label}-${index}`)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-3xl border border-input bg-background/80 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold", children: "Feature Cards" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Edit the homepage feature cards. The 3rd card is included here." })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: addHighlight, className: "btn-outline-animated rounded-xl border border-border px-4 py-2 font-heading text-xs tracking-widest", children: "+ ADD FEATURE" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: brandSettings.featureHighlights.map((highlight, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-secondary/50 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-heading text-xs tracking-widest text-muted-foreground", children: [
              "FEATURE ",
              index + 1
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeHighlight(index), className: "text-destructive text-xs font-semibold hover:text-destructive/80", children: "Remove" })
          ] }),
          /* @__PURE__ */ jsx(Field, { l: "TITLE", children: /* @__PURE__ */ jsx("input", { className: inp, value: highlight.title, onChange: (e) => updateHighlight(index, "title", e.target.value), placeholder: "Anti-Cheat Evasion" }) }),
          /* @__PURE__ */ jsx(Field, { l: "DESCRIPTION", children: /* @__PURE__ */ jsx("textarea", { rows: 3, className: inp, value: highlight.description, onChange: (e) => updateHighlight(index, "description", e.target.value), placeholder: "HVCI, VBS, Hyper-V & PatchGuard-aware design." }) })
        ] }, `${highlight.title}-${index}`)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-3xl border border-input bg-background/80 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-bold", children: "FAQ Section" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Edit the FAQ section and questions shown on the homepage." })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: addFaqItem, className: "btn-outline-animated rounded-xl border border-border px-4 py-2 font-heading text-xs tracking-widest", children: "+ ADD QUESTION" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Field, { l: "SECTION EYEBROW", children: /* @__PURE__ */ jsx("input", { className: inp, value: brandSettings.faqSectionEyebrow, onChange: (e) => setBrandSettings({
            ...brandSettings,
            faqSectionEyebrow: e.target.value
          }), placeholder: "SUPPORT" }) }),
          /* @__PURE__ */ jsx(Field, { l: "SECTION TITLE", children: /* @__PURE__ */ jsx("input", { className: inp, value: brandSettings.faqSectionTitle, onChange: (e) => setBrandSettings({
            ...brandSettings,
            faqSectionTitle: e.target.value
          }), placeholder: "Frequently Asked" }) }),
          /* @__PURE__ */ jsx(Field, { l: "HIGHLIGHTED WORD", children: /* @__PURE__ */ jsx("input", { className: inp, value: brandSettings.faqSectionHighlightedWord, onChange: (e) => setBrandSettings({
            ...brandSettings,
            faqSectionHighlightedWord: e.target.value
          }), placeholder: "Asked" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 grid gap-4", children: brandSettings.faqItems.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-secondary/50 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-heading text-xs tracking-widest text-muted-foreground", children: [
              "QUESTION ",
              index + 1
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeFaqItem(index), className: "text-destructive text-xs font-semibold hover:text-destructive/80", children: "Remove" })
          ] }),
          /* @__PURE__ */ jsx(Field, { l: "QUESTION", children: /* @__PURE__ */ jsx("input", { className: inp, value: item.question, onChange: (e) => updateFaqItem(index, "question", e.target.value), placeholder: "How fast is delivery?" }) }),
          /* @__PURE__ */ jsx(Field, { l: "ANSWER", children: /* @__PURE__ */ jsx("textarea", { rows: 3, className: inp, value: item.answer, onChange: (e) => updateFaqItem(index, "answer", e.target.value), placeholder: "Instant. You receive your panel within minutes of payment confirmation on Discord." }) })
        ] }, `${item.question}-${index}`)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "btn-animated rounded-xl px-6 py-3 font-heading text-sm font-bold text-white", style: {
        background: "var(--gradient-brand)"
      }, children: "SAVE BRAND SETTINGS" }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: saveProduct, className: `glass mt-8 rounded-2xl p-6 ${editingId ? "ring-2 ring-cyan" : ""}`, children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 font-heading text-xl font-bold", children: [
        editingId ? /* @__PURE__ */ jsx(Pencil, { className: "h-5 w-5 text-cyan" }) : /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-magenta" }),
        editingId ? `Edit Product — ${form.name || ""}` : "Add New Product"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Field, { l: "NAME *", children: /* @__PURE__ */ jsx("input", { required: true, className: inp, value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), placeholder: "AI Module – Pro" }) }),
        /* @__PURE__ */ jsx(Field, { l: "TAG", children: /* @__PURE__ */ jsx("input", { className: inp, value: form.tag, onChange: (e) => setForm({
          ...form,
          tag: e.target.value
        }) }) }),
        /* @__PURE__ */ jsx(Field, { l: "TAGLINE", children: /* @__PURE__ */ jsx("input", { className: inp, value: form.tagline, onChange: (e) => setForm({
          ...form,
          tagline: e.target.value
        }), placeholder: "Short description" }) }),
        /* @__PURE__ */ jsx(Field, { l: "BADGE (OPTIONAL)", children: /* @__PURE__ */ jsx("input", { className: inp, value: form.badge, onChange: (e) => setForm({
          ...form,
          badge: e.target.value
        }), placeholder: "Most Popular" }) }),
        /* @__PURE__ */ jsx(Field, { l: "PRICE LABEL", children: /* @__PURE__ */ jsx("input", { className: inp, value: form.price_label, onChange: (e) => setForm({
          ...form,
          price_label: e.target.value
        }) }) }),
        /* @__PURE__ */ jsx(Field, { l: "PRICE *", children: /* @__PURE__ */ jsx("input", { required: true, className: inp, value: form.price, onChange: (e) => setForm({
          ...form,
          price: e.target.value
        }), placeholder: "₹3,000 / $33" }) }),
        /* @__PURE__ */ jsx(Field, { l: "CREDITS (INR)", children: /* @__PURE__ */ jsx("input", { type: "number", className: inp, value: form.credits, onChange: (e) => setForm({
          ...form,
          credits: Number(e.target.value)
        }) }) }),
        /* @__PURE__ */ jsx(Field, { l: "ACCENT", children: /* @__PURE__ */ jsx("select", { className: inp, value: form.accent, onChange: (e) => setForm({
          ...form,
          accent: e.target.value
        }), children: ACCENTS.map((a) => /* @__PURE__ */ jsx("option", { value: a, children: a }, a)) }) }),
        /* @__PURE__ */ jsx(Field, { l: "FEATURES (ONE PER LINE)", children: /* @__PURE__ */ jsx("textarea", { rows: 4, className: inp, value: form.features, onChange: (e) => setForm({
          ...form,
          features: e.target.value
        }), placeholder: "Aimbot Neck\nESP Box" }) }),
        /* @__PURE__ */ jsx(Field, { l: "NOTES (ONE PER LINE)", children: /* @__PURE__ */ jsx("textarea", { rows: 4, className: inp, value: form.notes, onChange: (e) => setForm({
          ...form,
          notes: e.target.value
        }), placeholder: "Works on Win 11\nInstant delivery" }) }),
        /* @__PURE__ */ jsx(Field, { l: "PRICING TIERS (LABEL = PRICE, ONE PER LINE)", children: /* @__PURE__ */ jsx("textarea", { rows: 4, className: inp, value: form.tiers, onChange: (e) => setForm({
          ...form,
          tiers: e.target.value
        }) }) }),
        /* @__PURE__ */ jsx(Field, { l: "SORT ORDER", children: /* @__PURE__ */ jsx("input", { type: "number", className: inp, value: form.sort_order, onChange: (e) => setForm({
          ...form,
          sort_order: Number(e.target.value)
        }) }) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(Field, { l: "PAYMENT SCANNER (QR PHOTO) — IF EMPTY, BUY BUTTON OPENS DISCORD", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", disabled: uploading, onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) uploadScanner(f);
          }, className: `${inp} cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-foreground` }),
          uploading && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Uploading…" }),
          form.scanner_url && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("img", { src: form.scanner_url, alt: "Scanner preview", className: "h-16 w-16 rounded-md border border-border object-cover" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setForm({
              ...form,
              scanner_url: ""
            }), className: "rounded-lg p-2 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn-animated flex items-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-bold text-white", style: {
          background: "var(--gradient-brand)"
        }, children: [
          editingId ? /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " ",
          editingId ? "UPDATE PRODUCT" : "SAVE PRODUCT"
        ] }),
        editingId && /* @__PURE__ */ jsxs("button", { type: "button", onClick: cancelEdit, className: "btn-outline-animated flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-heading text-sm font-bold", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          " CANCEL"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: products.map((p) => {
      const a = accentOf(p.accent);
      return /* @__PURE__ */ jsxs("div", { className: `glass rounded-2xl border ${a.ring} p-5 ${editingId === p.id ? "ring-2 ring-cyan" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: `font-heading text-lg font-bold ${a.text}`, children: p.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              p.tag,
              " · ",
              p.price
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 gap-1", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => startEdit(p), className: "btn-animated rounded-lg p-2 text-cyan hover:bg-cyan/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => del(p), className: "btn-animated rounded-lg p-2 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: p.tagline })
      ] }, p.id);
    }) })
  ] });
}
function Field({
  l,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block font-heading text-[10px] tracking-[0.2em] text-muted-foreground", children: l }),
    children
  ] });
}
export {
  AdminPage as component
};
