import { NavLink } from "react-router-dom";
import { Avatar } from "../components/index.jsx";
import { useAuthStore } from "../store/authStore.js";
import { DEMO_USER } from "../data/demo.js";

const NAV = [
  { section: "Overview", items: [
    { to: "/", icon: "ti-layout-dashboard", label: "Dashboard" },
    { to: "/clients", icon: "ti-users", label: "Clients", badge: 3 },
  ]},
  { section: "Property", items: [
    { to: "/units", icon: "ti-building-estate", label: "Units" },
    { to: "/bookings", icon: "ti-calendar-event", label: "Bookings" },
    { to: "/leases", icon: "ti-file-text", label: "Leases" },
  ]},
  { section: "Finance", items: [
    { to: "/payments", icon: "ti-receipt-2", label: "Payments", badge: 2 },
    { to: "/forecast", icon: "ti-trending-up", label: "Forecast" },
  ]},
  { section: "AI Tools", items: [
    { to: "/whatsapp", icon: "ti-brand-whatsapp", label: "WA Summaries" },
    { to: "/nudges", icon: "ti-send", label: "Nudges", badge: 5 },
    { to: "/risks", icon: "ti-shield-exclamation", label: "Risk Monitor", badge: 3 },
    { to: "/docparser", icon: "ti-scan", label: "Doc Parser" },
  ]},
];

export function Sidebar() {
  const { logout } = useAuthStore();
  const user = DEMO_USER; // swap: useAuthStore(s => s.user)

  return (
    <aside className="w-52 min-w-52 bg-white border-r border-gray-200 flex flex-col font-sans">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
          <i className="ti ti-building-estate text-white text-base" aria-hidden />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-gray-900 tracking-tight">Propflow</div>
          <div className="text-[10px] text-gray-400 font-mono">Nyxion Labs</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-thin">
        {NAV.map((sec) => (
          <div key={sec.section}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pt-3 pb-1">
              {sec.section}
            </div>
            {sec.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] mb-0.5 transition-all duration-100 ${
                    isActive
                      ? "bg-blue-50 text-brand-500 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <i className={`ti ${item.icon} text-[15px] w-4 text-center`} aria-hidden />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-2 py-2.5 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Avatar name={user?.name || "User"} size={26} />
          <div className="flex-1 text-left min-w-0">
            <div className="text-[12px] font-medium text-gray-800 truncate">{user?.name}</div>
            <div className="text-[11px] text-gray-400">Admin · Sign out</div>
          </div>
          <i className="ti ti-logout text-gray-400 text-[14px]" aria-hidden />
        </button>
      </div>
    </aside>
  );
}
