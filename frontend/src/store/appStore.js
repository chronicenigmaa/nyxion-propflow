import { create } from "zustand";
import {
  CLIENTS,
  UNITS,
  LEASES,
  BOOKINGS,
  PAYMENTS,
} from "../data/demo.js";

export const useAppStore = create((set, get) => ({
  clients:  [...CLIENTS],
  units:    [...UNITS],
  leases:   [...LEASES],
  bookings: [...BOOKINGS],
  payments: [...PAYMENTS],

  // ── Clients ──────────────────────────────────────────────────────────────
  addClient: (client) =>
    set(s => ({ clients: [client, ...s.clients] })),

  updateClient: (id, fields) =>
    set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...fields } : c) })),

  removeClient: (id) =>
    set(s => ({ clients: s.clients.filter(c => c.id !== id) })),

  // ── Units ─────────────────────────────────────────────────────────────────
  addUnit: (unit) =>
    set(s => ({ units: [...s.units, unit] })),

  updateUnit: (id, fields) =>
    set(s => ({ units: s.units.map(u => u.id === id ? { ...u, ...fields } : u) })),

  assignClientToUnit: (unitId, clientId, rentAmount) =>
    set(s => ({
      units:   s.units.map(u   => u.id === unitId   ? { ...u, status:"leased", rent:rentAmount||u.rent } : u),
      clients: s.clients.map(c => c.id === clientId ? { ...c, unitId, rentAmount } : c),
    })),

  // ── Leases ────────────────────────────────────────────────────────────────
  addLease: (lease) =>
    set(s => ({ leases: [lease, ...s.leases] })),

  updateLease: (id, fields) =>
    set(s => ({ leases: s.leases.map(l => l.id === id ? { ...l, ...fields } : l) })),

  // ── Bookings ──────────────────────────────────────────────────────────────
  addBooking: (booking) =>
    set(s => ({ bookings: [booking, ...s.bookings] })),

  updateBooking: (id, fields) =>
    set(s => ({ bookings: s.bookings.map(b => b.id === id ? { ...b, ...fields } : b) })),

  // ── Payments ──────────────────────────────────────────────────────────────
  addPayment: (payment) =>
    set(s => ({ payments: [payment, ...s.payments] })),

  markPaymentPaid: (id, paidDate) =>
    set(s => ({
      payments: s.payments.map(p => p.id === id
        ? { ...p, status:"paid", paid:paidDate, daysLate:0, aiLabel:"On time", aiColor:"green" }
        : p
      ),
    })),

  removePayment: (id) =>
    set(s => ({ payments: s.payments.filter(p => p.id !== id) })),

  updatePayment: (id, fields) =>
    set(s => ({ payments: s.payments.map(p => p.id === id ? { ...p, ...fields } : p) })),
}));