import logoMark from "@/assets/logo-mark.png";

// Set LOGO_SRC to "" to show the "U" letter fallback instead of the image.
const LOGO_SRC: string = logoMark;

export function LogoMark({ className = "h-9 w-9", src }: { className?: string; src?: string }) {
  if (src) {
    return <img src={src} alt="Brand logo" width={512} height={512} className={`${className} object-contain`} />;
  }

  if (LOGO_SRC) {
    return <img src={LOGO_SRC} alt="OG REDEGIT logo" width={512} height={512} className={`${className} object-contain`} />;
  }
  return (
    <div className={`${className} grid place-items-center rounded-xl font-display text-lg font-extrabold text-white`} style={{ background: "var(--gradient-violet)", boxShadow: "var(--glow-violet)" }}>
      U
    </div>
  );
}
