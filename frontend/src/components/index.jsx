import { avatarColor, initials } from "../lib/utils.js";

export function Avatar({ name, size = 32 }) {
  const [bg, fg] = avatarColor(name);
  return (
    <div style={{ width:size, height:size, background:bg, color:fg, fontSize:size*0.33, flexShrink:0 }}
      className="rounded-full flex items-center justify-center font-semibold border border-white/60">
      {initials(name)}
    </div>
  );
}

const PILL_STYLES = {
  green:  "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  blue:   "bg-blue-100   text-blue-800   ring-1 ring-blue-200",
  amber:  "bg-amber-100  text-amber-800  ring-1 ring-amber-200",
  red:    "bg-red-100    text-red-800    ring-1 ring-red-200",
  purple: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
  gray:   "bg-gray-100   text-gray-600   ring-1 ring-gray-200",
};

export function Pill({ children, color = "blue" }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${PILL_STYLES[color] || PILL_STYLES.blue}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

const ALERT_STYLES = {
  info:    { wrap:"bg-blue-50  border border-blue-200  text-blue-800",   icon:"ti-info-circle"    },
  success: { wrap:"bg-emerald-50 border border-emerald-200 text-emerald-800", icon:"ti-circle-check" },
  error:   { wrap:"bg-red-50   border border-red-200   text-red-700",    icon:"ti-alert-circle"   },
  warning: { wrap:"bg-amber-50 border border-amber-200 text-amber-800",  icon:"ti-alert-triangle" },
};

export function Alert({ type = "info", children }) {
  const s = ALERT_STYLES[type];
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium ${s.wrap}`}>
      <i className={`ti ${s.icon} text-[15px] mt-0.5 shrink-0`} aria-hidden />
      <span>{children}</span>
    </div>
  );
}

export function PanelHead({ icon, title, sub, action, onAction }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
      {icon && (
        <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
          <i className={`ti ${icon} text-gray-500 text-[13px]`} aria-hidden />
        </div>
      )}
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-gray-900">{title}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction}
          className="text-[12px] text-brand-500 font-medium hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
          {action} →
        </button>
      )}
    </div>
  );
}