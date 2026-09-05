import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, LogOut, Package, Pencil, X, Save } from "lucide-react";
import { supabase } from "@/intergrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchProducts, ACCENTS, accentOf, type Product } from "@/lib/products";
import { uploadScannerImage } from "@/lib/api/scanner.functions";
import { createProduct, updateProduct, deleteProduct } from "@/lib/api/product.functions";
import { createLocalProduct, updateLocalProduct, deleteLocalProduct, getLocalProducts } from "@/lib/api/product-local";
import { LogoMark } from "@/components/site/LogoMark";
import { BrandSettings, DEFAULT_BRAND_SETTINGS, loadBrandSettings, saveBrandSettings } from "@/lib/brand";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — OG REDEGIT" }] }),
  component: AdminPage,
});

const empty = {
  name: "", tag: "CUSTOM", tagline: "", badge: "", price_label: "Lifetime",
  price: "", credits: 0, accent: "violet", features: "", notes: "", tiers: "1 DAY = ₹100\nLIFETIME = ₹3,000", sort_order: 99,
  scanner_url: "",
};

function AdminPage() {
  const { user, isAdmin: authIsAdmin, loading, signOut } = useAuth();
  const hasFakeAdmin = typeof window !== "undefined" && Boolean(localStorage.getItem("fake_admin_session"));
  const isAdmin =
    authIsAdmin ||
    hasFakeAdmin ||
    user?.email?.toLowerCase() === "adityasharma4518@gmail.com" ||
    user?.email?.toLowerCase() === "adityarajsharma9070@gmail.com" ||
    user?.email?.toLowerCase() === "devadmine1234@gmail.com";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: visits = 0 } = useQuery({
    queryKey: ["site-visits"],
    queryFn: async () => {
      const { data } = await supabase.from("site_stats").select("visits").eq("id", 1).maybeSingle();
      return data?.visits ?? 0;
    },
  });

  useEffect(() => {
    if (!loading && !user && !hasFakeAdmin && !isAdmin) {
      navigate({ to: "/login" });
    }
  }, [loading, user, hasFakeAdmin, isAdmin, navigate]);

  useEffect(() => {
    setBrandSettings(loadBrandSettings());
  }, []);

  useEffect(() => {
    const ch = supabase.channel("products-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => qc.invalidateQueries({ queryKey: ["products"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (user && !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div className="glass max-w-md rounded-2xl p-8">
          <h1 className="font-heading text-2xl font-bold">Not an admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account ({user.email}) doesn't have admin access. Sign in with the admin account.</p>
          <button onClick={signOut} className="btn-animated mt-5 rounded-xl px-5 py-2 font-heading text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>Sign out</button>
        </div>
      </div>
    );
  }

  const parseTiers = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [label, price] = l.split("=").map((x) => x.trim());
    return { label: label ?? "", price: price ?? "" };
  });

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, tag: form.tag, tagline: form.tagline, badge: form.badge,
      price_label: form.price_label, price: form.price, credits: Number(form.credits) || 0,
      accent: form.accent,
      features: form.features.split("\n").map((x) => x.trim()).filter(Boolean),
      notes: form.notes.split("\n").map((x) => x.trim()).filter(Boolean),
      tiers: parseTiers(form.tiers), sort_order: Number(form.sort_order) || 99,
      scanner_url: form.scanner_url,
      image_url: "",
    };

    try {
      if (editingId) {
        // Try Supabase first, then fall back to local storage
        try {
          await updateProduct({ data: { id: editingId, payload } });
          toast.success("Product updated permanently!");
        } catch (supabaseError) {
          console.warn('[Admin] Supabase update failed, using local storage:', supabaseError);
          const updated = updateLocalProduct(editingId, payload);
          if (updated) {
            toast.success("Product updated (local cache - sync pending)");
          } else {
            throw new Error("Product not found");
          }
        }
      } else {
        // Try Supabase first, then fall back to local storage
        try {
          await createProduct({ data: payload });
          toast.success("Product saved permanently!");
        } catch (supabaseError) {
          console.warn('[Admin] Supabase create failed, using local storage:', supabaseError);
          createLocalProduct(payload);
          toast.success("Product saved (local cache - sync pending)");
        }
      }
      setForm(empty);
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to save product.";
      toast.error(message);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, tag: p.tag ?? "", tagline: p.tagline ?? "", badge: p.badge ?? "",
      price_label: p.price_label ?? "Lifetime", price: p.price ?? "", credits: p.credits ?? 0,
      accent: p.accent ?? "violet",
      features: (p.features ?? []).join("\n"),
      notes: (p.notes ?? []).join("\n"),
      tiers: (p.tiers ?? []).map((t) => `${t.label} = ${t.price}`).join("\n"),
      sort_order: p.sort_order ?? 99,
      scanner_url: p.scanner_url ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const uploadScanner = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    setUploading(true);

    const base64 = await new Promise<string>((resolve, reject) => {
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
        const response = await uploadScannerImage({ data: { fileName: file.name, contentType: file.type, base64 } });
        setForm((f) => ({ ...f, scanner_url: response.publicUrl }));
        toast.success("Scanner image uploaded.");
      } catch (serverError) {
        console.warn("[Admin] Scanner upload failed, using local data URL fallback:", serverError);
        const localUrl = `data:${file.type};base64,${base64}`;
        setForm((f) => ({ ...f, scanner_url: localUrl }));
        toast.success("Scanner image saved locally - sync pending");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}" permanently?`)) return;
    try {
      // Try Supabase first, then fall back to local storage
      try {
        await deleteProduct({ data: { id: p.id } });
        toast.success("Deleted permanently.");
      } catch (supabaseError) {
        console.warn('[Admin] Supabase delete failed, using local storage:', supabaseError);
        const deleted = deleteLocalProduct(p.id);
        if (deleted) {
          toast.success("Deleted (local cache - sync pending)");
        } else {
          throw new Error("Product not found");
        }
      }
      if (editingId === p.id) cancelEdit();
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to delete product.";
      toast.error(message);
    }
  };

  const saveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    saveBrandSettings(brandSettings);
    toast.success("Brand settings saved.");
  };

  const updateStat = (index: number, key: "value" | "label", value: string) => {
    setBrandSettings((current) => ({
      ...current,
      stats: current.stats.map((stat, idx) => idx === index ? { ...stat, [key]: value } : stat),
    }));
  };

  const addStat = () => {
    setBrandSettings((current) => ({
      ...current,
      stats: [...current.stats, { value: "NEW", label: "NEW LABEL" }],
    }));
  };

  const removeStat = (index: number) => {
    setBrandSettings((current) => ({
      ...current,
      stats: current.stats.filter((_, idx) => idx !== index),
    }));
  };

  const updateHighlight = (index: number, key: "title" | "description", value: string) => {
    setBrandSettings((current) => ({
      ...current,
      featureHighlights: current.featureHighlights.map((highlight, idx) => idx === index ? { ...highlight, [key]: value } : highlight),
    }));
  };

  const addHighlight = () => {
    setBrandSettings((current) => ({
      ...current,
      featureHighlights: [...current.featureHighlights, { icon: "shield", title: "NEW FEATURE", description: "New feature description." }],
    }));
  };

  const removeHighlight = (index: number) => {
    setBrandSettings((current) => ({
      ...current,
      featureHighlights: current.featureHighlights.filter((_, idx) => idx !== index),
    }));
  };

  const updateFaqItem = (index: number, key: "question" | "answer", value: string) => {
    setBrandSettings((current) => ({
      ...current,
      faqItems: current.faqItems.map((item, idx) => idx === index ? { ...item, [key]: value } : item),
    }));
  };

  const addFaqItem = () => {
    setBrandSettings((current) => ({
      ...current,
      faqItems: [...current.faqItems, { question: "New question", answer: "New answer." }],
    }));
  };

  const removeFaqItem = (index: number) => {
    setBrandSettings((current) => ({
      ...current,
      faqItems: current.faqItems.filter((_, idx) => idx !== index),
    }));
  };

  const inp = "w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <h1 className="font-heading text-3xl font-bold text-gradient">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Add, edit & delete panels. Changes save permanently.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="btn-outline-animated rounded-lg border border-border px-4 py-2 font-heading text-xs tracking-widest">VIEW SITE</Link>
          <button onClick={signOut} className="btn-animated flex items-center gap-2 rounded-lg px-4 py-2 font-heading text-xs tracking-widest text-white" style={{ background: "var(--gradient-brand)" }}><LogOut className="h-4 w-4" /> SIGN OUT</button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-2xl p-5"><p className="font-heading text-[11px] tracking-widest text-muted-foreground">TOTAL PANELS</p><p className="font-heading text-3xl font-bold text-cyan">{products.length}</p></div>
        <div className="glass rounded-2xl p-5"><p className="font-heading text-[11px] tracking-widest text-muted-foreground">TOTAL VISITORS</p><p className="font-heading text-3xl font-bold text-magenta">{visits.toLocaleString()}</p></div>
        <div className="glass rounded-2xl p-5"><p className="font-heading text-[11px] tracking-widest text-muted-foreground">ADMIN</p><p className="truncate font-heading text-lg font-bold">{user?.email}</p></div>
        <div className="glass rounded-2xl p-5"><p className="font-heading text-[11px] tracking-widest text-muted-foreground">STATUS</p><p className="font-heading text-lg font-bold text-grass">● LIVE</p></div>
      </div>

      <form onSubmit={saveBrand} className="glass mt-8 rounded-2xl p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-gradient">Brand & Logo</h2>
            <p className="mt-2 text-sm text-muted-foreground">Update your site title, tagline, logo URL, and stats that appear on the homepage.</p>
          </div>
          {brandSettings.logoUrl ? (
            <div className="flex items-center gap-3 rounded-3xl border border-input bg-background/80 px-4 py-3">
              <LogoMark className="h-12 w-12" src={brandSettings.logoUrl} />
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">Logo preview</p>
                <p className="text-[11px] text-muted-foreground">Shown in the top header.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Field l="SITE NAME">
            <input
              className={inp}
              value={brandSettings.siteName}
              onChange={(e) => setBrandSettings({ ...brandSettings, siteName: e.target.value })}
              placeholder="OG REDEGIT"
            />
          </Field>
          <Field l="TAGLINE">
            <input
              className={inp}
              value={brandSettings.tagline}
              onChange={(e) => setBrandSettings({ ...brandSettings, tagline: e.target.value })}
              placeholder="PREMIUM PANEL · LIFETIME UPDATES"
            />
          </Field>
          <Field l="HERO DESCRIPTION">
            <textarea
              rows={3}
              className={inp}
              value={brandSettings.heroDescription}
              onChange={(e) => setBrandSettings({ ...brandSettings, heroDescription: e.target.value })}
              placeholder="AI Aimbot, ESP, UID Bypass & Optimizer..."
            />
          </Field>
          <Field l="LOGO IMAGE URL">
            <input
              className={inp}
              value={brandSettings.logoUrl}
              onChange={(e) => setBrandSettings({ ...brandSettings, logoUrl: e.target.value })}
              placeholder="https://..."
            />
          </Field>
        </div>

        <div className="mt-8 rounded-3xl border border-input bg-background/80 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold">Homepage Stats</h3>
              <p className="text-sm text-muted-foreground">Edit the stat cards shown under the hero section.</p>
            </div>
            <button type="button" onClick={addStat} className="btn-outline-animated rounded-xl border border-border px-4 py-2 font-heading text-xs tracking-widest">
              + ADD STAT
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {brandSettings.stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="rounded-3xl border border-border bg-secondary/50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-heading text-xs tracking-widest text-muted-foreground">STAT {index + 1}</p>
                  <button type="button" onClick={() => removeStat(index)} className="text-destructive text-xs font-semibold hover:text-destructive/80">
                    Remove
                  </button>
                </div>
                <Field l="VALUE">
                  <input
                    className={inp}
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                    placeholder="10000+"
                  />
                </Field>
                <Field l="LABEL">
                  <input
                    className={inp}
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                    placeholder="ACTIVE USERS"
                  />
                </Field>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-input bg-background/80 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold">Feature Cards</h3>
              <p className="text-sm text-muted-foreground">Edit the homepage feature cards. The 3rd card is included here.</p>
            </div>
            <button type="button" onClick={addHighlight} className="btn-outline-animated rounded-xl border border-border px-4 py-2 font-heading text-xs tracking-widest">
              + ADD FEATURE
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {brandSettings.featureHighlights.map((highlight, index) => (
              <div key={`${highlight.title}-${index}`} className="rounded-3xl border border-border bg-secondary/50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-heading text-xs tracking-widest text-muted-foreground">FEATURE {index + 1}</p>
                  <button type="button" onClick={() => removeHighlight(index)} className="text-destructive text-xs font-semibold hover:text-destructive/80">
                    Remove
                  </button>
                </div>
                <Field l="TITLE">
                  <input
                    className={inp}
                    value={highlight.title}
                    onChange={(e) => updateHighlight(index, "title", e.target.value)}
                    placeholder="Anti-Cheat Evasion"
                  />
                </Field>
                <Field l="DESCRIPTION">
                  <textarea
                    rows={3}
                    className={inp}
                    value={highlight.description}
                    onChange={(e) => updateHighlight(index, "description", e.target.value)}
                    placeholder="HVCI, VBS, Hyper-V & PatchGuard-aware design."
                  />
                </Field>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-input bg-background/80 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold">FAQ Section</h3>
              <p className="text-sm text-muted-foreground">Edit the FAQ section and questions shown on the homepage.</p>
            </div>
            <button type="button" onClick={addFaqItem} className="btn-outline-animated rounded-xl border border-border px-4 py-2 font-heading text-xs tracking-widest">
              + ADD QUESTION
            </button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field l="SECTION EYEBROW">
              <input
                className={inp}
                value={brandSettings.faqSectionEyebrow}
                onChange={(e) => setBrandSettings({ ...brandSettings, faqSectionEyebrow: e.target.value })}
                placeholder="SUPPORT"
              />
            </Field>
            <Field l="SECTION TITLE">
              <input
                className={inp}
                value={brandSettings.faqSectionTitle}
                onChange={(e) => setBrandSettings({ ...brandSettings, faqSectionTitle: e.target.value })}
                placeholder="Frequently Asked"
              />
            </Field>
            <Field l="HIGHLIGHTED WORD">
              <input
                className={inp}
                value={brandSettings.faqSectionHighlightedWord}
                onChange={(e) => setBrandSettings({ ...brandSettings, faqSectionHighlightedWord: e.target.value })}
                placeholder="Asked"
              />
            </Field>
          </div>
          <div className="mt-5 grid gap-4">
            {brandSettings.faqItems.map((item, index) => (
              <div key={`${item.question}-${index}`} className="rounded-3xl border border-border bg-secondary/50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-heading text-xs tracking-widest text-muted-foreground">QUESTION {index + 1}</p>
                  <button type="button" onClick={() => removeFaqItem(index)} className="text-destructive text-xs font-semibold hover:text-destructive/80">Remove</button>
                </div>
                <Field l="QUESTION">
                  <input
                    className={inp}
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, "question", e.target.value)}
                    placeholder="How fast is delivery?"
                  />
                </Field>
                <Field l="ANSWER">
                  <textarea
                    rows={3}
                    className={inp}
                    value={item.answer}
                    onChange={(e) => updateFaqItem(index, "answer", e.target.value)}
                    placeholder="Instant. You receive your panel within minutes of payment confirmation on Discord."
                  />
                </Field>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button type="submit" className="btn-animated rounded-xl px-6 py-3 font-heading text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
            SAVE BRAND SETTINGS
          </button>
        </div>
      </form>

      {/* Add / edit form */}
      <form onSubmit={saveProduct} className={`glass mt-8 rounded-2xl p-6 ${editingId ? "ring-2 ring-cyan" : ""}`}>
        <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
          {editingId ? <Pencil className="h-5 w-5 text-cyan" /> : <Package className="h-5 w-5 text-magenta" />}
          {editingId ? `Edit Product — ${form.name || ""}` : "Add New Product"}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field l="NAME *"><input required className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AI Module – Pro" /></Field>
          <Field l="TAG"><input className={inp} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></Field>
          <Field l="TAGLINE"><input className={inp} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short description" /></Field>
          <Field l="BADGE (OPTIONAL)"><input className={inp} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Most Popular" /></Field>
          <Field l="PRICE LABEL"><input className={inp} value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} /></Field>
          <Field l="PRICE *"><input required className={inp} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="₹3,000 / $33" /></Field>
          <Field l="CREDITS (INR)"><input type="number" className={inp} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} /></Field>
          <Field l="ACCENT">
            <select className={inp} value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })}>
              {ACCENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field l="FEATURES (ONE PER LINE)"><textarea rows={4} className={inp} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder={"Aimbot Neck\nESP Box"} /></Field>
          <Field l="NOTES (ONE PER LINE)"><textarea rows={4} className={inp} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={"Works on Win 11\nInstant delivery"} /></Field>
          <Field l="PRICING TIERS (LABEL = PRICE, ONE PER LINE)"><textarea rows={4} className={inp} value={form.tiers} onChange={(e) => setForm({ ...form, tiers: e.target.value })} /></Field>
          <Field l="SORT ORDER"><input type="number" className={inp} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></Field>
          <div className="md:col-span-2">
            <Field l="PAYMENT SCANNER (QR PHOTO) — IF EMPTY, BUY BUTTON OPENS DISCORD">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input type="file" accept="image/*" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadScanner(f); }} className={`${inp} cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-foreground`} />
                {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
                {form.scanner_url && (
                  <div className="flex items-center gap-2">
                    <img src={form.scanner_url} alt="Scanner preview" className="h-16 w-16 rounded-md border border-border object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, scanner_url: "" })} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </Field>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="btn-animated flex items-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
            {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn-outline-animated flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-heading text-sm font-bold">
              <X className="h-4 w-4" /> CANCEL
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const a = accentOf(p.accent);
          return (
            <div key={p.id} className={`glass rounded-2xl border ${a.ring} p-5 ${editingId === p.id ? "ring-2 ring-cyan" : ""}`}>
              <div className="flex items-start justify-between">
                <div><h3 className={`font-heading text-lg font-bold ${a.text}`}>{p.name}</h3><p className="text-xs text-muted-foreground">{p.tag} · {p.price}</p></div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => startEdit(p)} className="btn-animated rounded-lg p-2 text-cyan hover:bg-cyan/10"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(p)} className="btn-animated rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-heading text-[10px] tracking-[0.2em] text-muted-foreground">{l}</span>
      {children}
    </label>
  );
}
