export function Button({
  children, onClick, variant = "primary", size = "md",
  loading, disabled, fullWidth, icon, type = "button", className = "",
}) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-[15px]",
  };

  const variants = {
    primary:   "bg-brand-500 text-white hover:bg-brand-600 border border-transparent",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    ghost:     "bg-transparent text-brand-500 border border-blue-200 hover:bg-blue-50",
    danger:    "bg-red-600 text-white border border-transparent hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading
        ? <i className="ti ti-loader-2 text-base animate-spin" aria-hidden />
        : icon && <i className={`ti ${icon} text-[15px]`} aria-hidden />}
      {children}
    </button>
  );
}
