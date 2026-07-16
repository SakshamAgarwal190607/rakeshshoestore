import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PackageX } from "lucide-react";

export const Route = createFileRoute("/clearance")({
  head: () => ({
    meta: [
      { title: "Clearance Deals | Rakesh Shoe Store, Bharatpur" },
      { name: "description", content: "Exclusive clearance deals on premium branded footwear at Rakesh Shoe Store, Bharatpur — only one piece available for each product." },
      { property: "og:title", content: "Clearance Deals — Only 1 Piece Available" },
      { property: "og:description", content: "Grab premium branded shoes at exclusive clearance prices. First come, first serve." },
      { property: "og:url", content: "/clearance" },
    ],
    links: [{ rel: "canonical", href: "/clearance" }],
  }),
  component: ClearancePage,
});

type SortKey = "newest" | "price_asc" | "price_desc";

function ClearancePage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const [size, setSize] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    supabase
      .from("clearance_products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Product[]) ?? []));

    const ch = supabase
      .channel("clearance-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clearance_products" },
        () => {
          supabase
            .from("clearance_products")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => setItems((data as Product[]) ?? []));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const { categories, brands, sizes } = useMemo(() => {
    const c = new Set<string>();
    const b = new Set<string>();
    const s = new Set<string>();
    (items ?? []).forEach((p) => {
      c.add(p.category);
      b.add(p.brand);
      s.add(p.size);
    });
    return { categories: [...c].sort(), brands: [...b].sort(), sizes: [...s].sort() };
  }, [items]);

  const filtered = useMemo(() => {
    let list = items ?? [];
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((p) => `${p.product_name} ${p.brand} ${p.category}`.toLowerCase().includes(q));
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (brand !== "all") list = list.filter((p) => p.brand === brand);
    if (size !== "all") list = list.filter((p) => p.size === size);
    if (availability !== "all") list = list.filter((p) => p.status === availability);

    if (sort === "price_asc")
      list = [...list].sort((a, b) => Number(a.clearance_price) - Number(b.clearance_price));
    if (sort === "price_desc")
      list = [...list].sort((a, b) => Number(b.clearance_price) - Number(a.clearance_price));
    return list;
  }, [items, search, category, brand, size, availability, sort]);

  return (
    <div className="animate-fade-in-up">
      <section className="border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Exclusive</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Clearance <span className="text-gold-gradient">Deals</span>
          </h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/75">
            Handpicked branded footwear at exclusive prices. Every product listed here has
            <span className="mx-1 font-semibold text-gold">only one piece available</span>
            — first come, first serve.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="glass-card rounded-2xl p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-6">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sizes</SelectItem>
                {sizes.map((s) => <SelectItem key={s} value={s}>Size {s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        {items === null ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[440px] rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
            <PackageX className="h-10 w-10 text-muted-foreground" />
            <div className="mt-3 font-display text-lg font-semibold">No products found</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or check back soon — new deals are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
