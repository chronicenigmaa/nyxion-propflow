import { useState } from "react";
import { Avatar, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt } from "../lib/utils.js";
import { LEASES, CLIENTS, UNITS, PROJECTS } from "../data/demo.js";

const STATUS_STYLES = {
  active:     { color:"green", label:"Active"     },
  expiring:   { color:"amber", label:"Expiring"   },
  terminated: { color:"red",   label:"Terminated" },
};

const daysUntil = d => Math.ceil((new Date(d) - new Date()) / 86400000);

const sel = (err) => ({
  height:40, width:"100%", borderRadius:8,
  border:`1px solid ${err?"#E02424":"#D1D5DB"}`,
  padding:"0 12px", fontSize:14, color:"#111827",
  fontFamily:"inherit", outline:"none", background:"#fff",
});

function AddLeaseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ clientId:"", unitId:"", rentAmount:"", startDate:"", endDate:"", securityDeposit:"", noticePeriod:"60" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.clientId)        e.clientId        = "Select a client";
    if (!form.unitId)          e.unitId          = "Select a unit";
    if (!form.rentAmount)      e.rentAmount      = "Enter monthly rent";
    if (!form.startDate)       e.startDate       = "Select start date";
    if (!form.endDate)         e.endDate         = "Select end date";
    if (!form.securityDeposit) e.securityDeposit = "Enter security deposit";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onAdd({ ...form, id:"L_NEW_"+Date.now(), status:"active", rentAmount:Number(form.rentAmount), securityDeposit:Number(form.securityDeposit), noticePeriod:Number(form.noticePeriod) });
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>Create lease</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>New lease agreement</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Client</label>
            <select value={form.clientId} onChange={set("clientId")} style={sel(errors.clientId)}>
              <option value="">Select client…</option>
              {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <span style={{ fontSize:12, color:"#E02424" }}>{errors.clientId}</span>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Unit (vacant only)</label>
            <select value={form.unitId} onChange={set("unitId")} style={sel(errors.unitId)}>
              <option value="">Select unit…</option>
              {UNITS.filter(u => u.status === "vacant").map(u => {
                const project = PROJECTS.find(p => p.id === u.projectId);
                return <option key={u.id} value={u.id}>{project?.name} — Unit {u.unitNo} (Floor {u.floor}) · {fmt(u.rent)}/mo</option>;
              })}
            </select>
            {errors.unitId && <span style={{ fontSize:12, color:"#E02424" }}>{errors.unitId}</span>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Monthly rent (Rs.)" value={form.rentAmount} onChange={set("rentAmount")} placeholder="e.g. 120000" error={errors.rentAmount} icon="ti-coin-rupee" />
            <Input label="Security deposit (Rs.)" value={form.securityDeposit} onChange={set("securityDeposit")} placeholder="e.g. 360000" error={errors.securityDeposit} icon="ti-shield" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Start date" type="date" value={form.startDate} onChange={set("startDate")} error={errors.startDate} />
            <Input label="End date" type="date" value={form.endDate} onChange={set("endDate")} error={errors.endDate} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Notice period</label>
            <select value={form.noticePeriod} onChange={set("noticePeriod")} style={sel(false)}>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={submit} icon="ti-file-plus">Create lease</Button>
        </div>
      </div>
    </div>
  );
}

export function LeasesPage() {
  const [leases, setLeases] = useState(LEASES);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered   = leases.filter(l => filter === "all" || l.status === filter);
  const active     = leases.filter(l => l.status === "active").length;
  const expiring   = leases.filter(l => l.status === "expiring").length;
  const terminated = leases.filter(l => l.status === "terminated").length;

  return (
    <div className="p-5">
      {expiring > 0 && (
        <div className="mb-4">
          <Alert type="warning">{expiring} lease{expiring > 1 ? "s are" : " is"} expiring soon. Initiate renewal discussions before the notice period deadline.</Alert>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [active,     "Active leases",  "#1C64F2","#EBF5FF","ti-file-text"        ],
          [expiring,   "Expiring soon",  "#B45309","#FFFBEB","ti-clock-exclamation"],
          [terminated, "Terminated",     "#6B7280","#F3F4F6","ti-file-off"         ],
        ].map(([v,l,fg,bg,ic])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
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
          {[["all","All"],["active","Active"],["expiring","Expiring"],["terminated","Terminated"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {l}
            </button>
          ))}
        </div>
        <Button icon="ti-file-plus" onClick={() => setShowModal(true)}>Create lease</Button>
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map(lease => {
          const client  = CLIENTS.find(c => c.id === lease.clientId);
          const unit    = UNITS.find(u => u.id === lease.unitId);
          const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
          const ss      = STATUS_STYLES[lease.status] || STATUS_STYLES.active;
          const days    = daysUntil(lease.endDate);
          return (
            <div key={lease.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {client && <Avatar name={client.name} size={40} />}
                  <div>
                    <div className="text-[15px] font-semibold text-gray-900">{client?.name}</div>
                    <div className="text-[12px] text-gray-400 mt-0.5">{project?.name} — Unit {unit?.unitNo} · Floor {unit?.floor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lease.status === "expiring" && (
                    <span className="text-[12px] text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">
                      {days > 0 ? `Expires in ${days} days` : "Expired"}
                    </span>
                  )}
                  <Pill color={ss.color}>{ss.label}</Pill>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  [fmt(lease.rentAmount),      "Monthly rent",     "ti-coin-rupee"  ],
                  [fmt(lease.securityDeposit), "Security deposit", "ti-shield"      ],
                  [lease.startDate,            "Start date",       "ti-calendar"    ],
                  [lease.endDate,              "End date",         "ti-calendar-off"],
                ].map(([v,l,ic])=>(
                  <div key={l} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <i className={`ti ${ic} text-[12px] text-gray-400`} aria-hidden />
                      <span className="text-[10px] text-gray-400">{l}</span>
                    </div>
                    <div className="text-[13px] font-semibold text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-[12px] text-gray-400">Notice period: {lease.noticePeriod} days</span>
                {lease.status !== "terminated" && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon="ti-refresh">Renew</Button>
                    <Button variant="ghost" size="sm" icon="ti-download">Download</Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-[13px] text-gray-400 bg-white border border-gray-200 rounded-xl">No leases found.</div>
        )}
      </div>
      {showModal && <AddLeaseModal onClose={() => setShowModal(false)} onAdd={l => setLeases(prev => [l, ...prev])} />}
    </div>
  );
}