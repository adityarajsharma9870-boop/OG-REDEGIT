import { useEffect, useState } from "react";
import { LogoMark } from "./LogoMark";

export function LoadingScreen() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Always show loading screen on page load
    if (typeof window !== "undefined") {
      // Clear the flag on each page load so loading shows every time
      sessionStorage.removeItem("og_redegit_loading_done");
    }

    // Preload fonts to ensure they're available on loading screen
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

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background bg-grid transition-opacity duration-500 ${pct >= 100 ? "opacity-0" : "opacity-100"}`}>
      <LogoMark className="mb-6 h-16 w-16 animate-pulse-glow" />
      <h1 className="loading-brand">
        OG REDEGIT
      </h1>
      <div className="mt-8 h-[3px] w-64 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full transition-all duration-200" style={{ width: `${pct}%`, background: "var(--gradient-brand)" }} />
      </div>
      <p className="mt-4 font-heading text-xs tracking-[0.35em] text-muted-foreground uppercase">
        OPTIMIZING SYSTEM... {Math.floor(pct)}%
      </p>
    </div>
  );
}
