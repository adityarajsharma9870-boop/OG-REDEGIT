import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";

const DISCORD_URL = "https://discord.gg/NheAdhyT";

export function BuyModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [scannerLoaded, setScannerLoaded] = useState(false);
  const hasScanner = !!product?.scanner_url;

  // Reset scanner loaded state when product changes (must be before early return)
  useEffect(() => {
    setScannerLoaded(false);
  }, [product?.id]);

  if (!product) return null;

  const selectedTier = product.tiers?.[selectedTierIndex];

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass relative w-full max-w-md rounded-2xl p-6 animate-float-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        <p className="font-heading text-[11px] tracking-[0.3em] text-cyan">COMPLETE PURCHASE</p>
        <h3 className="mt-1 font-heading text-2xl font-bold">Buy {product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Scan the QR below and message us on Discord to confirm.</p>

        {/* Tier Selection */}
        {product.tiers && product.tiers.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tiers.map((tier, index) => (
              <button
                key={index}
                onClick={() => setSelectedTierIndex(index)}
                className={`px-3 py-2 rounded-lg font-heading text-xs font-semibold tracking-wide transition-all ${
                  selectedTierIndex === index
                    ? "bg-cyan text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        )}

        {/* Price Display */}
        {selectedTier && (
          <p className="mt-3 font-heading text-xl font-bold text-cyan">{selectedTier.price}</p>
        )}

        <div className="mt-5 rounded-2xl bg-white p-5 text-center text-black">
          <p className="mb-3 text-xs text-neutral-500">{product.price}</p>
          {hasScanner ? (
            <div className="relative mx-auto h-80 w-80 flex items-center justify-center bg-neutral-100 rounded-lg">
              {/* Loading spinner */}
              {!scannerLoaded && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin">
                      <div className="h-12 w-12 border-3 border-neutral-300 border-t-cyan rounded-full"></div>
                    </div>
                    <p className="text-xs text-neutral-500 font-heading tracking-wider">LOADING QR CODE...</p>
                  </div>
                </div>
              )}
              {/* Scanner Image */}
              <img 
                src={product.scanner_url} 
                alt={`${product.name} payment scanner`} 
                className={`h-80 w-80 object-contain transition-opacity duration-300 ${scannerLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setScannerLoaded(true)}
                onError={() => setScannerLoaded(true)}
              />
            </div>
          ) : (
            <div className="mx-auto grid h-56 w-56 place-items-center text-neutral-400">No scanner available</div>
          )}
          <p className="mt-3 text-[11px] text-neutral-400">Message us once you complete the payment.</p>
        </div>

        <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn-animated mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center font-heading text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          <MessageCircle className="h-4 w-4" /> Message us on Discord
        </a>
      </div>
    </div>
  );
}
