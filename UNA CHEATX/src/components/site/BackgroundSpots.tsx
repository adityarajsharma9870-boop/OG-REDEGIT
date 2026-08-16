import { useEffect, useRef } from "react";

const SPOTS = [
  { left: "12%", top: "22%", size: 12, color: "var(--magenta)" },
  { left: "36%", top: "40%", size: 10, color: "var(--violet)" },
  { left: "72%", top: "18%", size: 14, color: "var(--cyan)" },
  { left: "18%", top: "72%", size: 9, color: "var(--magenta)" },
  { left: "58%", top: "64%", size: 11, color: "var(--violet)" },
  { left: "84%", top: "48%", size: 8, color: "var(--magenta)" },
];

export function BackgroundSpots() {
  const container = useRef<HTMLDivElement | null>(null);
  const refs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
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
        r.style.filter = `drop-shadow(0 0 ${6 + proximity * 18}px ${getComputedStyle(r).getPropertyValue('--spot-color') || 'rgba(255,0,255,0.7)'} )`;
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

  return (
    <div ref={container} className="pointer-events-none fixed inset-0 z-10">
      {SPOTS.map((s, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el!)}
          className="bg-spot"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            ["--spot-color" as any]: s.color,
            ["--fall-delay" as any]: `${i * 1.2}s`,
            ["--fall-duration" as any]: `${10 + i * 2}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default BackgroundSpots;
