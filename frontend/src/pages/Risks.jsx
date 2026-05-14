import { useState } from "react";
import { Card, PanelHead, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { RISKS as DEMO_RISKS, UNITS, PROJECTS, CLIENTS } from "../data/demo.js";

export function RisksPage() {
  const [risks, setRisks] = useState(DEMO_RISKS);
  const [filter, setFilter] = useState("all");

  const filtered = risks.filter(r => filter === "all" || r.level === filter);
  const resolve = (id) => setRisks(prev => prev.filter(r => r.id !== id));

  return (
    <div className="p-5">
      <div className="mb-4">
        <Alert type="warning">
          AI risk monitor analyses payment patterns, WA sentiment, lease timelines, and vacancy duration. Resolve issues or dismiss false positives.
        </Alert>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [risks.filter(r=>r.level==="critical").length, "Critical", "#E02424","#FDF2F2","ti-alert-octagon"],
          [risks.filter(r=>r.level==="high").length,     "High",     "#B45309","#FFFBEB","ti-alert-circle" ],
          [risks.filter(r=>r.level==="medium").length,   "Medium",   "#6B7280","#F3F4F6","ti-alert-triangle"],
        ].map(([v,l,fg,bg,ic]) => (
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:bg }}>
                <i className={`ti ${ic} text-[14px]`} style={{ color:fg }} aria-hidden />
              </div>
              <span className="text-[12px] text-gray-400">{l}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {[["all","All"],["critical","Critical"],["high","High"],["medium","Medium"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>
              {l}
            </button>
          ))}
        </div>
        <span className="text-[13px] text-gray-400">{risks.length} active flags</span>
      </div>

      <Card>
        <PanelHead icon="ti-shield-exclamation" title="Active risk flags" sub={`${filtered.length} issues · click resolve to dismiss`} />
        <div className="px-4">
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <i className="ti ti-shield-check text-4xl text-emerald-300 mb-3" aria-hidden />
              <div className="text-[13px] text-gray-400">No risk flags — everything looks good.</div>
            </div>
          )}
          {filtered.map(r => {
            const unit    = r.unitId ? UNITS.find(u => u.id === r.unitId) : null;
            const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
            const client  = r.clientId ? CLIENTS.find(c => c.id === r.clientId) : null;
            return (
              <div key={r.id} className="flex items-start gap-4 py-4 border-b border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${r.level==="critical"?"bg-red-50":r.level==="high"?"bg-amber-50":"bg-gray-100"}`}>
                  <i className={`ti ${r.level==="critical"?"ti-alert-octagon":r.level==="high"?"ti-alert-circle":"ti-alert-triangle"} text-lg ${r.level==="critical"?"text-red-600":r.level==="high"?"text-amber-600":"text-gray-500"}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-gray-900">
                      {client?.name || project?.name || unit?.unitNo || r.unitId}
                    </span>
                    <Pill color={r.level==="critical"?"red":r.level==="high"?"amber":"gray"}>{r.level}</Pill>
                  </div>
                  <div className="text-[13px] text-gray-600 leading-relaxed">{r.reason}</div>
                  {unit && <div className="text-[11px] text-gray-400 mt-1">{project?.name} — Unit {unit.unitNo} · Floor {unit.floor}</div>}
                </div>
                <button onClick={() => resolve(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-[12px] font-medium hover:bg-gray-100 transition-colors shrink-0">
                  <i className="ti ti-check text-[13px]" aria-hidden /> Resolve
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}