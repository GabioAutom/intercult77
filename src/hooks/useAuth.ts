import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const AUTH_TIMEOUT_MS = 5000;

const withTimeout = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), AUTH_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async () => {
    try {
      return await withTimeout(
        (async () => {
          const { data, error } = await supabase.rpc("is_admin");

          if (error) throw error;

          return Boolean(data);
        })(),
        false,
      );
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async (currentUser: User | null) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      const admin = await checkAdmin();

      if (!isMounted) return;

      setIsAdmin(admin);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAuthState(session?.user ?? null);
    });

    void withTimeout(supabase.auth.getSession().catch(() => null), null)
      .then((result) => syncAuthState(result?.data.session?.user ?? null))
      .catch(() => {
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, isAdmin, loading, signIn, signUp, signOut };
};
