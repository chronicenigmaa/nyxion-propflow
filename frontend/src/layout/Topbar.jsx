import { Button } from "../components/Button.jsx";

export function Topbar({ title, sub }) {
  return (
    <header className="h-[52px] bg-white border-b border-gray-200 flex items-center gap-3 px-5 shrink-0">
      <div className="flex-1">
        <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</h1>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>

      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-48">
        <i className="ti ti-search text-gray-400 text-[14px]" aria-hidden />
        <input
          placeholder="Search clients, units…"
          className="bg-transparent border-none outline-none text-[12px] text-gray-700 placeholder:text-gray-400 w-full"
        />
      </div>

      <div className="relative w-[34px] h-[34px] rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
        <i className="ti ti-bell text-gray-600 text-base" aria-hidden />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
      </div>

      <Button size="sm" icon="ti-plus">Add client</Button>
    </header>
  );
}
