import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Flame, Star, Ruler, Palette, Tag } from "lucide-react";
import { whatsappBuyUrl } from "@/lib/site";
import { resolveImageUrl } from "@/lib/product-image";
import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["clearance_products"]["Row"];

export function formatINR(n: number | string) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function ProductCard({ product }: { product: Product }) {
  const [img, setImg] = useState<string | null>(null);
  const sold = product.status === "Sold";
  const discount = Math.max(
    0,
    Math.round(((Number(product.original_price) - Number(product.clearance_price)) / Number(product.original_price)) * 100),
  );

  useEffect(() => {
    let alive = true;
    resolveImageUrl(product.image_url).then((u) => alive && setImg(u));
    return () => {
      alive = false;
    };
  }, [product.image_url]);

  return (
    <article className="glass-card hover-lift group relative flex flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {img ? (
          <img
            src={img}
            alt={product.product_name}
            loading="lazy"
            width={800}
            height={600}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${sold ? "opacity-50 grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {sold ? (
            <Badge className="bg-destructive text-destructive-foreground shadow">SOLD OUT</Badge>
          ) : (
            <>
              <Badge className="gap-1 bg-gradient-to-r from-[oklch(0.86_0.13_88)] to-[oklch(0.72_0.16_70)] text-[oklch(0.18_0.04_70)]">
                <Flame className="h-3 w-3" /> Clearance Deal
              </Badge>
              <Badge variant="outline" className="gap-1 border-gold/50 bg-background/80 text-foreground backdrop-blur">
                <Star className="h-3 w-3 text-gold" /> Only 1 Piece Left
              </Badge>
            </>
          )}
        </div>

        {!sold && discount > 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-royal px-3 py-1 text-xs font-bold text-royal-foreground shadow">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {product.brand} • {product.category}
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{product.product_name}</h3>
        </div>

        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
            <Ruler className="h-3 w-3" /> Size {product.size}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
            <Palette className="h-3 w-3" /> {product.color}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
            <Tag className="h-3 w-3" /> {product.condition}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border/60 pt-3">
          <div>
            <div className="text-xs text-muted-foreground line-through">
              {formatINR(product.original_price)}
            </div>
            <div className="text-2xl font-bold text-success">{formatINR(product.clearance_price)}</div>
          </div>
          <div className="text-right text-[10px] uppercase tracking-wide text-muted-foreground">
            Limited Stock<br />First Come First Serve
          </div>
        </div>

        {sold ? (
          <Button disabled className="w-full" variant="secondary">
            Sold Out
          </Button>
        ) : (
          <a href={whatsappBuyUrl(product.product_name)} target="_blank" rel="noopener noreferrer">
            <Button className="w-full gap-2 bg-success text-success-foreground hover:bg-success/90">
              <MessageCircle className="h-4 w-4" /> Contact to Buy
            </Button>
          </a>
        )}
      </div>
    </article>
  );
}
