import { useEffect, useRef } from "react";

export function CursorGlow() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("cursor-host");
    let rx = 0, ry = 0, x = 0, y = 0, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15;
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

  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-magenta shadow-[0_0_14px_4px_oklch(0.66_0.27_330/0.8)]" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-violet/60" />
    </>
  );
}
