import { useState } from "react";

export function Input({
  label, type = "text", value, onChange, placeholder,
  error, icon, disabled, autoFocus, onKeyDown, hint,
}) {
  const [show, setShow] = useState(false);
  const t = type === "password" ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[13px] font-medium text-gray-700">{label}</label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <i className={`ti ${icon} absolute left-3 text-gray-400 text-[15px] pointer-events-none`} aria-hidden />
        )}
        <input
          type={t}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          className={`
            w-full h-10 rounded-lg border text-sm text-gray-900 bg-white
            placeholder:text-gray-400 outline-none transition-all duration-150
            focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50
            ${icon ? "pl-9" : "pl-3"}
            ${type === "password" ? "pr-10" : "pr-3"}
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-brand-500"}
          `}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <i className={`ti ${show ? "ti-eye-off" : "ti-eye"} text-[15px]`} aria-hidden />
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );
}
