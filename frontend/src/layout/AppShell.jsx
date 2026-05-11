import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar }  from "./Topbar.jsx";

const PAGE_META = {
  "/":           ["Dashboard",       "Karachi, Pakistan"],
  "/clients":    ["Clients",         "AI lead scored · 8 clients"],
  "/projects":   ["Projects",        "5 buildings · 20 units tracked"],
  "/units":      ["Units",           "20 units · 15 leased · 5 vacant"],
  "/bookings":   ["Bookings",        "Viewings, signings, and inspections"],
  "/leases":     ["Leases",          "Active lease agreements"],
  "/payments":   ["Payments",        "AI payment intelligence · May 2025"],
  "/financials": ["Financials",      "Revenue by project · AI forecast"],
  "/whatsapp":   ["WA Summaries",    "AI analysed · Roman Urdu supported"],
  "/nudges":     ["Smart nudges",    "AI follow-up recommendations"],
  "/risks":      ["Risk monitor",    "AI flagged issues"],
  "/docparser":  ["Document parser", "AI OCR and field extraction"],
};

export function AppShell() {
  const { pathname } = useLocation();
  const [title, sub] = PAGE_META[pathname] || ["Propflow", ""];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={title} sub={sub} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}