
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "sakshamagrawal1962007@gmail.com";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
});

async function checkAdmin(user: User | null): Promise<boolean> {
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return false;
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Admin role verification failed:", error.message);
    return false;
  }

  return !!data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let checkVersion = 0;

    const applySession = async (nextSession: Session | null) => {
      const currentVersion = ++checkVersion;
      const nextUser = nextSession?.user ?? null;

      if (active) {
        setSession(nextSession);
        setUser(nextUser);
        setIsAdmin(false);
        setLoading(true);
      }

      const admin = await checkAdmin(nextUser);

      // Ignore results from an older session or an unmounted component.
      if (!active || currentVersion !== checkVersion) {
        return;
      }

      setIsAdmin(admin);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Could not retrieve session:", error.message);
      }

      if (active) {
        void applySession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Defer the role query until after the auth callback finishes.
      setTimeout(() => {
        if (active) {
          void applySession(nextSession);
        }
      }, 0);
    });

    return () => {
      active = false;
      checkVersion++;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
