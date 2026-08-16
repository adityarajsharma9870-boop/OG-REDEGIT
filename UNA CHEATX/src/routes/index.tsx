import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Zap, Check, ChevronRight, MessageCircle, Users, ShoppingCart, Cpu, Lock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LogoMark } from "@/components/site/LogoMark";
import BackgroundSpots from "@/components/site/BackgroundSpots";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { BuyModal } from "@/components/site/BuyModal";
import { fetchProducts, accentOf, type Product } from "@/lib/products";
import { loadBrandSettings, type BrandSettings, DEFAULT_BRAND_SETTINGS } from "@/lib/brand";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/intergrations/supabase/client";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OG REDEGIT — Premium OG REDEGIT Panel. Truly Undetected." },
      { name: "description", content: "AI Aimbot, ESP, UID Bypass & Optimizer. Stealth-focused, instant delivery, lifetime updates. Built for tournament players and live streamers." },
      { property: "og:title", content: "OG REDEGIT — Premium Panel" },
      { property: "og:description", content: "AI Aimbot, ESP, UID Bypass & Optimizer. Instant delivery, lifetime updates." },
    ],
  }),
  component: Index,
});


const FEATURE_ICONS = {
  shield: Shield,
  cpu: Cpu,
  zap: Zap,
  lock: Lock,
} as const;


function Index() {
  const { user, isAdmin: authIsAdmin, loading } = useAuth();
  const isAdmin = authIsAdmin || user?.email?.toLowerCase() === "adityasharma4518@gmail.com" || user?.email?.toLowerCase() === "devadmine1234@gmail.com";
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [buying, setBuying] = useState<Product | null>(null);
  const [visits, setVisits] = useState<number | null>(null);
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const handleFaqPointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 14;

    event.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
    event.currentTarget.style.setProperty("--faq-glow-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--faq-glow-y", `${y * 100}%`);
  };

  const handleFaqPointerLeave = (event: React.MouseEvent<HTMLDivElement>) => {
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
        const { data } = await supabase.from("site_stats").select("visits").eq("id", 1).maybeSingle();
        if (active) setVisits(data?.visits ?? null);
        return;
      }
      const { data } = await supabase.rpc("increment_visits");
      if (active && typeof data === "number") { setVisits(data); sessionStorage.setItem("ux_counted", "1"); }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <BackgroundSpots />
      <LoadingScreen />

      {/* Nav */}
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" src={brandSettings.logoUrl || undefined} />
            <div className="leading-none">
              <p className="font-heading text-lg font-bold tracking-[0.35em] uppercase text-gradient">{brandSettings.siteName}</p>
              <p className="text-[10px] tracking-[0.3em] text-muted-foreground">{brandSettings.tagline}</p>
            </div>
          </div>
          <nav className="hidden items-center gap-7 font-heading text-xs tracking-widest text-muted-foreground md:flex">
            <a href="#panels" className="hover:text-foreground">PANELS</a>
            <a href="#why" className="hover:text-foreground">WHY US</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <a href="#cta" className="hover:text-foreground">CONTACT</a>
          </nav>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="btn-outline-animated flex items-center gap-1.5 rounded-lg border border-violet/40 px-3 py-2 font-heading text-xs tracking-widest text-violet hover:text-foreground" style={{ boxShadow: "var(--glow-violet)" }}>
                <Shield className="h-3.5 w-3.5" /> ADMIN PANEL
              </Link>
            )}
            {user ? (
              <button onClick={() => supabase.auth.signOut()} className="btn-animated flex items-center gap-2 rounded-lg px-4 py-2 font-heading text-xs font-semibold tracking-widest text-white" style={{ background: "var(--gradient-brand)" }}>
                <LogOut className="h-3.5 w-3.5" /> SIGN OUT
              </button>
            ) : (
              <Link to="/login" className="btn-animated rounded-lg px-4 py-2 font-heading text-xs font-semibold tracking-widest text-white" style={{ background: "var(--gradient-brand)" }}>
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet/40 px-4 py-1.5 font-heading text-[11px] tracking-[0.25em] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-grass animate-pulse-glow" /> LIFETIME UPDATES · INSTANT DELIVERY
        </span>
        {visits !== null && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5 font-heading text-[11px] tracking-[0.2em] text-cyan">
            <Users className="h-3.5 w-3.5" /> {visits.toLocaleString()} TOTAL VISITORS
          </div>
        )}
        <h1 className="mt-7 text-center font-heading text-5xl font-bold leading-[0.95] sm:text-7xl">
          Premium <span className="font-heading text-gradient">{brandSettings.siteName}</span><br />Panel. Truly<br />Unpatable.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {brandSettings.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#panels" className="btn-animated inline-flex items-center gap-2 rounded-xl px-6 py-3 font-heading text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)", boxShadow: "var(--glow-violet)" }}>
            BROWSE PANELS <ChevronRight className="h-4 w-4" />
          </a>
          <a href="#cta" className="btn-outline-animated inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-heading text-sm font-semibold glass">
            <MessageCircle className="h-4 w-4" /> CONTACT US ON DISCORD
          </a>
        </div>
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {brandSettings.stats.map((s) => (
            <div key={`${s.label}-${s.value}`} className="glass rounded-2xl px-4 py-5 product-card relative">
              <div className="card-spot" />
              <p className="font-heading text-2xl font-bold text-cyan">{s.value}</p>
              <p className="mt-1 font-heading text-[10px] tracking-[0.2em] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section id="why" className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {brandSettings.featureHighlights.map((highlight, index) => {
            const Icon = FEATURE_ICONS[highlight.icon as keyof typeof FEATURE_ICONS] ?? Shield;
            return (
              <div key={`${highlight.title}-${index}`} className={`glass rounded-2xl p-6 product-card relative`}>
                <div className="card-spot" />
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-violet/40 text-violet" style={{ boxShadow: "var(--glow-violet)" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold">{highlight.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Panels */}
      <section id="panels" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <p className="font-heading text-xs tracking-[0.35em] text-magenta">THE OG REDEGIT</p>
          <h2 className="mt-2 font-heading text-4xl font-bold sm:text-5xl">Choose Your <span className="font-heading text-gradient">Panel</span></h2>
          <p className="mt-3 text-muted-foreground">Every panel ships with lifetime updates within 20–30 minutes of any AC patch.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const a = accentOf(p.accent);
            return (
              <div key={p.id} className={`product-card glass flex flex-col rounded-2xl border ${a.ring} p-6`} style={{ ["--card-accent" as string]: a.glow } as React.CSSProperties}>
                <div className="flex items-start justify-between">
                  <p className="font-heading text-[11px] tracking-[0.25em] text-muted-foreground">{p.tag}</p>
                  {p.badge && <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${a.btn}`}>{p.badge}</span>}
                </div>
                <h3 className={`mt-2 font-heading text-2xl font-bold ${a.text}`}>{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${a.text}`} /><span>{f}</span></li>
                  ))}
                </ul>
                {p.tiers?.length > 0 && (
                  <div className="mt-5 space-y-1.5">
                    {p.tiers.map((t, i) => (
                      <div key={i} className="pointer-events-none flex items-center justify-between rounded-lg bg-secondary/60 px-4 py-2 text-sm">
                        <span className="font-heading tracking-wider text-muted-foreground">{t.label}</span>
                        <span className="font-semibold">{t.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setBuying(p)} className={`buy-btn btn-animated mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-heading text-sm font-bold ${a.btn}`}>
                  <ShoppingCart className="h-4 w-4" /> BUY NOW →
                </button>
              </div>
            );
          })}
        </div>
      </section>



      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
        <p className="font-heading text-xs tracking-[0.35em] text-grass text-center">{brandSettings.faqSectionEyebrow}</p>
        <h2 className="faq-title mt-3 text-center font-heading text-4xl font-bold sm:text-5xl">
          {brandSettings.faqSectionTitle.split(new RegExp(`(${brandSettings.faqSectionHighlightedWord})`, "gi")).map((part, index) => (
            part.toLowerCase() === brandSettings.faqSectionHighlightedWord.toLowerCase()
              ? <span key={index} className="text-gradient">{part}</span>
              : <span key={index}>{part}</span>
          ))}
        </h2>
        <Accordion type="single" collapsible className="mt-8">
          {brandSettings.faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              value={`f${i}`}
              className="faq-accordion-item mb-3 px-4"
              onMouseMove={handleFaqPointerMove}
              onMouseLeave={handleFaqPointerLeave}
            >
              <AccordionTrigger className="font-heading text-lg text-left hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="glass rounded-3xl px-6 py-16" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="font-heading text-xs tracking-[0.35em] text-grass">READY TO DOMINATE?</p>
          <h2 className="mt-3 font-heading text-4xl font-bold sm:text-6xl">FOR ANY QUERY<span className="text-gradient"></span> DM US.</h2>
          <p className="mt-4 text-muted-foreground">UPI · Binance · Bkash supported. Custom packages, seller credits & bulk deals available.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#panels" className="btn-animated inline-flex items-center gap-2 rounded-xl px-7 py-3 font-heading text-sm font-bold text-white" style={{ background: "var(--gradient-brand)", boxShadow: "var(--glow-violet)" }}>
              <ShoppingCart className="h-4 w-4" /> BUY NOW
            </a>
            <a href="https://discord.gg/NheAdhyT" target="_blank" rel="noreferrer" className="btn-outline-animated inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3 font-heading text-sm font-bold glass">
              <MessageCircle className="h-4 w-4" /> CONTACT US ON DISCORD
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 font-heading text-[11px] tracking-[0.25em] text-muted-foreground">
            <span>UPI (IN)</span><span>BINANCE</span><span>BKASH (BD)</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center font-heading text-xs tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} UNA CHEATX · ALL RIGHTS RESERVED
      </footer>

      <BuyModal product={buying} onClose={() => setBuying(null)} />
    </div>
  );
}
