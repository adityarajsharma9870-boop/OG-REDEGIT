import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, Zap, Check, ChevronRight, MessageCircle, Users, ShoppingCart, Cpu, Lock, Headphones, Sparkles, Coins, CreditCard } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LogoMark } from "@/components/site/LogoMark";
import BackgroundSpots from "@/components/site/BackgroundSpots";
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
  const { user, isAdmin: authIsAdmin, loading, signOut } = useAuth();
  const isAdmin = authIsAdmin || user?.email?.toLowerCase() === "adityasharma4518@gmail.com" || user?.email?.toLowerCase() === "devadmine1234@gmail.com";
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);
  const [buying, setBuying] = useState<Product | null>(null);
  const [visits, setVisits] = useState<number | null>(null);
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  useEffect(() => {
    const ch = supabase
      .channel("products-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        qc.invalidateQueries({ queryKey: ["products"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

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

  const handleCtaPointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    event.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) scale(1.008)`;
    event.currentTarget.style.setProperty("--cta-glow-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--cta-glow-y", `${y * 100}%`);
  };

  const handleCtaPointerLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    event.currentTarget.style.setProperty("--cta-glow-x", "50%");
    event.currentTarget.style.setProperty("--cta-glow-y", "50%");
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
              <button onClick={signOut} className="btn-animated flex items-center gap-2 rounded-lg px-4 py-2 font-heading text-xs font-semibold tracking-widest text-white cursor-pointer" style={{ background: "var(--gradient-brand)" }}>
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
      <section id="cta" className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        {/* Ambient atmospheric glow behind card */}
        <div
          className="pointer-events-none absolute inset-x-8 top-12 bottom-12 rounded-[40px] opacity-70 blur-3xl animate-pulse-glow"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.28) 0%, rgba(168,85,247,0.28) 35%, rgba(6,182,212,0.2) 70%, transparent 95%)",
          }}
        />

        <div
          className="cta-card relative overflow-hidden rounded-3xl px-6 py-14 sm:px-12 sm:py-16 text-center"
          onMouseMove={handleCtaPointerMove}
          onMouseLeave={handleCtaPointerLeave}
        >
          {/* Cyber HUD Corner Accents */}
          <div className="pointer-events-none absolute top-4 left-4 h-5 w-5 border-l-2 border-t-2 border-cyan/70 rounded-tl" />
          <div className="pointer-events-none absolute top-4 right-4 h-5 w-5 border-r-2 border-t-2 border-magenta/70 rounded-tr" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-l-2 border-b-2 border-magenta/70 rounded-bl" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-r-2 border-b-2 border-cyan/70 rounded-br" />

          {/* Top Pill / Status Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-grass/30 bg-grass/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(74,222,128,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-grass"></span>
            </span>
            <span className="font-heading text-xs font-bold tracking-[0.3em] text-grass uppercase">
              READY TO DOMINATE?
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 font-heading text-[11px] tracking-wider text-cyan">
              <Zap className="h-3 w-3" /> 24/7 INSTANT SUPPORT
            </span>
          </div>

          {/* Main Title */}
          <h2 className="mt-5 font-heading text-4xl sm:text-6xl font-extrabold uppercase tracking-tight leading-tight">
            FOR ANY QUERY{" "}
            <span className="text-gradient drop-shadow-[0_0_35px_rgba(236,72,153,0.5)]">
              DM US.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            UPI · Binance · Bkash supported. Custom packages, seller credits &amp; bulk wholesale deals available directly on Discord.
          </p>

          {/* 4 Feature / Trust Cards */}
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 text-left">
            <div className="perk-chip rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/15 text-cyan border border-cyan/30">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <span className="font-heading text-xs font-bold tracking-wider text-foreground">INSTANT KEY</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-snug">Automated delivery dispatched within 2 mins of payment.</p>
            </div>

            <div className="perk-chip rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-grass/15 text-grass border border-grass/30">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <span className="font-heading text-xs font-bold tracking-wider text-foreground">UNDETECTED</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-snug">Stream-proof &amp; tournament approved kernel bypass.</p>
            </div>

            <div className="perk-chip rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet/20 text-violet border border-violet/40">
                  <Headphones className="h-3.5 w-3.5" />
                </div>
                <span className="font-heading text-xs font-bold tracking-wider text-foreground">1-ON-1 HELP</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-snug">Direct screen-share &amp; discord ticket assistance.</p>
            </div>

            <div className="perk-chip rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-magenta/15 text-magenta border border-magenta/30">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="font-heading text-xs font-bold tracking-wider text-foreground">BULK DEALS</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-snug">Special discounts for resellers &amp; team packages.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#panels"
              className="btn-animated group inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 font-heading text-sm font-bold tracking-wider text-white shadow-[0_0_35px_-4px_rgba(236,72,153,0.65)]"
              style={{ background: "var(--gradient-brand)" }}
            >
              <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
              BUY NOW
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="https://discord.gg/NheAdhyT"
              target="_blank"
              rel="noreferrer"
              className="btn-animated group inline-flex items-center gap-2.5 rounded-xl border border-[#5865F2]/60 bg-[#5865F2]/20 hover:bg-[#5865F2]/35 px-8 py-3.5 font-heading text-sm font-bold tracking-wider text-white shadow-[0_0_30px_-6px_rgba(88,101,242,0.5)] transition-all"
            >
              <svg className="h-4 w-4 fill-current text-[#7983F5] group-hover:text-white transition-colors" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              CONTACT US ON DISCORD
              <span className="relative ml-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-grass"></span>
              </span>
            </a>
          </div>

          {/* Payment Gateways Bar */}
          <div className="mt-11 border-t border-white/10 pt-7">
            <p className="flex items-center justify-center gap-2 font-heading text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
              <Lock className="h-3 w-3 text-cyan" /> SUPPORTED PAYMENT METHODS · INSTANT VERIFICATION
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <div className="payment-badge flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2">
                <span className="text-base">🇮🇳</span>
                <div className="text-left">
                  <p className="font-heading text-xs font-bold text-emerald-400">UPI (IN)</p>
                  <p className="text-[10px] text-muted-foreground">GPay · PhonePe · Paytm · QR</p>
                </div>
              </div>

              <div className="payment-badge flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2">
                <Coins className="h-4 w-4 text-amber-400" />
                <div className="text-left">
                  <p className="font-heading text-xs font-bold text-amber-400">BINANCE</p>
                  <p className="text-[10px] text-muted-foreground">USDT · BTC · Crypto (0% Fee)</p>
                </div>
              </div>

              <div className="payment-badge flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-3.5 py-2">
                <span className="text-base">🇧🇩</span>
                <div className="text-left">
                  <p className="font-heading text-xs font-bold text-pink-400">BKASH (BD)</p>
                  <p className="text-[10px] text-muted-foreground">bKash · Nagad (BDT Direct)</p>
                </div>
              </div>

              <div className="payment-badge flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2">
                <CreditCard className="h-4 w-4 text-cyan" />
                <div className="text-left">
                  <p className="font-heading text-xs font-bold text-cyan">GLOBAL / CARDS</p>
                  <p className="text-[10px] text-muted-foreground">PayPal &amp; Cards via Ticket</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center font-heading text-xs tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} OG REDEGIT · ALL RIGHTS RESERVED
      </footer>

      <BuyModal product={buying} onClose={() => setBuying(null)} />
    </div>
  );
}
