import { Card, PanelHead, Pill } from "../components/index.jsx";
import { fmt } from "../lib/utils.js";
import { PROJECTS, UNITS, CLIENTS, PAYMENTS, PROJECT_REVENUE, FORECAST } from "../data/demo.js";

export function FinancialsPage() {
  const totalCollected = PAYMENTS.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const totalOverdue   = PAYMENTS.filter(p=>p.status==="overdue").reduce((a,p)=>a+p.amount,0);
  const totalUpcoming  = PAYMENTS.filter(p=>p.status==="upcoming").reduce((a,p)=>a+(p.amount||0),0);
  const totalRevenue   = UNITS.filter(u=>u.status==="leased").reduce((a,u)=>a+u.rent,0);
  const maxProjectRev  = Math.max(...PROJECT_REVENUE.map(r=>r.collected));
  const forecastMax    = Math.max(...FORECAST.map(f=>f.projected));

  return (
    <div className="p-5 flex flex-col gap-4">

      <div className="grid grid-cols-4 gap-3">
        {[
          [fmt(totalRevenue),   "Monthly potential",   "#1C64F2","#EBF5FF","ti-trending-up"      ],
          [fmt(totalCollected), "Collected this month", "#057A55","#F3FAF7","ti-circle-check"     ],
          [fmt(totalOverdue),   "Overdue",              "#E02424","#FDF2F2","ti-clock-exclamation" ],
          [fmt(totalUpcoming),  "Due soon",             "#B45309","#FFFBEB","ti-calendar-time"    ],
        ].map(([v,l,fg,bg,ic])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm" style={{ borderTop:`3px solid ${fg}` }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:bg }}>
                <i className={`ti ${ic} text-base`} style={{ color:fg }} aria-hidden />
              </div>
              <span className="text-[12px] text-gray-500 font-medium">{l}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <PanelHead icon="ti-building" title="Revenue by project" sub="Collected this month" />
          <div className="p-4 flex flex-col gap-4">
            {PROJECT_REVENUE.map(rev => {
              const project = PROJECTS.find(p => p.id === rev.projectId);
              if (!project) return null;
              return (
                <div key={rev.projectId}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background:project.color }} />
                      <span className="text-[13px] font-medium text-gray-800">{project.name}</span>
                    </div>
                    <span className="text-[13px] font-semibold font-mono text-gray-900">{fmt(rev.collected)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${Math.min((rev.collected/maxProjectRev)*100,100)}%`, background:project.color }} />
                    </div>
                    <span className="text-[11px] text-gray-400 w-8 text-right">{Math.round((rev.collected/totalRevenue)*100)}%</span>
                  </div>
                  <div className="flex gap-3 mt-1.5">
                    {rev.overdue  > 0 && <span className="text-[11px] text-red-500 font-medium">{fmt(rev.overdue)} overdue</span>}
                    {rev.upcoming > 0 && <span className="text-[11px] text-blue-500 font-medium">{fmt(rev.upcoming)} upcoming</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <PanelHead icon="ti-trending-up" title="Revenue forecast" sub="AI projected · next 6 months" />
          <div className="p-4">
            <div className="flex justify-between items-baseline mb-5">
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-600">{fmt(FORECAST.reduce((a,f)=>a+f.projected,0))}</div>
                <div className="text-[11px] text-gray-400 mt-1">projected 6-month total</div>
              </div>
              <Pill color="green">High confidence</Pill>
            </div>
            {FORECAST.map(f => (
              <div key={f.month} className="flex items-center gap-3 mb-3">
                <span className="text-[11px] text-gray-400 font-mono w-8">{f.month}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <div style={{ width:`${(f.projected/forecastMax)*100}%`, background:"#1C64F2" }} className="h-full rounded-full" />
                </div>
                <span className="text-[12px] font-mono font-semibold text-gray-700 w-20 text-right">{fmt(f.projected)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <PanelHead icon="ti-alert-circle" title="Overdue payments" sub="Requires immediate attention" />
        <div className="px-4">
          {PAYMENTS.filter(p=>p.status==="overdue").length === 0 ? (
            <div className="py-8 text-center text-[13px] text-gray-400">No overdue payments.</div>
          ) : (
            PAYMENTS.filter(p=>p.status==="overdue").map(p => {
              const unit    = UNITS.find(u=>u.id===p.unitId);
              const project = unit ? PROJECTS.find(pr=>pr.id===unit.projectId) : null;
              const client  = CLIENTS.find(c=>c.id===p.clientId);
              return (
                <div key={p.id} className="flex items-center gap-4 py-3.5 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <i className="ti ti-clock-exclamation text-red-500 text-lg" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-gray-900">{client?.name} — {project?.name}</div>
                    <div className="text-[12px] text-gray-400 mt-0.5">Unit {unit?.unitNo} · {p.daysLate} days overdue · due {p.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-bold font-mono text-red-500">{fmt(p.amount)}</div>
                    <Pill color="red">{p.aiLabel}</Pill>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card>
        <PanelHead icon="ti-home" title="Occupancy overview" sub="Leased vs vacant by project" />
        <div className="p-4">
          <div className="grid grid-cols-5 gap-3">
            {PROJECTS.map(project => {
              const units   = UNITS.filter(u => u.projectId === project.id);
              const leased  = units.filter(u => u.status === "leased").length;
              const vacant  = units.filter(u => u.status === "vacant").length;
              const pct     = units.length ? Math.round((leased/units.length)*100) : 0;
              return (
                <div key={project.id} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-medium mb-2 leading-tight">{project.name.split(" ").slice(0,2).join(" ")}</div>
                  <div className="relative w-14 h-14 mx-auto mb-2">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke={project.color} strokeWidth="4"
                        strokeDasharray={`${pct * 0.88} 88`} strokeLinecap="round" />
                    </svg>
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span className="text-[12px] font-bold font-mono text-gray-800">{pct}%</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium">{leased} leased</div>
                  {vacant > 0 && <div className="text-[11px] text-amber-500 font-medium">{vacant} vacant</div>}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}