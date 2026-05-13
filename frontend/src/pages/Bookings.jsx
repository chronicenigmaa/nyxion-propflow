import { useState } from "react";
import { Card, Avatar, Pill } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { BOOKINGS, CLIENTS, UNITS, PROJECTS } from "../data/demo.js";

const TYPE_OPTS   = ["viewing","signing","inspection"];
const STATUS_OPTS = ["scheduled","completed","cancelled"];

const TYPE_STYLES = {
  viewing:    { color:"blue",   icon:"ti-eye",       label:"Viewing"    },
  signing:    { color:"green",  icon:"ti-signature", label:"Signing"    },
  inspection: { color:"purple", icon:"ti-tools",     label:"Inspection" },
};
const STATUS_STYLES = {
  scheduled: { color:"blue",  label:"Scheduled" },
  completed: { color:"green", label:"Completed" },
  cancelled: { color:"red",   label:"Cancelled" },
};

const sel = err => ({
  height:36, borderRadius:8, border:`1px solid ${err?"#E02424":"#D1D5DB"}`,
  padding:"0 10px", fontSize:13, color:"#111827", fontFamily:"inherit",
  outline:"none", background:"#fff", cursor:"pointer",
});

function AddBookingModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ clientId:"", unitId:"", visitDate:"", visitTime:"", type:"viewing", notes:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const validate = () => {
    const e = {};
    if (!form.clientId)  e.clientId  = "Select a client";
    if (!form.unitId)    e.unitId    = "Select a unit";
    if (!form.visitDate) e.visitDate = "Select a date";
    if (!form.visitTime) e.visitTime = "Select a time";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    setLoading(false);
    onAdd({ ...form, id:"B_NEW_"+Date.now(), status:"scheduled" });
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>Schedule booking</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Viewing, signing, or inspection</div>
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
              {CLIENTS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <span style={{ fontSize:12, color:"#E02424" }}>{errors.clientId}</span>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Unit</label>
            <select value={form.unitId} onChange={set("unitId")} style={sel(errors.unitId)}>
              <option value="">Select unit…</option>
              {UNITS.map(u=>{
                const project = PROJECTS.find(p=>p.id===u.projectId);
                return <option key={u.id} value={u.id}>{project?.name} — Unit {u.unitNo} (Floor {u.floor})</option>;
              })}
            </select>
            {errors.unitId && <span style={{ fontSize:12, color:"#E02424" }}>{errors.unitId}</span>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Date" type="date" value={form.visitDate} onChange={set("visitDate")} error={errors.visitDate} />
            <Input label="Time" type="time" value={form.visitTime} onChange={set("visitTime")} error={errors.visitTime} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Type</label>
            <select value={form.type} onChange={set("type")} style={sel(false)}>
              <option value="viewing">Viewing</option>
              <option value="signing">Lease signing</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={set("notes")} placeholder="Any relevant notes…" rows={2}
              style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
              onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
              onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
            />
          </div>
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={submit} icon="ti-calendar-plus">Schedule</Button>
        </div>
      </div>
    </div>
  );
}

export function BookingsPage() {
  const [bookings, setBookings] = useState(BOOKINGS);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const update = (id, field, value) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));

  const filtered  = bookings.filter(b => filter === "all" || b.status === filter);
  const upcoming  = bookings.filter(b => b.status === "scheduled").length;
  const completed = bookings.filter(b => b.status === "completed").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [upcoming,  "Upcoming",  "#1C64F2","#EBF5FF","ti-calendar-event"],
          [completed, "Completed", "#057A55","#F3FAF7","ti-circle-check"  ],
          [cancelled, "Cancelled", "#E02424","#FDF2F2","ti-calendar-x"    ],
        ].map(([v,l,fg,bg,ic])=>(
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
          {[["all","All"],["scheduled","Scheduled"],["completed","Completed"],["cancelled","Cancelled"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>
              {l}
            </button>
          ))}
        </div>
        <Button icon="ti-calendar-plus" onClick={()=>setShowModal(true)}>Schedule booking</Button>
      </div>

      <Card>
        <div className="grid px-4 py-3 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 rounded-t-xl"
          style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 130px 130px" }}>
          <span>Client</span><span>Unit</span><span>Date</span><span>Time</span><span>Type</span><span>Status</span>
        </div>
        {filtered.map(b=>{
          const client  = CLIENTS.find(c=>c.id===b.clientId);
          const unit    = UNITS.find(u=>u.id===b.unitId);
          const project = unit ? PROJECTS.find(p=>p.id===unit.projectId) : null;
          const ts = TYPE_STYLES[b.type]||TYPE_STYLES.viewing;
          return (
            <div key={b.id} className="grid items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 130px 130px" }}>
              <div className="flex items-center gap-2.5">
                {client && <Avatar name={client.name} size={30} />}
                <div>
                  <div className="text-[13px] font-medium text-gray-900">{client?.name||"–"}</div>
                  <div className="text-[11px] text-gray-400 truncate max-w-[160px]">{b.notes?.slice(0,35)}{b.notes?.length>35?"…":""}</div>
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-700">{project?.name}</div>
                <div className="text-[11px] text-gray-400">Unit {unit?.unitNo} · Floor {unit?.floor}</div>
              </div>
              <div className="text-[13px] text-gray-700">{b.visitDate}</div>
              <div className="text-[13px] text-gray-700">{b.visitTime}</div>

              {/* Editable type */}
              <select value={b.type} onChange={e=>update(b.id,"type",e.target.value)}
                style={{ ...sel(false), fontSize:12, height:30, width:120 }}>
                {TYPE_OPTS.map(t=><option key={t} value={t}>{TYPE_STYLES[t].label}</option>)}
              </select>

              {/* Editable status */}
              <select value={b.status} onChange={e=>update(b.id,"status",e.target.value)}
                style={{ ...sel(false), fontSize:12, height:30, width:120,
                  color: b.status==="completed"?"#057A55":b.status==="cancelled"?"#E02424":"#1C64F2",
                  fontWeight:500 }}>
                {STATUS_OPTS.map(s=><option key={s} value={s}>{STATUS_STYLES[s].label}</option>)}
              </select>
            </div>
          );
        })}
        {filtered.length===0 && <div className="py-10 text-center text-[13px] text-gray-400">No bookings found.</div>}
      </Card>

      {showModal && <AddBookingModal onClose={()=>setShowModal(false)} onAdd={b=>setBookings(prev=>[b,...prev])} />}
    </div>
  );
}