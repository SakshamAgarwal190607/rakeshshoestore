import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Award, Users, Clock } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Rakesh Shoe Store, Bharatpur" },
      { name: "description", content: "Rakesh Shoe Store is a trusted footwear shop near Jama Masjid, Bharatpur, Rajasthan — offering premium branded shoes at honest prices." },
      { property: "og:title", content: "About Rakesh Shoe Store" },
      { property: "og:description", content: "Trusted footwear shop near Jama Masjid, Bharatpur." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const cards = [
  { icon: Award, title: "Premium Brands", body: "We stock only genuine branded footwear so you always get lasting quality." },
  { icon: MapPin, title: "Prime Location", body: "Located near Jama Masjid, Bharatpur — easy to visit, easy to trust." },
  { icon: Users, title: "Loyal Customers", body: "Years of happy customers across Bharatpur and neighbouring towns." },
  { icon: Clock, title: "Everyday Service", body: "Open all week with friendly staff ready to help you find the right pair." },
];

function AboutPage() {
  return (
    <div className="animate-fade-in-up">
      <section className="border-b border-border/60 bg-gradient-to-br from-secondary via-background to-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">About the Store</div>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Bharatpur's most trusted <span className="text-gold-gradient">footwear destination</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            {SITE.name} has been serving customers with premium branded shoes at honest prices for years.
            Whether you need sports shoes, formals, casuals, or gifts for the family, we're a shop the
            neighbourhood trusts.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="glass-card hover-lift rounded-2xl p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-gold">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl bg-primary p-10 text-primary-foreground md:p-14">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-gold-gradient">10+</div>
              <div className="mt-1 text-sm text-primary-foreground/70">Years serving Bharatpur</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-gradient">50+</div>
              <div className="mt-1 text-sm text-primary-foreground/70">Trusted footwear brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-gradient">1000s</div>
              <div className="mt-1 text-sm text-primary-foreground/70">Happy customers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
