import { avatarColor, initials } from "../lib/utils.js";

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 32 }) {
  const [bg, fg] = avatarColor(name);
  const fontSize = size * 0.33;
  return (
    <div
      style={{ width: size, height: size, background: bg, color: fg, fontSize, flexShrink: 0 }}
      className="rounded-full flex items-center justify-center font-semibold"
    >
      {initials(name)}
    </div>
  );
}

// ── Pill / badge ──────────────────────────────────────────────────────────────
const PILL_STYLES = {
  green:  "bg-emerald-50  text-emerald-800",
  blue:   "bg-blue-50    text-blue-800",
  amber:  "bg-amber-50   text-amber-800",
  red:    "bg-red-50     text-red-800",
  purple: "bg-purple-50  text-purple-800",
  gray:   "bg-gray-100   text-gray-600",
};

export function Pill({ children, color = "blue" }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${PILL_STYLES[color] || PILL_STYLES.blue}`}>
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
const ALERT_STYLES = {
  info:    { wrap: "bg-blue-50  text-blue-800",  icon: "ti-info-circle" },
  success: { wrap: "bg-emerald-50 text-emerald-800", icon: "ti-circle-check" },
  error:   { wrap: "bg-red-50   text-red-700",   icon: "ti-alert-circle" },
  warning: { wrap: "bg-amber-50 text-amber-800", icon: "ti-alert-triangle" },
};

export function Alert({ type = "info", children }) {
  const s = ALERT_STYLES[type];
  return (
    <div className={`flex items-start gap-2 px-3.5 py-2.5 rounded-lg text-[13px] ${s.wrap}`}>
      <i className={`ti ${s.icon} text-[15px] mt-0.5 shrink-0`} aria-hidden />
      <span>{children}</span>
    </div>
  );
}

// ── Panel header ──────────────────────────────────────────────────────────────
export function PanelHead({ icon, title, sub, action, onAction }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
      {icon && <i className={`ti ${icon} text-gray-400 text-[15px]`} aria-hidden />}
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-gray-900">{title}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} className="text-xs text-brand-500 font-medium hover:underline">
          {action} →
        </button>
      )}
    </div>
  );
}
