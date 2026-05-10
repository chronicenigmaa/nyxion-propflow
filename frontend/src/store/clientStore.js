import { create } from "zustand";
import { api } from "../lib/api.js";
import { CLIENTS } from "../data/demo.js"; // swap out once backend is live

export const useClientStore = create((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: swap to real API once Railway backend is running
      // const clients = await api.get("/api/clients");
      const clients = CLIENTS; // demo data
      set({ clients, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getById: (id) => get().clients.find((c) => c.id === id),

  add: async (data) => {
    const client = await api.post("/api/clients", data);
    set((s) => ({ clients: [client, ...s.clients] }));
    return client;
  },

  update: async (id, data) => {
    const updated = await api.patch(`/api/clients/${id}`, data);
    set((s) => ({ clients: s.clients.map((c) => (c.id === id ? updated : c)) }));
    return updated;
  },

  remove: async (id) => {
    await api.delete(`/api/clients/${id}`);
    set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
  },
}));
