
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

const ADMIN_EMAIL = "rensakusa@gmail.com";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In | Rakesh Shoe Store" },
      {
        name: "description",
        content: "Sign in to manage products at Rakesh Shoe Store.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin", replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== ADMIN_EMAIL) {
      toast.error("This email is not authorized for admin login.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setBusy(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data.user) {
        toast.error(error?.message ?? "Login failed.");
        return;
      }

      // Verify the admin role from Supabase.
      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (
        roleError ||
        !role ||
        data.user.email?.toLowerCase() !== ADMIN_EMAIL
      ) {
        await supabase.auth.signOut();
        toast.error(
          "Admin access is not enabled for this account. Please check the admin role."
        );
        return;
      }

      toast.success("Login successful! Welcome to Admin Dashboard.");
      navigate({ to: "/admin", replace: true });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-gold">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold">
          Admin Access
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage products, clearance deals, and stock.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <form onSubmit={signIn} className="space-y-4">
          <div>
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={busy || loading}
            className="btn-royal w-full"
          >
            {busy ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
