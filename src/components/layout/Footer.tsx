import { Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="space-y-3">
          <div className="font-display text-xl font-semibold">{SITE.name}</div>
          <p className="text-sm text-primary-foreground/70">
            A trusted footwear shop offering premium branded shoes at honest prices — serving Bharatpur for years.
          </p>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Quick Links</div>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><Link to="/clearance" className="hover:text-gold">Clearance Deals</Link></li>
            <li><Link to="/categories" className="hover:text-gold">Categories</Link></li>
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Visit Us</div>
          <ul className="space-y-2 text-sm text-primary-foreground/75">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{SITE.address}</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{SITE.phone}</li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">Connect</div>
          <a
            href={whatsappUrl("Hello, I have a question about your shoes.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-success-foreground shadow-md transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
          <div className="mt-4 flex gap-2">
            <a href="#" aria-label="Instagram" className="rounded-full border border-primary-foreground/20 p-2 hover:border-gold hover:text-gold">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-primary-foreground/20 p-2 hover:border-gold hover:text-gold">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60 md:flex-row md:px-6">
          <div>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
          <div>Jama Masjid, Bharatpur, Rajasthan</div>
        </div>
      </div>
    </footer>
  );
}
