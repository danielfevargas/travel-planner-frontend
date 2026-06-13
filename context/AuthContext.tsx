"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isModalOpen: boolean;
  modalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register", afterAuthCallback?: () => void) => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isModalOpen: false,
  modalTab: "login",
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"login" | "register">("login");
  const afterAuthRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = (
    tab: "login" | "register" = "login",
    afterAuthCallback?: () => void
  ) => {
    setModalTab(tab);
    setIsModalOpen(true);
    if (afterAuthCallback) {
      afterAuthRef.current = afterAuthCallback;
    }
  };

  const closeAuthModal = () => {
    setIsModalOpen(false);
    afterAuthRef.current = null;
  };

  const runPendingCallback = () => {
    if (afterAuthRef.current) {
      afterAuthRef.current();
      afterAuthRef.current = null;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      setIsModalOpen(false);
      runPendingCallback();
    }
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return { error: error.message };

    const needsConfirmation = !data.session;
    if (!needsConfirmation) {
      setIsModalOpen(false);
      runPendingCallback();
    }
    return { error: null, needsConfirmation };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isModalOpen,
        modalTab,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
