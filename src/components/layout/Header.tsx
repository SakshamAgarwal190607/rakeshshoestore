import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck, Sun, Moon, LogOut } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/clearance", label: "Clearance Deals" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { user, isAdmin } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-display">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">R</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">{SITE.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gold">Premium Footwear</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {isAdmin && (
            <Link to="/admin" className="hidden md:block">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="hidden md:flex">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">
                Admin Dashboard
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
