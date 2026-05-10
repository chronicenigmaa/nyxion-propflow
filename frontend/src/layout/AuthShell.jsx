export function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 font-sans">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 bg-brand-500 rounded-[9px] flex items-center justify-center">
              <i className="ti ti-building-estate text-white text-lg" aria-hidden />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">Propflow</span>
          </div>
          <div className="text-[11px] text-gray-400 font-mono tracking-wider">by Nyxion Labs</div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {children}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          &copy; 2025 Nyxion Labs &nbsp;&middot;&nbsp;
          <span className="text-brand-500 cursor-pointer hover:underline">Privacy Policy</span>
          &nbsp;&middot;&nbsp;
          <span className="text-brand-500 cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}
