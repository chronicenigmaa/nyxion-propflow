import { useState } from "react";
import { Card, PanelHead, Avatar, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { fmt, scoreColor } from "../lib/utils.js";
import { CLIENTS, UNITS, PROJECTS, NUDGES, RISKS } from "../data/demo.js";

export function ClientsPage() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = CLIENTS.filter(c => {
    const q      = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchF = filter==="all" || (filter==="hot"&&c.score>=75) || (filter==="risk"&&c.score<40) || (filter==="active"&&c.paymentStatus==="paid");
    return matchQ && matchF;
  });

  if (selected) {
    const cl      = CLIENTS.find(c => c.id === selected);
    const unit    = cl.unitId ? UNITS.find(u => u.id === cl.unitId) : null;
    const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
    const sc      = scoreColor(cl.score);
    return (
      <div className="p-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-4 hover:text-gray-700">
          <i className="ti ti-arrow-left text-[15px]" aria-hidden /> Back to clients
        </button>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="p-5">
              <div className="flex gap-3.5 mb-5">
                <Avatar name={cl.name} size={52} />
                <div>
                  <div className="text-lg font-semibold text-gray-900">{cl.name}</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">{cl.email}</div>
                  <div className="mt-2"><Pill color={cl.statusColor}>{cl.status}</Pill></div>
                </div>
              </div>
              {[
                ["Phone",   cl.phone,                                        "ti-phone"     ],
                ["CNIC",    cl.cnic,                                         "ti-id"        ],
                ["City",    cl.city,                                         "ti-map-pin"   ],
                ["Project", project?.name || "No unit assigned",             "ti-building"  ],
                ["Unit",    unit ? `Unit ${unit.unitNo} · Floor ${unit.floor}` : "–", "ti-home"],
                ["Rent",    cl.rentAmount ? fmt(cl.rentAmount) : "–",        "ti-coin-rupee"],
              ].map(([k,v,ic]) => (
                <div key={k} className="flex items-center gap-2.5 py-2 border-b border-gray-100">
                  <i className={`ti ${ic} text-gray-400 text-[14px] w-4 shrink-0`} aria-hidden />
                  <span className="text-[12px] text-gray-400 w-20">{k}</span>
                  <span className="text-[13px] text-gray-800 font-medium">{v}</span>
                </div>
              ))}
              {cl.notes && <div className="mt-3 text-[12px] text-gray-400 italic leading-relaxed">{cl.notes}</div>}
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Card>
              <div className="p-4">
                <div className="text-[13px] font-semibold text-gray-700 mb-2.5">AI lead score</div>
                <div className="text-4xl font-bold font-mono" style={{ color:sc }}>{cl.score}<span className="text-base text-gray-400 font-normal">/100</span></div>
                <div className="h-1.5 bg-gray-100 rounded my-2.5"><div style={{ width:`${cl.score}%`, background:sc }} className="h-full rounded" /></div>
                <div className="text-[12px] text-gray-400">Based on payment history, WA sentiment, and response rate.</div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="text-[13px] font-semibold text-gray-700 mb-2.5">WhatsApp AI summary</div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">English</div>
                <div className="text-[13px] text-gray-600 leading-relaxed mb-2.5">{cl.waSummary}</div>
                {cl.waSummaryUrdu && (
                  <div className="bg-gray-50 rounded-lg p-2.5 mb-2.5">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Roman Urdu</div>
                    <div className="text-[13px] text-gray-600 leading-relaxed">{cl.waSummaryUrdu}</div>
                  </div>
                )}
                <div className="flex gap-1.5 flex-wrap">
                  {cl.waTags.map(t => <Pill key={t} color={cl.waSentiment==="positive"?"green":"amber"}>{t}</Pill>)}
                </div>
              </div>
            </Card>

            {cl.nextNudge && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex gap-2">
                <i className="ti ti-send text-brand-500 text-[15px] mt-0.5 shrink-0" aria-hidden />
                <div>
                  <div className="text-[12px] font-semibold text-blue-800 mb-0.5">Smart nudge</div>
                  <div className="text-[13px] text-blue-700">{cl.nextNudge}</div>
                </div>
              </div>
            )}

            {cl.riskFlags.length > 0 && (
              <Card>
                <div className="p-4">
                  <div className="text-[13px] font-semibold text-gray-700 mb-2">Risk flags</div>
                  {cl.riskFlags.map(f => (
                    <div key={f} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                      <i className="ti ti-alert-circle text-red-500 text-[14px]" aria-hidden />
                      <span className="text-[12px] text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex gap-1.5">
          {[["all","All"],["hot","Hot leads"],["active","Active"],["risk","At risk"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-52">
          <i className="ti ti-search text-gray-400 text-[14px]" aria-hidden />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
            className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-full" />
        </div>
        <Button size="sm" icon="ti-plus">Add client</Button>
      </div>

      <Card>
        <div className="grid px-4 py-2.5 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
          style={{ gridTemplateColumns:"2fr 2fr 1fr 80px 110px 40px" }}>
          <span>Client</span><span>Project / unit</span><span>Payment</span><span>Score</span><span>Status</span><span></span>
        </div>
        {filtered.map(cl => {
          const unit    = cl.unitId ? UNITS.find(u => u.id === cl.unitId) : null;
          const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
          const sc      = scoreColor(cl.score);
          return (
            <div key={cl.id} onClick={() => setSelected(cl.id)}
              className="grid items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns:"2fr 2fr 1fr 80px 110px 40px" }}>
              <div className="flex items-center gap-2.5">
                <Avatar name={cl.name} size={32} />
                <div>
                  <div className="text-[13px] font-medium text-gray-900">{cl.name}</div>
                  <div className="text-[11px] text-gray-400">{cl.email}</div>
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-700">{project?.name || "No unit"}</div>
                <div className="text-[11px] text-gray-400">{unit ? `Unit ${unit.unitNo} · Floor ${unit.floor}` : cl.city}</div>
              </div>
              <Pill color={cl.paymentStatus==="paid"?"green":cl.paymentStatus==="overdue"?"red":cl.paymentStatus==="upcoming"?"blue":"gray"}>
                {cl.paymentStatus==="paid"?"Paid":cl.paymentStatus==="overdue"?"Overdue":cl.paymentStatus==="upcoming"?"Upcoming":"Prospect"}
              </Pill>
              <div>
                <div className="text-[12px] font-semibold font-mono" style={{ color:sc }}>{cl.score}</div>
                <div className="h-[3px] bg-gray-100 rounded mt-1 w-10"><div style={{ width:`${cl.score}%`, background:sc }} className="h-full rounded" /></div>
              </div>
              <Pill color={cl.statusColor}>{cl.status}</Pill>
              <i className="ti ti-chevron-right text-gray-300 text-[15px]" aria-hidden />
            </div>
          );
        })}
        {filtered.length === 0 && <div className="py-10 text-center text-[13px] text-gray-400">No clients match your search.</div>}
      </Card>
    </div>
  );
}

export function PaymentsPage() {
  const { PAYMENTS } = require("../data/demo.js");
  const paid     = PAYMENTS.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const overdue  = PAYMENTS.filter(p=>p.status==="overdue").reduce((a,p)=>a+p.amount,0);
  const upcoming = PAYMENTS.filter(p=>p.status==="upcoming").reduce((a,p)=>a+(p.amount||0),0);
  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[[fmt(paid),"Collected","#057A55","#F3FAF7","ti-circle-check"],[fmt(overdue),"Overdue","#E02424","#FDF2F2","ti-clock-exclamation"],[fmt(upcoming),"Due soon","#1C64F2","#EBF5FF","ti-calendar-time"]].map(([v,l,fg,bg,ic])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:bg }}>
                <i className={`ti ${ic} text-[14px]`} style={{ color:fg }} aria-hidden />
              </div>
              <span className="text-[12px] text-gray-500">{l}</span>
            </div>
            <div className="text-xl font-bold font-mono" style={{ color:fg }}>{v}</div>
          </div>
        ))}
      </div>
      <Card>
        <PanelHead icon="ti-receipt-2" title="All payments" sub="AI risk scored · May 2025" />
        <div className="grid px-4 py-2.5 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
          style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 110px" }}>
          <span>Client</span><span>Unit</span><span>Amount</span><span>Date</span><span>AI label</span>
        </div>
        {PAYMENTS.map(p => {
          const unit    = UNITS.find(u => u.id === p.unitId);
          const project = unit ? PROJECTS.find(pr => pr.id === unit.projectId) : null;
          const client  = CLIENTS.find(c => c.id === p.clientId);
          return (
            <div key={p.id} className="grid items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 110px" }}>
              <div className="flex items-center gap-2.5">
                <Avatar name={client?.name||"–"} size={30} />
                <div>
                  <div className="text-[13px] font-medium text-gray-900">{client?.name}</div>
                  {p.status==="overdue" && <div className="text-[11px] text-red-500">{p.daysLate} days overdue</div>}
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-700">{project?.name||"–"}</div>
                <div className="text-[11px] text-gray-400">{unit?`Unit ${unit.unitNo}`:"–"}</div>
              </div>
              <div className="text-[13px] font-semibold font-mono" style={{ color:p.status==="overdue"?"#E02424":p.status==="paid"?"#057A55":"#374151" }}>{fmt(p.amount)}</div>
              <div className="text-[12px] text-gray-400">{p.paid||p.due||"–"}</div>
              <Pill color={p.aiColor}>{p.aiLabel}</Pill>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

export function NudgesPage() {
  return (
    <div className="p-5">
      <Card>
        <PanelHead icon="ti-send" title="Smart follow-up nudges" sub={`${NUDGES.length} pending · AI generated`} />
        <div className="px-4">
          {NUDGES.map(n => (
            <div key={n.id} className="flex gap-3.5 py-4 border-b border-gray-100 items-start">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.urgency==="critical"?"bg-red-50":n.urgency==="high"?"bg-amber-50":"bg-blue-50"}`}>
                <i className={`ti ${n.icon} text-lg ${n.urgency==="critical"?"text-red-600":n.urgency==="high"?"text-amber-600":"text-brand-500"}`} aria-hidden />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] font-medium text-gray-900">{n.client}</span>
                  <Pill color={n.urgency==="critical"?"red":n.urgency==="high"?"amber":"blue"}>{n.urgency}</Pill>
                </div>
                <div className="text-[13px] text-gray-600 leading-relaxed">{n.msg}</div>
              </div>
              <Button variant="ghost" size="sm" icon="ti-arrow-right">{n.action}</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function RisksPage() {
  return (
    <div className="p-5">
      <div className="mb-4">
        <Alert type="warning">AI risk monitor analyses payment patterns, WA sentiment, lease timelines, and vacancy duration to surface issues before they escalate.</Alert>
      </div>
      <Card>
        <PanelHead icon="ti-shield-exclamation" title="Active risk flags" sub={`${RISKS.length} issues detected`} />
        <div className="px-4">
          {RISKS.map(r => {
            const unit    = r.unitId ? UNITS.find(u => u.id === r.unitId) : null;
            const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
            return (
              <div key={r.id} className="flex items-center gap-3.5 py-3.5 border-b border-gray-100">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.level==="critical"?"bg-red-50":r.level==="high"?"bg-amber-50":"bg-gray-100"}`}>
                  <i className={`ti ${r.level==="critical"?"ti-alert-octagon":r.level==="high"?"ti-alert-circle":"ti-alert-triangle"} text-lg ${r.level==="critical"?"text-red-600":r.level==="high"?"text-amber-600":"text-gray-400"}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-gray-900">{r.client!=="–" ? r.client : project?.name || r.unitId}</div>
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

export function UnitsPage() {
  const [projectFilter, setProjectFilter] = useState("all");
  const filtered = projectFilter === "all" ? UNITS : UNITS.filter(u => u.projectId === projectFilter);
  return (
    <div className="p-5">
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <button onClick={() => setProjectFilter("all")}
          className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${projectFilter==="all"?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
          All projects
        </button>
        {PROJECTS.map(p => (
          <button key={p.id} onClick={() => setProjectFilter(p.id)}
            className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${projectFilter===p.id?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
            {p.name.split(" ").slice(0,2).join(" ")}
          </button>
        ))}
      </div>
      <Card>
        <div className="grid px-4 py-2.5 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
          style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 100px" }}>
          <span>Unit</span><span>Floor</span><span>Type</span><span>Size</span><span>Rent</span><span>Status</span>
        </div>
        {filtered.map(u => {
          const project = PROJECTS.find(p => p.id === u.projectId);
          const tenant  = CLIENTS.find(c => c.unitId === u.id);
          return (
            <div key={u.id} className="grid items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 100px" }}>
              <div>
                <div className="text-[13px] font-medium text-gray-900">{project?.name}</div>
                <div className="text-[11px] text-gray-400">Unit {u.unitNo}{tenant ? ` · ${tenant.name}` : ""}</div>
              </div>
              <div className="text-[13px] text-gray-700 font-mono">{u.floor}</div>
              <div className="text-[13px] text-gray-700 capitalize">{u.type}{u.bedrooms ? ` · ${u.bedrooms}bd` : ""}</div>
              <div className="text-[13px] text-gray-700">{u.size}</div>
              <div className="text-[13px] font-semibold font-mono text-brand-500">{fmt(u.rent)}</div>
              <Pill color={u.status==="leased"?"green":"amber"}>{u.status}</Pill>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

export function DocParserPage() {
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const parse = async () => { setLoading(true); await new Promise(r=>setTimeout(r,2000)); setLoading(false); setParsed(true); };

  return (
    <div className="p-5 max-w-2xl">
      <div className="mb-4">
        <Alert type="info">Upload any signed lease, agreement, or notice. AI will extract key terms — rent, duration, clauses, and parties — automatically.</Alert>
      </div>
      {!parsed ? (
        <Card>
          <div className="p-8">
            <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);parse();}}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragging?"border-brand-500 bg-blue-50":"border-gray-300"}`}>
              <i className={`ti ti-cloud-upload text-4xl mb-3 ${dragging?"text-brand-500":"text-gray-300"}`} aria-hidden />
              <div className="text-[15px] font-medium text-gray-700 mb-1.5">Drop a document here</div>
              <div className="text-[13px] text-gray-400 mb-5">PDF, DOCX, or scanned image · Max 20MB</div>
              <Button variant="secondary" icon="ti-upload" onClick={parse} loading={loading}>Choose file</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2.5 mb-5 p-3 bg-emerald-50 rounded-lg">
              <i className="ti ti-circle-check text-emerald-600 text-lg" aria-hidden />
              <span className="text-[13px] font-medium text-emerald-700">Parsed — DHA_Lease_SaraAkhtar_2024.pdf</span>
            </div>
            <div className="text-[13px] font-semibold text-gray-700 mb-3">Extracted fields</div>
            {[
              ["Tenant","Sara Akhtar"],["Landlord","Nyxion Properties Pvt. Ltd."],
              ["Project","DHA Residency Tower"],["Unit","Unit 301 · Floor 3"],
              ["Lease start","01 August 2024"],["Lease end","31 July 2025"],
              ["Monthly rent","Rs. 120,000"],["Security deposit","Rs. 360,000 (3 months)"],
              ["Notice period","60 days"],["Sub-letting","Not permitted without written consent"],
              ["Maintenance","Tenant responsible for repairs under Rs. 5,000"],
            ].map(([k,v]) => (
              <div key={k} className="flex py-2 border-b border-gray-100">
                <span className="text-[12px] text-gray-400 w-44 shrink-0">{k}</span>
                <span className="text-[13px] text-gray-800 font-medium">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" size="sm" icon="ti-refresh" onClick={() => setParsed(false)}>Parse another</Button>
              <Button size="sm" icon="ti-user-plus">Link to client</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export function PlaceholderPage({ title, icon }) {
  return (
    <div className="p-5 flex items-center justify-center" style={{ minHeight:400 }}>
      <div className="text-center">
        <i className={`ti ${icon} text-4xl text-gray-300 mb-3`} aria-hidden />
        <div className="text-[16px] font-medium text-gray-600">{title}</div>
        <div className="text-[13px] text-gray-400 mt-1.5">Coming in the next build session.</div>
      </div>
    </div>
  );
}