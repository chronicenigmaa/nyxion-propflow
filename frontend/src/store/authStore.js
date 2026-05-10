import { create } from "zustand";
import { supabase } from "../lib/supabase.js";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  // Called once on app mount — restores session from Supabase
  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, user: data.session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
