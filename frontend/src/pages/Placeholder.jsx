export function PlaceholderPage({ title, icon }) {
  return (
    <div className="p-5 flex items-center justify-center" style={{ minHeight:400 }}>
      <div className="text-center">
        <i className={`ti ${icon} text-5xl text-gray-200 mb-4`} aria-hidden />
        <div className="text-[16px] font-semibold text-gray-600 mb-1">{title}</div>
        <div className="text-[13px] text-gray-400">Coming in the next build session.</div>
      </div>
    </div>
  );
}