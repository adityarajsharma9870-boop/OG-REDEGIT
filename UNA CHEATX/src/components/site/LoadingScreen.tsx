import { useEffect, useState } from "react";
import { LogoMark } from "./LogoMark";

export function LoadingScreen() {
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return true;
    return Boolean(sessionStorage.getItem("og_redegit_loading_done"));
  });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (done) return;

    const t = setInterval(() => {
      setPct((p) => {
        const next = p + 25;
        if (next >= 100) {
          clearInterval(t);
          sessionStorage.setItem("og_redegit_loading_done", "1");
          setTimeout(() => setDone(true), 300);
          return 100;
        }
        return next;
      });
    }, 60);

    return () => clearInterval(t);
  }, [done]);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background bg-grid transition-opacity duration-300 ${
        pct >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <LogoMark className="mb-6 h-16 w-16 animate-pulse-glow" />
      <h1 className="loading-brand">
        OG REDEGIT
      </h1>
      <div className="mt-8 h-[3px] w-64 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: "var(--gradient-brand)" }}
        />
      </div>
      <p className="mt-4 font-heading text-xs tracking-[0.35em] text-muted-foreground uppercase">
        OPTIMIZING SYSTEM... {Math.floor(pct)}%
      </p>
    </div>
  );
}
