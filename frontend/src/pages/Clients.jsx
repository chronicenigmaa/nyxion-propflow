import { useState } from "react";
import { Card, PanelHead, Avatar, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt, scoreColor } from "../lib/utils.js";
import { CLIENTS as DEMO_CLIENTS, UNITS, PROJECTS, NUDGES } from "../data/demo.js";

const sel = (err) => ({
  height: 40, width: "100%", borderRadius: 8,
  border: `1px solid ${err ? "#E02424" : "#D1D5DB"}`,
  padding: "0 12px", fontSize: 14, color: "#111827",
  fontFamily: "inherit", outline: "none", background: "#fff",
});

function Modal({ title, sub, onClose, children, footer }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>{title}</div>
            {sub && <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20, lineHeight:1 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>{children}</div>
        {footer && (
          <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", cnic:"", city:"", unitId:"", notes:"", status:"Prospect" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    const unit = form.unitId ? UNITS.find(u => u.id === form.unitId) : null;
    onAdd({
      ...form,
      id: "C_NEW_" + Date.now(),
      score: 50, statusColor: "blue", paymentStatus: "prospect",
      rentAmount: unit?.rent || null,
      waSummary: "No conversation recorded yet.",
      waSummaryUrdu: "Abhi koi baat nahi hui.",
      waTags: ["New client"], waSentiment: "neutral",
      riskFlags: [], nextNudge: "Make first contact and schedule a viewing.",
    });
    onClose();
  };

  return (
    <Modal title="Add new client" sub="Tenant, prospect, or buyer" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={submit} icon="ti-user-plus">Add client</Button></>}>
      <Input label="Full name" value={form.name} onChange={set("name")} placeholder="e.g. Sara Akhtar" error={errors.name} icon="ti-user" />
      <Input label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="sara@gmail.com" error={errors.email} icon="ti-mail" />
      <Input label="Phone number" value={form.phone} onChange={set("phone")} placeholder="+92 300 1234567" error={errors.phone} icon="ti-phone" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Input label="CNIC (optional)" value={form.cnic} onChange={set("cnic")} placeholder="35202-1234567-8" />
        <Input label="City" value={form.city} onChange={set("city")} placeholder="e.g. Lahore" />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Status</label>
        <select value={form.status} onChange={set("status")} style={sel(false)}>
          <option value="Prospect">Prospect</option>
          <option value="Interested">Interested</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Active">Active</option>
        </select>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Assign unit (optional — vacant only)</label>
        <select value={form.unitId} onChange={set("unitId")} style={sel(false)}>
          <option value="">No unit assigned yet</option>
          {UNITS.filter(u => u.status === "vacant").map(u => {
            const p = PROJECTS.find(pr => pr.id === u.projectId);
            return <option key={u.id} value={u.id}>{p?.name} — Unit {u.unitNo} (Floor {u.floor}) · {fmt(u.rent)}/mo</option>;
          })}
        </select>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Notes (optional)</label>
        <textarea value={form.notes} onChange={set("notes")} placeholder="Referral source, requirements, budget…" rows={2}
          style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
          onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
          onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
        />
      </div>
    </Modal>
  );
}

export function ClientsPage() {
  const [clients, setClients] = useState(DEMO_CLIENTS);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchF = filter==="all"||(filter==="hot"&&c.score>=75)||(filter==="risk"&&c.score<40)||(filter==="active"&&c.paymentStatus==="paid")||(filter==="prospect"&&c.paymentStatus==="prospect");
    return matchQ && matchF;
  });

  if (selected) {
    const cl = clients.find(c => c.id === selected);
    if (!cl) { setSelected(null); return null; }
    const unit    = cl.unitId ? UNITS.find(u => u.id === cl.unitId) : null;
    const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
    const sc = scoreColor(cl.score);
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
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Pill color={cl.statusColor}>{cl.status}</Pill>
                    {cl.paymentStatus === "overdue" && <Pill color="red">Payment overdue</Pill>}
                  </div>
                </div>
              </div>
              {[
                ["Phone",   cl.phone||"–",                                          "ti-phone"     ],
                ["CNIC",    cl.cnic||"–",                                            "ti-id"        ],
                ["City",    cl.city||"–",                                            "ti-map-pin"   ],
                ["Project", project?.name||"No unit assigned",                       "ti-building"  ],
                ["Unit",    unit?`Unit ${unit.unitNo} · Floor ${unit.floor}`:"–",    "ti-home"      ],
                ["Rent",    cl.rentAmount?fmt(cl.rentAmount):"–",                    "ti-coin-rupee"],
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
                <div className="text-[13px] font-semibold text-gray-700 mb-3">AI lead score</div>
                <div className="text-4xl font-bold font-mono mb-1" style={{ color:sc }}>{cl.score}<span className="text-base text-gray-400 font-normal">/100</span></div>
                <div className="h-2 bg-gray-100 rounded-full my-2"><div style={{ width:`${cl.score}%`, background:sc }} className="h-full rounded-full" /></div>
                <div className="text-[12px] text-gray-400">Based on payment history, WA sentiment, and response rate.</div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="text-[13px] font-semibold text-gray-700 mb-3">WhatsApp AI summary</div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">English</div>
                <div className="text-[13px] text-gray-600 leading-relaxed mb-3">{cl.waSummary}</div>
                {cl.waSummaryUrdu && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Roman Urdu</div>
                    <div className="text-[13px] text-gray-600 leading-relaxed">{cl.waSummaryUrdu}</div>
                  </div>
                )}
                <div className="flex gap-1.5 flex-wrap">
                  {cl.waTags?.map(t => <Pill key={t} color={cl.waSentiment==="positive"?"green":cl.waSentiment==="negative"?"red":"amber"}>{t}</Pill>)}
                </div>
              </div>
            </Card>

            {cl.nextNudge && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex gap-2.5">
                <i className="ti ti-send text-brand-500 text-[15px] mt-0.5 shrink-0" aria-hidden />
                <div>
                  <div className="text-[12px] font-semibold text-blue-800 mb-0.5">Smart nudge</div>
                  <div className="text-[13px] text-blue-700">{cl.nextNudge}</div>
                </div>
              </div>
            )}

            {cl.riskFlags?.length > 0 && (
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

            <div className="flex gap-2">
              <Button variant="secondary" fullWidth icon="ti-brand-whatsapp" onClick={() => {}}>Log WA chat</Button>
              <Button variant="secondary" fullWidth icon="ti-calendar-plus" onClick={() => {}}>Book viewing</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {[["all","All"],["hot","Hot leads"],["active","Active"],["prospect","Prospects"],["risk","At risk"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-52 shadow-sm">
          <i className="ti ti-search text-gray-400 text-[14px]" aria-hidden />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
            className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-full" />
        </div>
        <Button icon="ti-plus" onClick={() => setShowAdd(true)}>Add client</Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          [clients.length,                                            "Total clients",  "#1C64F2","#EBF5FF","ti-users"          ],
          [clients.filter(c=>c.score>=75).length,                    "Hot leads",      "#057A55","#F3FAF7","ti-flame"          ],
          [clients.filter(c=>c.paymentStatus==="overdue").length,    "Overdue",        "#E02424","#FDF2F2","ti-clock-exclamation"],
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

      <Card>
        <div className="grid px-4 py-3 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 rounded-t-xl"
          style={{ gridTemplateColumns:"2fr 2fr 1fr 80px 110px 40px" }}>
          <span>Client</span><span>Project / unit</span><span>Payment</span><span>Score</span><span>Status</span><span></span>
        </div>
        {filtered.map(cl => {
          const unit    = cl.unitId ? UNITS.find(u => u.id === cl.unitId) : null;
          const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
          const sc = scoreColor(cl.score);
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
                <div className="text-[13px] text-gray-700">{project?.name||"No unit"}</div>
                <div className="text-[11px] text-gray-400">{unit?`Unit ${unit.unitNo} · Floor ${unit.floor}`:cl.city}</div>
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
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">No clients match your search.</div>}
      </Card>

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onAdd={c => setClients(prev => [c, ...prev])} />}
    </div>
  );
}