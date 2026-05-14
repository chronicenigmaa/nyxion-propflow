import { useState } from "react";
import { Card, PanelHead, Avatar, Pill } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { NUDGES as DEMO_NUDGES, CLIENTS } from "../data/demo.js";

export function NudgesPage() {
  const [nudges, setNudges] = useState(DEMO_NUDGES);
  const [filter, setFilter] = useState("all");

  const filtered = nudges.filter(n => filter === "all" || n.urgency === filter);
  const done = (id) => setNudges(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [nudges.filter(n=>n.urgency==="critical").length, "Critical", "#E02424","#FDF2F2","ti-alert-octagon"   ],
          [nudges.filter(n=>n.urgency==="high").length,     "High",     "#B45309","#FFFBEB","ti-alert-circle"    ],
          [nudges.filter(n=>n.urgency==="medium").length,   "Medium",   "#1C64F2","#EBF5FF","ti-info-circle"     ],
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
        <span className="text-[13px] text-gray-400">{nudges.length} pending</span>
      </div>

      <Card>
        <PanelHead icon="ti-send" title="Smart follow-up nudges" sub="AI generated based on client behaviour" />
        <div className="px-4">
          {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">All clear — no pending nudges.</div>}
          {filtered.map(n => {
            const client = CLIENTS.find(c => c.id === n.clientId);
            return (
              <div key={n.id} className="flex gap-4 py-4 border-b border-gray-100 items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.urgency==="critical"?"bg-red-50":n.urgency==="high"?"bg-amber-50":"bg-blue-50"}`}>
                  <i className={`ti ${n.icon} text-lg ${n.urgency==="critical"?"text-red-600":n.urgency==="high"?"text-amber-600":"text-brand-500"}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {client && <Avatar name={client.name} size={22} />}
                    <span className="text-[14px] font-semibold text-gray-900">{n.client}</span>
                    <Pill color={n.urgency==="critical"?"red":n.urgency==="high"?"amber":"blue"}>{n.urgency}</Pill>
                  </div>
                  <div className="text-[13px] text-gray-600 leading-relaxed">{n.msg}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" icon="ti-arrow-right">{n.action}</Button>
                  <button onClick={() => done(n.id)}
                    className="flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    title="Mark done">
                    <i className="ti ti-check text-[14px]" aria-hidden />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}