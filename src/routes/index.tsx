import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, BadgeCheck, Sparkles, HeartHandshake, Phone, MessageCircle } from "lucide-react";
import heroShoes from "@/assets/hero-shoes.jpg";
import { SITE, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rakesh Shoe Store | Premium Footwear Shop in Bharatpur" },
      {
        name: "description",
        content:
          "Rakesh Shoe Store in Jama Masjid, Bharatpur offers premium branded footwear and exclusive clearance deals with only one piece available.",
      },
      { property: "og:title", content: "Rakesh Shoe Store | Premium Footwear in Bharatpur" },
      { property: "og:description", content: "Premium branded footwear and clearance deals in Bharatpur, Rajasthan." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const badges = [
  { icon: BadgeCheck, label: "Genuine Products" },
  { icon: Sparkles, label: "Best Prices" },
  { icon: ShieldCheck, label: "Branded Footwear" },
  { icon: HeartHandshake, label: "Friendly Support" },
];

function HomePage() {
  return (
    <div className="animate-fade-in-up">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img
          src={heroShoes}
          alt="Premium footwear collection at Rakesh Shoe Store"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero-overlay)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 md:px-6 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur">
            <Sparkles className="h-3 w-3" /> Bharatpur's Trusted Footwear Store
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Premium Footwear for <span className="text-gold-gradient">Every Occasion</span>
          </h1>
          <p className="max-w-xl text-base text-primary-foreground/80 md:text-lg">
            {SITE.subtagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/clearance">
              <Button size="lg" className="btn-royal gap-2">
                View Clearance Deals <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="gap-2 border-gold/40 bg-transparent text-primary-foreground hover:bg-gold hover:text-gold-foreground">
                <Phone className="h-4 w-4" /> Contact Us
              </Button>
            </Link>
          </div>

          <div className="mt-6 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 rounded-xl border border-gold/20 bg-black/30 px-3 py-2 text-sm backdrop-blur">
                <b.icon className="h-4 w-4 text-gold" /> {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Shop by</div>
            <h2 className="mt-1 font-display text-3xl font-bold">Categories</h2>
          </div>
          <Link to="/categories" className="hidden text-sm font-medium text-royal hover:underline md:inline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {SITE.categories.slice(0, 10).map((c) => (
            <Link
              key={c}
              to="/categories"
              className="hover-lift glass-card flex items-center justify-center rounded-xl p-4 text-center text-sm font-medium"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* CLEARANCE TEASER */}
      <section className="mx-auto mb-8 max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-royal/30 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Exclusive</div>
              <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">
                Clearance Deals — Only <span className="text-gold-gradient">One Piece</span> Available
              </h2>
              <p className="mt-3 text-primary-foreground/75">
                Hand-picked branded shoes at unbelievable prices. First come, first serve.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/clearance">
                <Button size="lg" className="btn-royal">Browse Deals</Button>
              </Link>
              <a href={whatsappUrl("Hi! I saw your clearance deals — can you share what's new?")} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 border-gold/50 bg-transparent text-primary-foreground hover:bg-gold hover:text-gold-foreground">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
