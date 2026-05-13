import { Button } from "../components/Button.jsx";

export function Topbar({ title, sub }) {
  return (
    <header className="h-[54px] bg-white border-b border-gray-200 shadow-sm flex items-center gap-3 px-5 shrink-0">
      <div className="flex-1">
        <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</h1>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>

      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-52">
        <i className="ti ti-search text-gray-400 text-[13px]" aria-hidden />
        <input placeholder="Search clients, units…"
          className="bg-transparent border-none outline-none text-[12px] text-gray-700 placeholder:text-gray-400 w-full" />
      </div>

      <div className="relative w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
        <i className="ti ti-bell text-gray-600 text-[15px]" aria-hidden />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </div>

      <Button size="sm" icon="ti-plus">Add client</Button>
    </header>
  );
}