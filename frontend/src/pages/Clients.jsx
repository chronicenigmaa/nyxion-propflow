// ─── Clients ──────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Card, PanelHead, Avatar, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { fmt, scoreColor } from "../lib/utils.js";
import { CLIENTS, UNITS, PAYMENTS, NUDGES, RISKS, FORECAST } from "../data/demo.js";

export function ClientsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = CLIENTS.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchF = filter==="all"||(filter==="hot"&&c.score>=75)||(filter==="risk"&&c.score<40)||(filter==="active"&&c.paymentStatus==="paid");
    return matchQ && matchF;
  });

  if (selected) {
    const cl = CLIENTS.find(c=>c.id===selected);
    const unit = cl.unit ? UNITS.find(u=>u.id===cl.unit) : null;
    const sc = scoreColor(cl.score);
    return (
      <div className="p-5">
        <button onClick={()=>setSelected(null)} className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-4 hover:text-gray-700">
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
              {[["Phone",cl.phone,"ti-phone"],["CNIC",cl.cnic,"ti-id"],["City",cl.city,"ti-map-pin"],["Unit",unit?unit.label:"No unit","ti-building"],["Rent",cl.rentAmount?fmt(cl.rentAmount):"–","ti-coin-rupee"]].map(([k,v,ic])=>(
                <div key={k} className="flex items-center gap-2.5 py-2 border-b border-gray-100">
                  <i className={`ti ${ic} text-gray-400 text-[14px] w-4 shrink-0`} aria-hidden />
                  <span className="text-[12px] text-gray-400 w-20">{k}</span>
                  <span className="text-[13px] text-gray-800 font-medium">{v}</span>
                </div>
              ))}
              {cl.leaseStart && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <div className="text-[11px] text-gray-400 mb-1">Lease period</div>
                  <div className="text-[13px] font-medium text-gray-800">{cl.leaseStart} — {cl.leaseEnd}</div>
                </div>
              )}
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
                <div className="text-[13px] text-gray-600 leading-relaxed mb-2.5">{cl.waSummary}</div>
                <div className="flex gap-1.5 flex-wrap">{cl.waTags.map(t=><Pill key={t} color={cl.waSentiment==="positive"?"green":"amber"}>{t}</Pill>)}</div>
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
                  {cl.riskFlags.map(f=>(
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
          {[["all","All"],["hot","Hot leads"],["active","Active"],["risk","At risk"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-52">
          <i className="ti ti-search text-gray-400 text-[14px]" aria-hidden />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…" className="bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder:text-gray-400 w-full" />
        </div>
        <Button size="sm" icon="ti-plus">Add client</Button>
      </div>
      <Card>
        <div className="grid px-4 py-2.5 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider" style={{ gridTemplateColumns:"2fr 1.5fr 1fr 80px 110px 40px" }}>
          <span>Client</span><span>Unit / city</span><span>Payment</span><span>Score</span><span>Status</span><span></span>
        </div>
        {filtered.map(cl=>{
          const unit = cl.unit?UNITS.find(u=>u.id===cl.unit):null;
          const sc = scoreColor(cl.score);
          return (
            <div key={cl.id} onClick={()=>setSelected(cl.id)}
              className="grid items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns:"2fr 1.5fr 1fr 80px 110px 40px" }}>
              <div className="flex items-center gap-2.5">
                <Avatar name={cl.name} size={32} />
                <div>
                  <div className="text-[13px] font-medium text-gray-900">{cl.name}</div>
                  <div className="text-[11px] text-gray-400">{cl.email}</div>
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-700">{unit?unit.label:"No unit"}</div>
                <div className="text-[11px] text-gray-400">{cl.city}</div>
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
        {filtered.length===0&&<div className="py-10 text-center text-[13px] text-gray-400">No clients match your search.</div>}
      </Card>
    </div>
  );
}

export function PaymentsPage() {
  const paid = PAYMENTS.filter(p=>p.status==="paid").reduce((a,p)=>a+p.amount,0);
  const overdue = PAYMENTS.filter(p=>p.status==="overdue").reduce((a,p)=>a+p.amount,0);
  const upcoming = PAYMENTS.filter(p=>p.status==="upcoming").reduce((a,p)=>a+(p.amount||0),0);
  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[[fmt(paid),"Collected this month","#057A55","ti-circle-check"],[fmt(overdue),"Total overdue","#E02424","ti-clock-exclamation"],[fmt(upcoming),"Due soon","#1C64F2","ti-calendar-time"]].map(([v,l,c,ic])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <i className={`ti ${ic} text-[15px]`} style={{ color:c }} aria-hidden />
              <span className="text-[12px] text-gray-500">{l}</span>
            </div>
            <div className="text-xl font-bold font-mono" style={{ color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <Card>
        <PanelHead icon="ti-receipt-2" title="All payments" sub="AI risk scored · May 2025" />
        <div className="grid px-4 py-2.5 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider" style={{ gridTemplateColumns:"2fr 1.5fr 1fr 1fr 110px" }}>
          <span>Client</span><span>Unit</span><span>Amount</span><span>Date</span><span>AI label</span>
        </div>
        {PAYMENTS.map(p=>(
          <div key={p.id} className="grid items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors" style={{ gridTemplateColumns:"2fr 1.5fr 1fr 1fr 110px" }}>
            <div className="flex items-center gap-2.5">
              <Avatar name={p.client} size={30} />
              <div>
                <div className="text-[13px] font-medium text-gray-900">{p.client}</div>
                {p.status==="overdue"&&<div className="text-[11px] text-red-500">{p.daysLate} days overdue</div>}
              </div>
            </div>
            <div className="text-[13px] text-gray-600">{UNITS.find(u=>u.id===p.unit)?.label||p.unit}</div>
            <div className="text-[13px] font-semibold font-mono" style={{ color:p.status==="overdue"?"#E02424":p.status==="paid"?"#057A55":"#374151" }}>{fmt(p.amount)}</div>
            <div className="text-[12px] text-gray-400">{p.paid||p.due||"–"}</div>
            <Pill color={p.aiColor}>{p.aiLabel}</Pill>
          </div>
        ))}
      </Card>
    </div>
  );
}

export function WhatsAppPage() {
  return (
    <div className="p-5">
      <div className="mb-4"><Alert type="info">WhatsApp conversations are processed by AI to generate summaries and intent tags. No messages are stored — only the summary is retained.</Alert></div>
      <div className="grid grid-cols-2 gap-4">
        {CLIENTS.filter(c=>c.waSummary).map(cl=>(
          <Card key={cl.id}>
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Avatar name={cl.name} size={36} />
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-gray-900">{cl.name}</div>
                  <div className="text-[11px] text-gray-400">{cl.city} · {cl.unit?UNITS.find(u=>u.id===cl.unit)?.label:"Prospect"}</div>
                </div>
                <Pill color={cl.waSentiment==="positive"?"green":cl.waSentiment==="negative"?"red":"gray"}>{cl.waSentiment}</Pill>
              </div>
              <div className="text-[13px] text-gray-700 leading-relaxed mb-2.5">{cl.waSummary}</div>
              <div className="flex gap-1.5 flex-wrap mb-2.5">{cl.waTags.map(t=><Pill key={t} color={cl.waSentiment==="positive"?"green":"amber"}>{t}</Pill>)}</div>
              <div className="flex items-center gap-1.5 bg-purple-50 rounded-lg px-2.5 py-1.5">
                <i className="ti ti-sparkles text-purple-600 text-[13px]" aria-hidden />
                <span className="text-[11px] text-purple-600 font-medium">AI generated summary</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function NudgesPage() {
  return (
    <div className="p-5">
      <Card>
        <PanelHead icon="ti-send" title="Smart follow-up nudges" sub={`${NUDGES.length} pending · AI generated`} />
        <div className="px-4">
          {NUDGES.map(n=>(
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
      <div className="mb-4"><Alert type="warning">The AI risk monitor analyses payment patterns, WA sentiment, lease timelines, and vacancy durations to surface issues before they escalate.</Alert></div>
      <Card>
        <PanelHead icon="ti-shield-exclamation" title="Active risk flags" sub={`${RISKS.length} issues detected`} />
        <div className="px-4">
          {RISKS.map(r=>(
            <div key={r.id} className="flex items-center gap-3.5 py-3.5 border-b border-gray-100">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.level==="critical"?"bg-red-50":r.level==="high"?"bg-amber-50":"bg-gray-100"}`}>
                <i className={`ti ${r.level==="critical"?"ti-alert-octagon":r.level==="high"?"ti-alert-circle":"ti-alert-triangle"} text-lg ${r.level==="critical"?"text-red-600":r.level==="high"?"text-amber-600":"text-gray-400"}`} aria-hidden />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-gray-900">{r.client!=="–"?r.client:UNITS.find(u=>u.id===r.unitId)?.label||r.unit}</div>
                <div className="text-[12px] text-gray-500 mt-0.5">{r.reason}</div>
              </div>
              <Pill color={r.level==="critical"?"red":r.level==="high"?"amber":"gray"}>{r.level}</Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function UnitsPage() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-4">
        {UNITS.map(u=>(
          <Card key={u.id}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[14px] font-semibold text-gray-900">{u.label}</div>
                  <div className="text-[12px] text-gray-400 mt-0.5">{u.type} · {u.size} · {u.city}</div>
                </div>
                <Pill color={u.status==="leased"?"green":"amber"}>{u.status==="leased"?"Leased":"Vacant"}</Pill>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold font-mono text-brand-500">{fmt(u.rent)}<span className="text-[11px] text-gray-400 font-normal">/mo</span></div>
                {u.status==="leased"&&<div className="text-[12px] text-gray-500">Tenant: {CLIENTS.find(c=>c.unit===u.id)?.name||"–"}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DocParserPage() {
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const parse = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false); setParsed(true);
  };

  return (
    <div className="p-5 max-w-2xl">
      <div className="mb-4"><Alert type="info">Upload any signed lease, agreement, or notice. AI will extract key terms — rent, duration, clauses, parties — automatically.</Alert></div>
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
            {[["Tenant","Sara Akhtar"],["Landlord","Nyxion Properties Pvt. Ltd."],["Property","DHA Phase 6, 10-A, Lahore"],["Lease start","01 August 2024"],["Lease end","31 July 2025"],["Monthly rent","Rs. 120,000"],["Security deposit","Rs. 360,000 (3 months)"],["Notice period","60 days"],["Sub-letting","Not permitted without written consent"],["Maintenance","Tenant responsible for repairs under Rs. 5,000"]].map(([k,v])=>(
              <div key={k} className="flex py-2 border-b border-gray-100">
                <span className="text-[12px] text-gray-400 w-40 shrink-0">{k}</span>
                <span className="text-[13px] text-gray-800 font-medium">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" size="sm" icon="ti-refresh" onClick={()=>setParsed(false)}>Parse another</Button>
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
