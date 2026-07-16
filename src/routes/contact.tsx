import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SITE, whatsappUrl } from "@/lib/site";
import { MapPin, Phone, MessageCircle, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Rakesh Shoe Store, Bharatpur" },
      { name: "description", content: "Reach Rakesh Shoe Store — Jama Masjid, Bharatpur, Rajasthan. Call +91 9828270127 or send us a WhatsApp message." },
      { property: "og:title", content: "Contact Rakesh Shoe Store" },
      { property: "og:description", content: "Visit or message Bharatpur's trusted footwear shop." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please add your name and a message.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      message: form.message.trim(),
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't send. Please try WhatsApp instead.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="animate-fade-in-up">
      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Get in touch</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Visit our shop, call us, or send a message — we're always happy to help you find the right pair.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-2 md:px-6">
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-gold">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-semibold">{SITE.name}</div>
                <div className="text-sm text-muted-foreground">{SITE.address}</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-gold">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Call us</div>
                <a href={`tel:${SITE.phoneRaw}`} className="font-display text-lg font-semibold hover:text-royal">
                  {SITE.phone}
                </a>
              </div>
            </div>
          </div>
          <a
            href={whatsappUrl("Hello, I have a question about your shoes.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-lift flex items-center justify-between gap-3 rounded-2xl bg-success p-6 text-success-foreground"
          >
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90">Fastest response</div>
              <div className="font-display text-xl font-semibold">Message on WhatsApp</div>
            </div>
            <MessageCircle className="h-8 w-8" />
          </a>
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
              <Clock className="h-4 w-4" /> Business Hours
            </div>
            <ul className="space-y-1.5 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="font-medium">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl p-6">
            <div className="font-display text-xl font-semibold">Send us a message</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={busy} className="btn-royal gap-2">
              <Send className="h-4 w-4" /> {busy ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <div className="overflow-hidden rounded-2xl border">
            <iframe
              title="Rakesh Shoe Store location"
              src="https://www.google.com/maps?q=Jama+Masjid+Bharatpur+Rajasthan&output=embed"
              width="100%"
              height="300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
