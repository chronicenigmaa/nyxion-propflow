import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";

const PAGE_META = {
  "/":          ["Dashboard",          "Sunday, 11 May 2025 · Karachi, Pakistan"],
  "/clients":   ["Clients",            "8 clients · AI lead scored"],
  "/units":     ["Units",              "8 units · 6 leased · 2 vacant"],
  "/bookings":  ["Bookings",           "Upcoming and confirmed bookings"],
  "/leases":    ["Leases",             "Active lease agreements"],
  "/payments":  ["Payments",           "AI payment intelligence · May 2025"],
  "/forecast":  ["Revenue forecast",   "AI projected · next 6 months"],
  "/whatsapp":  ["WhatsApp summaries", "AI analysed conversations"],
  "/nudges":    ["Smart nudges",       "AI follow-up recommendations"],
  "/risks":     ["Risk monitor",       "AI flagged issues"],
  "/docparser": ["Document parser",    "AI OCR and field extraction"],
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
