import { useState } from "react";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { UNITS, PROJECTS, CLIENTS as DEMO_CLIENTS } from "../data/demo.js";
import { fmt } from "../lib/utils.js";

const sel = () => ({
  height:40, width:"100%", borderRadius:8, border:"1px solid #D1D5DB",
  padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff",
});

function AddClientModal({ onClose }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", cnic:"", city:"", unitId:"", notes:"", status:"Prospect" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
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
    setDone(true);
  };

  if (done) return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:400, padding:"32px", textAlign:"center", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ width:52, height:52, background:"#F3FAF7", borderRadius:14, display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
          <i className="ti ti-user-check" style={{ fontSize:26, color:"#057A55" }} aria-hidden />
        </div>
        <div style={{ fontSize:17, fontWeight:600, color:"#111827", marginBottom:6 }}>{form.name} added</div>
        <div style={{ fontSize:13, color:"#6B7280", marginBottom:20 }}>Client has been added. Go to the Clients page to view and manage them.</div>
        <Button fullWidth onClick={onClose} icon="ti-check">Done</Button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:500, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>Add new client</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Tenant, prospect, or buyer</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Full name" value={form.name} onChange={set("name")} placeholder="e.g. Sara Akhtar" error={errors.name} icon="ti-user" />
          <Input label="Email address" type="email" value={form.email} onChange={set("email")} placeholder="sara@gmail.com" error={errors.email} icon="ti-mail" />
          <Input label="Phone number" value={form.phone} onChange={set("phone")} placeholder="+92 300 1234567" error={errors.phone} icon="ti-phone" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="CNIC (optional)" value={form.cnic} onChange={set("cnic")} placeholder="35202-1234567-8" />
            <Input label="City" value={form.city} onChange={set("city")} placeholder="e.g. Lahore" />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Status</label>
            <select value={form.status} onChange={set("status")} style={sel()}>
              <option value="Prospect">Prospect</option>
              <option value="Interested">Interested</option>
              <option value="Negotiating">Negotiating</option>
              <option value="Active">Active</option>
            </select>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Assign unit (optional — vacant only)</label>
            <select value={form.unitId} onChange={set("unitId")} style={sel()}>
              <option value="">No unit assigned yet</option>
              {UNITS.filter(u => u.status==="vacant").map(u => {
                const p = PROJECTS.find(pr => pr.id===u.projectId);
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
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={submit} icon="ti-user-plus">Add client</Button>
        </div>
      </div>
    </div>
  );
}

export function Topbar({ title, sub }) {
  const [showAddClient, setShowAddClient] = useState(false);

  return (
    <>
      <header className="h-[54px] bg-white border-b border-gray-200 shadow-sm flex items-center gap-3 px-5 shrink-0">
        <div className="flex-1">
          <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</h1>
          {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        </div>

        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-52">
          <i className="ti ti-search text-gray-400 text-[13px]" aria-hidden />
          <input placeholder="Search clients, units…"
            className="bg-transparent border-none outline-none text-[12px] text-gray-700 placeholder:text-gray-400 w-full" />
        </div>

        <div className="relative w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
          <i className="ti ti-bell text-gray-600 text-[15px]" aria-hidden />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </div>

        <Button size="sm" icon="ti-plus" onClick={() => setShowAddClient(true)}>Add client</Button>
      </header>

      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} />}
    </>
  );
}