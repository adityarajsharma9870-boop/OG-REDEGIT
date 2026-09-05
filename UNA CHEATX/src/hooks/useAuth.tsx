import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/intergrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsAdmin: (email?: string) => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  loginAsAdmin: () => {},
});

function getInitialAdminSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("fake_admin_session");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed?.email) {
      return { user: { id: parsed.id || "fake-admin", email: parsed.email } } as any;
    }
  } catch {}
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const FAKE_ADMIN_KEY = "fake_admin_session";

  const initialAdmin = getInitialAdminSession();
  const [session, setSession] = useState<Session | null>(initialAdmin);
  const [isAdmin, setIsAdmin] = useState<boolean>(Boolean(initialAdmin));
  const [loading, setLoading] = useState<boolean>(!initialAdmin);

  const loginAsAdmin = (email?: string) => {
    const cleanEmail = email?.trim().toLowerCase() || "adityarajsharma9070@gmail.com";
    const fakeSession = { user: { id: "fake-admin", email: cleanEmail } } as any;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(FAKE_ADMIN_KEY, JSON.stringify({ email: cleanEmail, id: "fake-admin" }));
      } catch {}
    }
    setSession(fakeSession);
    setIsAdmin(true);
    setLoading(false);
    window.dispatchEvent(new Event("fake_admin_login"));
  };

  useEffect(() => {
    const loadFakeAdmin = () => {
      if (typeof window === "undefined") return false;
      const stored = localStorage.getItem(FAKE_ADMIN_KEY);
      if (!stored) return false;

      try {
        const parsed = JSON.parse(stored);
        if (!parsed?.email) {
          localStorage.removeItem(FAKE_ADMIN_KEY);
          return false;
        }

        const fakeSession = { user: { id: parsed.id || "fake-admin", email: parsed.email } } as any;
        setSession(fakeSession);
        setIsAdmin(true);
        setLoading(false);
        return true;
      } catch {
        localStorage.removeItem(FAKE_ADMIN_KEY);
        return false;
      }
    };

    const checkAdmin = async (uid: string | undefined, email?: string | null) => {
      const lower = email?.toLowerCase();
      if (
        lower === "adityasharma4518@gmail.com" ||
        lower === "adityarajsharma9070@gmail.com" ||
        lower === "devadmine1234@gmail.com" ||
        loadFakeAdmin()
      ) {
        setIsAdmin(true);
        return;
      }
      if (!uid) {
        if (!loadFakeAdmin()) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data || loadFakeAdmin());
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) {
        setSession(s);
        checkAdmin(s.user?.id, s.user?.email);
      } else {
        if (!loadFakeAdmin()) {
          setSession(null);
          setIsAdmin(false);
        }
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        checkAdmin(data.session.user?.id, data.session.user?.email);
      } else if (!loadFakeAdmin()) {
        setSession(null);
        setIsAdmin(false);
      }
      setLoading(false);
    }).catch(() => {
      if (!loadFakeAdmin()) {
        setLoading(false);
      }
    });

    window.addEventListener("fake_admin_login", loadFakeAdmin);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("fake_admin_login", loadFakeAdmin);
    };
  }, []);

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(FAKE_ADMIN_KEY);
    }
    setSession(null);
    setIsAdmin(false);
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, isAdmin, loading, signOut, loginAsAdmin }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
