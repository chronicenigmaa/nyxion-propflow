import { useState } from "react";
import { Card, PanelHead, Avatar, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt, scoreColor } from "../lib/utils.js";
import {
  CLIENTS as DEMO_CLIENTS,
  UNITS, PROJECTS, NUDGES,
  BOOKINGS as DEMO_BOOKINGS,
} from "../data/demo.js";

const sel = (err) => ({
  height:40, width:"100%", borderRadius:8, border:`1px solid ${err?"#E02424":"#D1D5DB"}`,
  padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff",
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
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>{children}</div>
        {footer && <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>{footer}</div>}
      </div>
    </div>
  );
}

// ─── Add Client Modal ─────────────────────────────────────────────────────────
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
      ...form, id:"C_NEW_"+Date.now(), score:50,
      statusColor: form.status==="Prospect"?"blue":form.status==="Active"?"green":"blue",
      paymentStatus:"prospect", rentAmount:unit?.rent||null,
      waSummary:"No conversation recorded yet.",
      waSummaryUrdu:"Abhi koi baat nahi hui.",
      waTags:["New client"], waSentiment:"neutral",
      riskFlags:[], nextNudge:"Make first contact and schedule a viewing.",
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
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Assign vacant unit (optional)</label>
        <select value={form.unitId} onChange={set("unitId")} style={sel(false)}>
          <option value="">No unit assigned</option>
          {UNITS.filter(u => u.status==="vacant").map(u => {
            const p = PROJECTS.find(pr => pr.id===u.projectId);
            return <option key={u.id} value={u.id}>{p?.name} — Unit {u.unitNo} (Floor {u.floor}) · {fmt(u.rent)}/mo</option>;
          })}
        </select>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Notes (optional)</label>
        <textarea value={form.notes} onChange={set("notes")} placeholder="Referral source, budget, requirements…" rows={2}
          style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
          onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
          onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
        />
      </div>
    </Modal>
  );
}

// ─── Book Viewing Modal ───────────────────────────────────────────────────────
function BookViewingModal({ client, onClose, onBook }) {
  const [form, setForm] = useState({ unitId:"", visitDate:"", visitTime:"", type:"viewing", notes:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.unitId)    e.unitId    = "Select a unit";
    if (!form.visitDate) e.visitDate = "Select a date";
    if (!form.visitTime) e.visitTime = "Select a time";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onBook({ ...form, id:"B_NEW_"+Date.now(), clientId:client.id, status:"scheduled" });
    onClose();
  };

  return (
    <Modal title="Schedule booking" sub={`For ${client.name}`} onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={submit} icon="ti-calendar-plus">Schedule</Button></>}>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Unit</label>
        <select value={form.unitId} onChange={set("unitId")} style={sel(errors.unitId)}>
          <option value="">Select unit…</option>
          {UNITS.map(u => {
            const p = PROJECTS.find(pr => pr.id===u.projectId);
            return <option key={u.id} value={u.id}>{p?.name} — Unit {u.unitNo} (Floor {u.floor})</option>;
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
        <textarea value={form.notes} onChange={set("notes")} placeholder="Any relevant details…" rows={2}
          style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
          onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
          onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
        />
      </div>
    </Modal>
  );
}

// ─── Log WA Chat Modal ────────────────────────────────────────────────────────
function LogWAModal({ client, onClose, onSave }) {
  const [chatText, setChatText] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");

  const summarise = async () => {
    if (chatText.trim().length < 20) { setError("Please paste the conversation first"); return; }
    setError(""); setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/whatsapp/summarise`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ clientName:client.name, chatText }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback demo summary if backend not running
      setResult({
        summaryEn: `Conversation with ${client.name} reviewed. Client discussed property requirements and showed interest in available units.`,
        summaryUrdu: `${client.name} ke saath baat hui. Unit dekhne mein interest dikhaya.`,
        sentiment: "positive",
        tags: ["Reviewed", "Interested"],
        nudge: "Follow up within 48 hours with unit options.",
      });
    }
    setLoading(false);
  };

  const save = () => {
    if (!result) return;
    onSave(client.id, result);
    onClose();
  };

  const sentColor = result?.sentiment==="positive"?"#057A55":result?.sentiment==="negative"?"#E02424":"#6B7280";
  const sentBg    = result?.sentiment==="positive"?"#F3FAF7":result?.sentiment==="negative"?"#FDF2F2":"#F3F4F6";

  return (
    <Modal title="Log WhatsApp conversation" sub={`Summarise chat with ${client.name}`} onClose={onClose}
      footer={result
        ? <><Button variant="secondary" onClick={() => setResult(null)}>Re-summarise</Button><Button onClick={save} icon="ti-check">Save summary</Button></>
        : <><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={summarise} icon="ti-sparkles">Generate summary</Button></>
      }>
      {!result ? (
        <>
          <div style={{ fontSize:12, color:"#9CA3AF" }}>
            WhatsApp → Open chat → ⋮ → Export chat → Without media → copy all → paste below
          </div>
          <textarea value={chatText} onChange={e=>setChatText(e.target.value)} rows={7}
            placeholder={"[2025-05-10, 3:42 PM] Ahmed: bhai rent abhi nahi de sakta\n[2025-05-10, 3:43 PM] Arif: kab tak?\n[2025-05-10, 3:45 PM] Ahmed: ek hafte mein pakka…"}
            style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"12px 14px", fontSize:13, color:"#374151", fontFamily:"monospace", outline:"none", resize:"vertical", lineHeight:1.6 }}
            onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
            onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
          />
          {error && <div style={{ fontSize:12, color:"#E02424" }}>{error}</div>}
          <div style={{ background:"#F5F3FF", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#6C2BD9" }}>
            <i className="ti ti-sparkles" style={{ marginRight:5 }} aria-hidden />
            Fully understands Roman Urdu — "rent nahi de sakta", "agreement pe raazi hun" etc.
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>English summary</div>
          <div style={{ fontSize:13, color:"#374151", lineHeight:1.65, background:"#F9FAFB", borderRadius:8, padding:"12px 14px" }}>{result.summaryEn}</div>
          <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>Roman Urdu</div>
          <div style={{ fontSize:13, color:"#374151", lineHeight:1.65, background:"#F5F3FF", borderRadius:8, padding:"12px 14px" }}>{result.summaryUrdu}</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ background:sentBg, color:sentColor, fontSize:12, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>{result.sentiment} sentiment</span>
            {result.tags?.map(t => <span key={t} style={{ background:"#EBF5FF", color:"#1E40AF", fontSize:12, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>{t}</span>)}
          </div>
          <div style={{ background:"#FFFBEB", borderRadius:8, padding:"10px 14px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>Recommended action</div>
            <div style={{ fontSize:13, color:"#78350F" }}>{result.nudge}</div>
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── Client Detail ────────────────────────────────────────────────────────────
function ClientDetail({ cl, onBack, onUpdateClient }) {
  const [showBooking, setShowBooking] = useState(false);
  const [showWA, setShowWA]           = useState(false);
  const [bookings, setBookings]       = useState(DEMO_BOOKINGS.filter(b => b.clientId === cl.id));

  const unit    = cl.unitId ? UNITS.find(u => u.id === cl.unitId) : null;
  const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
  const sc = scoreColor(cl.score);

  const handleBook = (booking) => setBookings(prev => [booking, ...prev]);
  const handleWA   = (clientId, result) => {
    onUpdateClient(clientId, {
      waSummary: result.summaryEn,
      waSummaryUrdu: result.summaryUrdu,
      waSentiment: result.sentiment,
      waTags: result.tags,
      nextNudge: result.nudge,
    });
  };

  return (
    <div className="p-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-4 hover:text-gray-700">
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
                  {cl.paymentStatus==="overdue" && <Pill color="red">Payment overdue</Pill>}
                </div>
              </div>
            </div>
            {[
              ["Phone",   cl.phone||"–",                                         "ti-phone"     ],
              ["CNIC",    cl.cnic||"–",                                           "ti-id"        ],
              ["City",    cl.city||"–",                                           "ti-map-pin"   ],
              ["Project", project?.name||"No unit assigned",                      "ti-building"  ],
              ["Unit",    unit?`Unit ${unit.unitNo} · Floor ${unit.floor}`:"–",   "ti-home"      ],
              ["Rent",    cl.rentAmount?fmt(cl.rentAmount):"–",                   "ti-coin-rupee"],
            ].map(([k,v,ic]) => (
              <div key={k} className="flex items-center gap-2.5 py-2 border-b border-gray-100">
                <i className={`ti ${ic} text-gray-400 text-[14px] w-4 shrink-0`} aria-hidden />
                <span className="text-[12px] text-gray-400 w-20">{k}</span>
                <span className="text-[13px] text-gray-800 font-medium">{v}</span>
              </div>
            ))}
            {cl.notes && <div className="mt-3 text-[12px] text-gray-400 italic leading-relaxed">{cl.notes}</div>}

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" fullWidth icon="ti-brand-whatsapp" onClick={() => setShowWA(true)}>Log WA chat</Button>
              <Button variant="secondary" fullWidth icon="ti-calendar-plus" onClick={() => setShowBooking(true)}>Book viewing</Button>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          {/* AI lead score */}
          <Card>
            <div className="p-4">
              <div className="text-[13px] font-semibold text-gray-700 mb-3">AI lead score</div>
              <div className="text-4xl font-bold font-mono mb-1" style={{ color:sc }}>
                {cl.score}<span className="text-base text-gray-400 font-normal">/100</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full my-2.5">
                <div style={{ width:`${cl.score}%`, background:sc }} className="h-full rounded-full" />
              </div>
              <div className="text-[12px] text-gray-400">Based on payment history, WA sentiment, and response rate.</div>
            </div>
          </Card>

          {/* WA summary */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-semibold text-gray-700">WhatsApp AI summary</div>
                <button onClick={() => setShowWA(true)} className="text-[11px] text-brand-500 font-medium hover:underline">Update →</button>
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">English</div>
              <div className="text-[13px] text-gray-600 leading-relaxed mb-2.5">{cl.waSummary}</div>
              {cl.waSummaryUrdu && (
                <div className="bg-gray-50 rounded-lg p-2.5 mb-2.5">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Roman Urdu</div>
                  <div className="text-[13px] text-gray-600 leading-relaxed">{cl.waSummaryUrdu}</div>
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                {cl.waTags?.map(t => <Pill key={t} color={cl.waSentiment==="positive"?"green":cl.waSentiment==="negative"?"red":"amber"}>{t}</Pill>)}
              </div>
            </div>
          </Card>

          {/* Smart nudge */}
          {cl.nextNudge && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex gap-2.5">
              <i className="ti ti-send text-brand-500 text-[15px] mt-0.5 shrink-0" aria-hidden />
              <div>
                <div className="text-[12px] font-semibold text-blue-800 mb-0.5">Smart nudge</div>
                <div className="text-[13px] text-blue-700">{cl.nextNudge}</div>
              </div>
            </div>
          )}

          {/* Risk flags */}
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

          {/* Bookings history */}
          {bookings.length > 0 && (
            <Card>
              <PanelHead icon="ti-calendar-event" title="Bookings" sub={`${bookings.length} total`} action="Add" onAction={() => setShowBooking(true)} />
              <div className="px-4">
                {bookings.map(b => {
                  const unit = UNITS.find(u => u.id === b.unitId);
                  const proj = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
                  return (
                    <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100">
                      <i className={`ti ${b.status==="completed"?"ti-circle-check text-emerald-500":b.status==="cancelled"?"ti-circle-x text-red-400":"ti-clock text-brand-500"} text-[15px]`} aria-hidden />
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-gray-800">{proj?.name} — Unit {unit?.unitNo}</div>
                        <div className="text-[11px] text-gray-400">{b.visitDate} · {b.visitTime} · {b.type}</div>
                      </div>
                      <Pill color={b.status==="completed"?"green":b.status==="cancelled"?"red":"blue"}>{b.status}</Pill>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {showBooking && <BookViewingModal client={cl} onClose={() => setShowBooking(false)} onBook={handleBook} />}
      {showWA      && <LogWAModal       client={cl} onClose={() => setShowWA(false)}      onSave={handleWA} />}
    </div>
  );
}

// ─── Clients Page ─────────────────────────────────────────────────────────────
export function ClientsPage() {
  const [clients, setClients]   = useState(DEMO_CLIENTS);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);

  const addClient = (c) => setClients(prev => [c, ...prev]);
  const updateClient = (id, fields) => setClients(prev => prev.map(c => c.id===id ? { ...c, ...fields } : c));

  if (selected) {
    const cl = clients.find(c => c.id === selected);
    if (!cl) { setSelected(null); return null; }
    return <ClientDetail cl={cl} onBack={() => setSelected(null)} onUpdateClient={updateClient} />;
  }

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.city||"").toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchF = filter==="all"
      || (filter==="hot"&&c.score>=75)
      || (filter==="risk"&&c.score<40)
      || (filter==="active"&&c.paymentStatus==="paid")
      || (filter==="prospect"&&c.paymentStatus==="prospect");
    return matchQ && matchF;
  });

  return (
    <div className="p-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          [clients.length,                                         "Total clients",  "#1C64F2","#EBF5FF","ti-users"           ],
          [clients.filter(c=>c.score>=75).length,                 "Hot leads",      "#057A55","#F3FAF7","ti-flame"           ],
          [clients.filter(c=>c.paymentStatus==="overdue").length, "Overdue",        "#E02424","#FDF2F2","ti-clock-exclamation"],
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

      {/* Filters + search */}
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

      {/* Table */}
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
                  <div className="text-[13px] font-semibold text-gray-900">{cl.name}</div>
                  <div className="text-[11px] text-gray-400">{cl.email}</div>
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-700">{project?.name||"No unit"}</div>
                <div className="text-[11px] text-gray-400">{unit?`Unit ${unit.unitNo} · Floor ${unit.floor}`:cl.city||"–"}</div>
              </div>
              <Pill color={cl.paymentStatus==="paid"?"green":cl.paymentStatus==="overdue"?"red":cl.paymentStatus==="upcoming"?"blue":"gray"}>
                {cl.paymentStatus==="paid"?"Paid":cl.paymentStatus==="overdue"?"Overdue":cl.paymentStatus==="upcoming"?"Upcoming":"Prospect"}
              </Pill>
              <div>
                <div className="text-[12px] font-bold font-mono" style={{ color:sc }}>{cl.score}</div>
                <div className="h-[3px] bg-gray-100 rounded mt-1 w-10">
                  <div style={{ width:`${cl.score}%`, background:sc }} className="h-full rounded" />
                </div>
              </div>
              <Pill color={cl.statusColor}>{cl.status}</Pill>
              <i className="ti ti-chevron-right text-gray-300 text-[15px]" aria-hidden />
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <i className="ti ti-users-off text-3xl text-gray-200 mb-2" aria-hidden />
            <div className="text-[13px] text-gray-400">No clients match your search.</div>
          </div>
        )}
      </Card>

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onAdd={addClient} />}
    </div>
  );
}