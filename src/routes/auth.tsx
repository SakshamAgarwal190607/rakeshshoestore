import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
validateSearch: (s) => searchSchema.parse(s),
head: () => ({
meta: [
{ title: "Admin Sign In | Rakesh Shoe Store" },
{ name: "description", content: "Sign in to manage products at Rakesh Shoe Store." },
{ name: "robots", content: "noindex" },
],
}),
component: AuthPage,
});

function AuthPage() {
const navigate = useNavigate();
const { redirect } = useSearch({ from: "/auth" });
const { user, loading } = useAuth();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [busy, setBusy] = useState(false);

useEffect(() => {
if (!loading && user) {
navigate({ to: redirect === "/admin" ? "/admin" : "/admin" });
}
}, [user, loading, redirect, navigate]);

const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();

```
if (busy) return;

setBusy(true);

try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    toast.error(
      error.status === 429
        ? "Too many login attempts. Please wait before trying again."
        : "Login failed. Check your email and password."
    );
    return;
  }

  if (!data.user) {
    toast.error("Unable to verify your account.");
    await supabase.auth.signOut();
    return;
  }

  // IMPORTANT:
  // Replace this placeholder with your actual admin email.
  const ADMIN_EMAIL = "sakshamagrawal1962007@gmail.com";

  if (data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    await supabase.auth.signOut();
    toast.error("You are not authorized to access the admin panel.");
    return;
  }

  toast.success("Welcome back, Admin!");
  navigate({ to: "/admin" });
} catch {
  toast.error("Something went wrong. Please try again.");
} finally {
  setBusy(false);
}
```

};

return ( <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16"> <div className="text-center"> <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-gold"> <ShieldCheck className="h-6 w-6" /> </div>

```
    <h1 className="mt-4 font-display text-3xl font-bold">
      Admin Login
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
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={busy}
        className="btn-royal w-full"
      >
        {busy ? "Signing in..." : "Sign In as Admin"}
      </Button>
    </form>
  </div>
</div>
```

);
}
