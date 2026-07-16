import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE, whatsappUrl } from "@/lib/site";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories | Rakesh Shoe Store, Bharatpur" },
      { name: "description", content: "Browse footwear categories — sports, running, casual, formal, school shoes, sandals, slippers, women's and kids' footwear." },
      { property: "og:title", content: "Footwear Categories | Rakesh Shoe Store" },
      { property: "og:description", content: "Explore every category we stock at Rakesh Shoe Store, Bharatpur." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Shop By</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Categories</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            From everyday essentials to premium branded picks — every kind of footwear you need, under one roof.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SITE.categories.map((c, i) => {
            const isClearance = c === "Clearance Deals";
            return (
              <div
                key={c}
                className={`hover-lift group relative overflow-hidden rounded-2xl border p-6 ${
                  isClearance ? "border-gold/50 bg-primary text-primary-foreground" : "glass-card"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="text-xs uppercase tracking-[0.18em] text-gold">Category</div>
                <div className="mt-1 font-display text-xl font-semibold">{c}</div>
                <p className={`mt-3 text-sm ${isClearance ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {isClearance
                    ? "Only one piece available — grab it before it's gone."
                    : "Handpicked pairs across leading brands, in every size and style."}
                </p>
                <div className="mt-5 flex gap-2">
                  {isClearance ? (
                    <Link to="/clearance">
                      <Button size="sm" className="btn-royal">Browse Deals</Button>
                    </Link>
                  ) : (
                    <a
                      href={whatsappUrl(`Hi! I'm looking for ${c}. Can you share what's available?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="gap-2 bg-success text-success-foreground hover:bg-success/90">
                        <MessageCircle className="h-4 w-4" /> Enquire
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
