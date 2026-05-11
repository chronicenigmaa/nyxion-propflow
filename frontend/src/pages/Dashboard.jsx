import { useNavigate } from "react-router-dom";
import { Card, PanelHead, Avatar, Pill } from "../components/index.jsx";
import { fmt, scoreColor } from "../lib/utils.js";
import { CLIENTS, UNITS, PROJECTS, PAYMENTS, NUDGES, RISKS, FORECAST } from "../data/demo.js";

function StatCard({ label, value, delta, deltaUp, color, icon }) {
  const colors = { blue:"#1C64F2", green:"#057A55", amber:"#B45309", red:"#E02424" };
  const bgs    = { blue:"#EBF5FF", green:"#F3FAF7", amber:"#FFFBEB", red:"#FDF2F2" };
  const fg = colors[color];
  const bg = bgs[color];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4" style={{ borderTop:`3px solid ${fg}` }}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:bg }}>
          <i className={`ti ${icon} text-base`} style={{ color:fg }} aria-hidden />
        </div>
        <span className="text-[12px] text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">{value}</div>
      <div className="flex items-center gap-1 mt-1 text-[12px] text-gray-400">
        <i className={`ti ${deltaUp?"ti-arrow-up-right":"ti-arrow-down-right"} text-[13px]`}
          style={{ color:deltaUp?"#057A55":"#E02424" }} aria-hidden />
        <span style={{ color:deltaUp?"#057A55":"#E02424" }}>{delta}</span>
        <span>&nbsp;vs last month</span>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();

  const leasedUnits  = UNITS.filter(u => u.status === "leased").length;
  const totalRevenue = UNITS.filter(u => u.status === "leased").reduce((a,u) => a + u.rent, 0);
  const overdueCount = PAYMENTS.filter(p => p.status === "overdue").length;
  const forecastMax  = Math.max(...FORECAST.map(f => f.projected));

  return (
    <div className="p-5 flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Active leases"      value={leasedUnits}       delta="+1"  deltaUp icon="ti-file-text"          color="blue"  />
        <StatCard label="Revenue this month" value={fmt(totalRevenue)} delta="+8%" deltaUp icon="ti-coin-rupee"         color="green" />
        <StatCard label="Overdue payments"   value={overdueCount}      delta="+2"          icon="ti-clock-exclamation"  color="amber" />
        <StatCard label="Risk flags"         value={RISKS.length}      delta="+1"          icon="ti-shield-exclamation" color="red"   />
      </div>

      {/* Client pipeline + right column */}
      <div className="grid gap-4" style={{ gridTemplateColumns:"1fr 288px" }}>
        <Card>
          <PanelHead icon="ti-users" title="Client pipeline" sub={`AI lead scored · ${CLIENTS.length} clients`}
            action="View all" onAction={() => navigate("/clients")} />
          <div className="px-4">
            {CLIENTS.map(cl => {
              const unit    = cl.unitId ? UNITS.find(u => u.id === cl.unitId) : null;
              const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
              const sc      = scoreColor(cl.score);
              return (
                <div key={cl.id} onClick={() => navigate("/clients")}
                  className="flex items-center gap-2.5 py-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-4 px-4 transition-colors">
                  <Avatar name={cl.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-900">{cl.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {project ? `${project.name} · Unit ${unit.unitNo}` : cl.city}
                    </div>
                  </div>
                  <div className="w-12 mr-2">
                    <div className="text-[11px] font-semibold font-mono mb-1" style={{ color:sc }}>{cl.score}</div>
                    <div className="h-[3px] bg-gray-100 rounded">
                      <div style={{ width:`${cl.score}%`, background:sc }} className="h-full rounded" />
                    </div>
                  </div>
                  <Pill color={cl.statusColor}>{cl.status}</Pill>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          {/* WA summaries */}
          <Card>
            <PanelHead icon="ti-brand-whatsapp" title="WA summaries" sub="AI analysed"
              action="All" onAction={() => navigate("/whatsapp")} />
            <div className="p-3 flex flex-col gap-2">
              {CLIENTS.filter(c => c.waSentiment).slice(0,3).map(cl => (
                <div key={cl.id} className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Avatar name={cl.name} size={20} />
                    <span className="text-[12px] font-medium text-gray-800">{cl.name}</span>
                    <Pill color={cl.waSentiment==="positive"?"green":cl.waSentiment==="negative"?"red":"gray"}>
                      {cl.waSentiment}
                    </Pill>
                  </div>
                  <div className="text-[12px] text-gray-600 leading-relaxed">{cl.waSummary.slice(0,80)}…</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Nudges */}
          <Card>
            <PanelHead icon="ti-send" title="Smart nudges" sub={`${NUDGES.length} pending`}
              action="All" onAction={() => navigate("/nudges")} />
            <div className="px-4">
              {NUDGES.slice(0,3).map(n => (
                <div key={n.id} className="flex gap-2.5 py-2 border-b border-gray-100">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${n.urgency==="critical"?"bg-red-50":n.urgency==="high"?"bg-amber-50":"bg-blue-50"}`}>
                    <i className={`ti ${n.icon} text-[13px] ${n.urgency==="critical"?"text-red-600":n.urgency==="high"?"text-amber-600":"text-brand-500"}`} aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] text-gray-700 leading-snug">
                      <strong className="text-gray-900">{n.client}</strong> — {n.msg}
                    </div>
                    <button className="text-[11px] text-brand-500 font-medium mt-0.5">{n.action} →</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Payments + Forecast */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <PanelHead icon="ti-receipt-2" title="Payment intelligence" sub="AI risk scored"
            action="View all" onAction={() => navigate("/payments")} />
          <div className="px-4">
            {PAYMENTS.map(p => {
              const client = CLIENTS.find(c => c.id === p.clientId);
              const unit   = UNITS.find(u => u.id === p.unitId);
              const project = unit ? PROJECTS.find(pr => pr.id === unit.projectId) : null;
              return (
                <div key={p.id} className="flex items-center gap-2.5 py-2.5 border-b border-gray-100">
                  <Avatar name={client?.name || "–"} size={30} />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-gray-900">{client?.name}</div>
                    <div className="text-[11px] text-gray-400">
                      {p.status==="overdue" ? `${p.daysLate} days overdue` : p.status==="paid" ? "Paid on time" : "Due "+p.due}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-semibold font-mono"
                      style={{ color:p.status==="overdue"?"#E02424":p.status==="paid"?"#057A55":"#374151" }}>
                      {fmt(p.amount)}
                    </div>
                    <Pill color={p.aiColor}>{p.aiLabel}</Pill>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <PanelHead icon="ti-trending-up" title="Revenue forecast" sub="AI projected · next 6 months"
            action="Full view" onAction={() => navigate("/financials")} />
          <div className="p-4">
            <div className="flex justify-between items-baseline mb-4">
              <div>
                <div className="text-xl font-bold font-mono text-emerald-600">
                  {fmt(FORECAST.reduce((a,f) => a + f.projected, 0))}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">projected 6-month total</div>
              </div>
              <Pill color="green">High confidence</Pill>
            </div>
            {FORECAST.map(f => (
              <div key={f.month} className="flex items-center gap-2.5 mb-2">
                <span className="text-[11px] text-gray-400 font-mono w-7">{f.month}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded">
                  <div style={{ width:`${(f.projected/forecastMax)*100}%` }} className="h-full bg-brand-500 rounded" />
                </div>
                <span className="text-[11px] font-mono font-medium text-gray-700 w-20 text-right">
                  {fmt(f.projected)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projects overview */}
      <Card>
        <PanelHead icon="ti-building" title="Projects overview" sub={`${PROJECTS.length} buildings`}
          action="View all" onAction={() => navigate("/projects")} />
        <div className="grid grid-cols-5 gap-0">
          {PROJECTS.map((p, i) => {
            const units    = UNITS.filter(u => u.projectId === p.id);
            const leased   = units.filter(u => u.status === "leased").length;
            const occupancy = units.length ? Math.round((leased/units.length)*100) : 0;
            const revenue  = units.filter(u => u.status === "leased").reduce((a,u) => a+u.rent, 0);
            return (
              <div key={p.id} onClick={() => navigate("/projects")}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${i < PROJECTS.length-1 ? "border-r border-gray-100" : ""}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background:p.color }} />
                  <div className="text-[12px] font-medium text-gray-800 truncate">{p.name.split(" ").slice(0,2).join(" ")}</div>
                </div>
                <div className="text-[11px] text-gray-400 mb-2">{p.city} · {p.floors} floors</div>
                <div className="h-1.5 bg-gray-100 rounded mb-1.5">
                  <div className="h-full rounded" style={{ width:`${occupancy}%`, background:p.color }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] font-semibold" style={{ color:p.color }}>{occupancy}% full</span>
                  <span className="text-[11px] text-gray-400">{leased}/{units.length}</span>
                </div>
                <div className="text-[11px] font-mono font-semibold text-gray-700 mt-1">{fmt(revenue)}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Risk monitor */}
      <Card>
        <PanelHead icon="ti-shield-exclamation" title="Risk monitor" sub="AI flagged · requires attention"
          action="View all" onAction={() => navigate("/risks")} />
        <div className="px-4">
          {RISKS.map(r => {
            const unit    = r.unitId ? UNITS.find(u => u.id === r.unitId) : null;
            const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
            return (
              <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                <i className={`ti ${r.level==="critical"?"ti-alert-octagon":r.level==="high"?"ti-alert-circle":"ti-alert-triangle"} text-lg shrink-0`}
                  style={{ color:r.level==="critical"?"#E02424":r.level==="high"?"#B45309":"#9CA3AF" }} aria-hidden />
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-gray-900">
                    {r.client !== "–" ? r.client : project?.name || r.unitId}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{r.reason}</div>
                </div>
                <Pill color={r.level==="critical"?"red":r.level==="high"?"amber":"gray"}>{r.level}</Pill>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}