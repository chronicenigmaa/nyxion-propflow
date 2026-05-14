import { useState, useRef } from "react";
import { Card, PanelHead, Pill, Alert, Avatar } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt } from "../lib/utils.js";
import {
  PROJECTS as DEMO_PROJECTS,
  UNITS as DEMO_UNITS,
  CLIENTS,
} from "../data/demo.js";

const TYPE_LABELS = { residential:"Residential", commercial:"Commercial", mixed:"Mixed-use" };
const TYPE_COLORS = { residential:"blue", commercial:"green", mixed:"purple" };

const sel = (err) => ({
  height:40, width:"100%", borderRadius:8, border:`1px solid ${err?"#E02424":"#D1D5DB"}`,
  padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff",
});

// ─── Shared modal shell ───────────────────────────────────────────────────────
function Modal({ title, sub, onClose, children, footer, wide }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:wide?600:500, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
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

// ─── Add Project Modal ────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name:"", type:"residential", city:"", address:"", floors:"", totalUnits:"", description:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name      = "Project name is required";
    if (!form.city.trim())    e.city      = "City is required";
    if (!form.address.trim()) e.address   = "Address is required";
    if (!form.floors || isNaN(form.floors) || Number(form.floors) < 1)           e.floors     = "Enter number of floors";
    if (!form.totalUnits || isNaN(form.totalUnits) || Number(form.totalUnits) < 1) e.totalUnits = "Enter total units";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onAdd({ ...form, id:"P_NEW_"+Date.now(), floors:Number(form.floors), totalUnits:Number(form.totalUnits), completionYear:new Date().getFullYear(), status:"active", color:"#1C64F2" });
    onClose();
  };

  return (
    <Modal title="Add new project" sub="Building or development to manage" onClose={onClose} wide
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={submit} icon="ti-building-plus">Add project</Button></>}>
      <Input label="Project / building name" value={form.name} onChange={set("name")} placeholder="e.g. DHA Residency Tower Block B" error={errors.name} icon="ti-building" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Type</label>
          <select value={form.type} onChange={set("type")} style={sel(false)}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed-use</option>
          </select>
        </div>
        <Input label="City" value={form.city} onChange={set("city")} placeholder="e.g. Lahore" error={errors.city} />
      </div>
      <Input label="Full address" value={form.address} onChange={set("address")} placeholder="e.g. DHA Phase 6, Main Boulevard, Lahore" error={errors.address} icon="ti-map-pin" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Input label="Number of floors" value={form.floors} onChange={set("floors")} placeholder="e.g. 12" error={errors.floors} icon="ti-stairs" />
        <Input label="Total units" value={form.totalUnits} onChange={set("totalUnits")} placeholder="e.g. 48" error={errors.totalUnits} icon="ti-home" />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Description (optional)</label>
        <textarea value={form.description} onChange={set("description")} placeholder="Brief description…" rows={2}
          style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"vertical" }}
          onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
          onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
        />
      </div>
    </Modal>
  );
}

// ─── Add Unit Modal (inline, no need to go to Units page) ─────────────────────
function AddUnitModal({ projectId, onClose, onAdd }) {
  const [form, setForm] = useState({
    floor:"", unitNo:"", type:"apartment", bedrooms:"", bathrooms:"",
    size:"", rent:"", salePrice:"", purpose:"rent", description:"",
  });
  const [images, setImages]   = useState([]);
  const [floorPlan, setFloorPlan] = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const imgRef = useRef();
  const fpRef  = useRef();
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImages = (e) => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setImages(prev => [...prev, ev.target.result]);
      r.readAsDataURL(file);
    });
  };

  const handleFloorPlan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => setFloorPlan(ev.target.result);
    r.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.floor || isNaN(form.floor)) e.floor = "Enter floor number";
    if (!form.unitNo.trim())              e.unitNo = "Enter unit number";
    if ((form.purpose==="rent"||form.purpose==="both") && (!form.rent||isNaN(form.rent)))           e.rent = "Enter monthly rent";
    if ((form.purpose==="sale"||form.purpose==="both") && (!form.salePrice||isNaN(form.salePrice))) e.salePrice = "Enter sale price";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    onAdd({
      id: "U_NEW_"+Date.now(), projectId,
      floor: Number(form.floor), unitNo: form.unitNo, type: form.type,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      size: form.size||undefined,
      rent: form.rent ? Number(form.rent) : 0,
      salePrice: form.salePrice ? Number(form.salePrice) : 0,
      purpose: form.purpose, status:"vacant",
      description: form.description, images, floorPlan,
    });
    onClose();
  };

  return (
    <Modal title="Add unit" sub="Add unit to this project" onClose={onClose} wide
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={submit} icon="ti-home-plus">Add unit</Button></>}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Input label="Floor" value={form.floor} onChange={set("floor")} placeholder="e.g. 3" error={errors.floor} icon="ti-stairs" />
        <Input label="Unit no." value={form.unitNo} onChange={set("unitNo")} placeholder="e.g. 301" error={errors.unitNo} />
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Type</label>
          <select value={form.type} onChange={set("type")} style={sel(false)}>
            <option value="apartment">Apartment</option>
            <option value="office">Office</option>
            <option value="retail">Retail / Shop</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Input label="Bedrooms" value={form.bedrooms} onChange={set("bedrooms")} placeholder="e.g. 3" icon="ti-bed" />
        <Input label="Bathrooms" value={form.bathrooms} onChange={set("bathrooms")} placeholder="e.g. 2" icon="ti-droplet" />
        <Input label="Size" value={form.size} onChange={set("size")} placeholder="e.g. 1,650 sqft" icon="ti-ruler" />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Listing purpose</label>
        <div style={{ display:"flex", gap:8 }}>
          {[["rent","For rent"],["sale","For sale"],["both","Rent & sale"]].map(([v,l]) => (
            <button key={v} type="button" onClick={() => setForm(f => ({ ...f, purpose:v }))}
              style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${form.purpose===v?"#1C64F2":"#D1D5DB"}`,
                background:form.purpose===v?"#EBF5FF":"#fff", color:form.purpose===v?"#1C64F2":"#374151",
                fontSize:13, fontWeight:form.purpose===v?600:400, cursor:"pointer", fontFamily:"inherit" }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {(form.purpose==="rent"||form.purpose==="both") && <Input label="Monthly rent (Rs.)" value={form.rent} onChange={set("rent")} placeholder="120000" error={errors.rent} icon="ti-coin-rupee" />}
        {(form.purpose==="sale"||form.purpose==="both") && <Input label="Sale price (Rs.)" value={form.salePrice} onChange={set("salePrice")} placeholder="18500000" error={errors.salePrice} icon="ti-tag" />}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Description (optional)</label>
        <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Key features, finishes, views…"
          style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
          onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
          onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
        />
      </div>
      {/* Photos */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Photos (optional)</label>
        <input ref={imgRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display:"none" }} />
        <button type="button" onClick={() => imgRef.current.click()}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", border:"2px dashed #D1D5DB", borderRadius:10, background:"#F9FAFB", cursor:"pointer", fontSize:13, color:"#6B7280" }}>
          <i className="ti ti-photo-plus" style={{ fontSize:17 }} aria-hidden /> Upload photos
        </button>
        {images.length > 0 && (
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {images.map((img,i) => (
              <div key={i} style={{ position:"relative", width:64, height:64 }}>
                <img src={img} alt="" style={{ width:64, height:64, objectFit:"cover", borderRadius:8, border:"1px solid #E5E7EB" }} />
                <button type="button" onClick={() => setImages(prev => prev.filter((_,idx) => idx!==i))}
                  style={{ position:"absolute", top:-5, right:-5, width:16, height:16, background:"#E02424", border:"none", borderRadius:"50%", cursor:"pointer", color:"#fff", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="ti ti-x" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Floor plan */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Floor plan (optional)</label>
        <input ref={fpRef} type="file" accept="image/*,.pdf" onChange={handleFloorPlan} style={{ display:"none" }} />
        {floorPlan ? (
          <div style={{ position:"relative" }}>
            <img src={floorPlan} alt="Floor plan" style={{ width:"100%", maxHeight:140, objectFit:"contain", borderRadius:10, border:"1px solid #E5E7EB", background:"#F9FAFB" }} />
            <button type="button" onClick={() => setFloorPlan(null)}
              style={{ position:"absolute", top:8, right:8, background:"#E02424", border:"none", borderRadius:6, cursor:"pointer", color:"#fff", padding:"3px 8px", fontSize:12 }}>Remove</button>
          </div>
        ) : (
          <button type="button" onClick={() => fpRef.current.click()}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", border:"2px dashed #D1D5DB", borderRadius:10, background:"#F9FAFB", cursor:"pointer", fontSize:13, color:"#6B7280" }}>
            <i className="ti ti-blueprint" style={{ fontSize:17 }} aria-hidden /> Upload floor plan
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─── Assign Client Modal ──────────────────────────────────────────────────────
function AssignClientModal({ unit, project, onClose, onAssign }) {
  const [clientId, setClientId] = useState("");
  const [rentAmount, setRentAmount] = useState(String(unit.rent||""));
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!clientId) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onAssign(unit.id, clientId, Number(rentAmount));
    onClose();
  };

  const unassignedClients = CLIENTS.filter(c => !c.unitId || c.unitId === unit.id);

  return (
    <Modal title="Assign client to unit" sub={`${project?.name} — Unit ${unit.unitNo}`} onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={submit} icon="ti-user-check" disabled={!clientId}>Assign client</Button></>}>
      <div style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, padding:"12px 14px" }}>
        <div style={{ fontSize:12, color:"#6B7280", marginBottom:2 }}>Unit</div>
        <div style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{project?.name} — Unit {unit.unitNo}</div>
        <div style={{ fontSize:12, color:"#6B7280" }}>Floor {unit.floor} · {unit.type}</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Select client</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={sel(!clientId && false)}>
          <option value="">Choose client…</option>
          {unassignedClients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.city}</option>)}
        </select>
      </div>
      <Input label="Monthly rent (Rs.)" value={rentAmount} onChange={e => setRentAmount(e.target.value)} placeholder="e.g. 120000" icon="ti-coin-rupee" />
      <div style={{ fontSize:12, color:"#9CA3AF" }}>
        This will mark the unit as leased and assign the client to it.
      </div>
    </Modal>
  );
}

// ─── Unit row inside project detail ──────────────────────────────────────────
function UnitRow({ unit, project, onAssignClient }) {
  const tenant  = CLIENTS.find(c => c.unitId === unit.id);
  const typeIcon = { apartment:"ti-home", office:"ti-briefcase", retail:"ti-shopping-bag", commercial:"ti-building-store" }[unit.type] || "ti-home";
  const [showImgs, setShowImgs] = useState(false);
  const [imgIdx, setImgIdx]     = useState(0);
  const imgs = unit.images || [];

  return (
    <div>
      <div className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors">
        <div className="w-16 text-center shrink-0">
          <div className="text-[10px] text-gray-400 font-mono">Floor</div>
          <div className="text-[14px] font-bold text-gray-700 font-mono">{unit.floor}</div>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:unit.status==="leased"?"#EBF5FF":"#F3F4F6" }}>
          <i className={`ti ${typeIcon} text-[14px]`} style={{ color:unit.status==="leased"?"#1C64F2":"#9CA3AF" }} aria-hidden />
        </div>
        {/* Image thumbnail */}
        {imgs.length > 0 && (
          <div onClick={() => setShowImgs(!showImgs)} className="w-10 h-10 rounded-lg overflow-hidden cursor-pointer shrink-0 border border-gray-200 hover:border-brand-500 transition-colors">
            <img src={imgs[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-gray-900">Unit {unit.unitNo}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {unit.type.charAt(0).toUpperCase()+unit.type.slice(1)}
            {unit.bedrooms ? ` · ${unit.bedrooms} bed` : ""}
            {unit.size ? ` · ${unit.size}` : ""}
          </div>
        </div>
        {tenant ? (
          <div className="text-right mr-2">
            <div className="text-[12px] font-semibold text-gray-800">{tenant.name}</div>
            <div className="text-[11px] text-gray-400">Tenant</div>
          </div>
        ) : (
          <button onClick={() => onAssignClient(unit)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-brand-500 border border-blue-200 rounded-lg text-[11px] font-semibold hover:bg-blue-100 transition-colors mr-2">
            <i className="ti ti-user-plus text-[12px]" aria-hidden /> Assign client
          </button>
        )}
        <div className="text-right">
          <div className="text-[13px] font-bold font-mono text-brand-500">{fmt(unit.rent)}</div>
          <div className="text-[10px] text-gray-400">/month</div>
        </div>
        <Pill color={unit.status==="leased"?"green":"amber"}>{unit.status}</Pill>
      </div>

      {/* Expanded image gallery */}
      {showImgs && imgs.length > 0 && (
        <div style={{ padding:"12px 16px", background:"#F9FAFB", borderBottom:"1px solid #E5E7EB" }}>
          <div style={{ position:"relative", height:180, borderRadius:10, overflow:"hidden", marginBottom:8 }}>
            <img src={imgs[imgIdx]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            {imgs.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i-1+imgs.length)%imgs.length)}
                  style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:"50%", background:"rgba(0,0,0,0.4)", border:"none", cursor:"pointer", color:"#fff", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="ti ti-chevron-left" />
                </button>
                <button onClick={() => setImgIdx(i => (i+1)%imgs.length)}
                  style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:"50%", background:"rgba(0,0,0,0.4)", border:"none", cursor:"pointer", color:"#fff", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="ti ti-chevron-right" />
                </button>
                <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.45)", color:"#fff", fontSize:10, padding:"2px 8px", borderRadius:20 }}>
                  {imgIdx+1} / {imgs.length}
                </div>
              </>
            )}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {imgs.map((img,i) => (
              <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                style={{ width:48, height:40, objectFit:"cover", borderRadius:6, cursor:"pointer", border:`2px solid ${i===imgIdx?"#1C64F2":"#E5E7EB"}` }} />
            ))}
          </div>
          {unit.description && <div style={{ fontSize:13, color:"#374151", marginTop:8, lineHeight:1.5 }}>{unit.description}</div>}
        </div>
      )}
    </div>
  );
}

// ─── Project Detail ───────────────────────────────────────────────────────────
function ProjectDetail({ projectId, onBack }) {
  const project = DEMO_PROJECTS.find(p => p.id === projectId);
  const [units, setUnits]               = useState(DEMO_UNITS.filter(u => u.projectId === projectId));
  const [expandedFloors, setExpandedFloors] = useState({});
  const [showAddUnit, setShowAddUnit]   = useState(false);
  const [assignUnit, setAssignUnit]     = useState(null);

  const floors   = [...new Set(units.map(u => u.floor))].sort((a,b) => a-b);
  const leased   = units.filter(u => u.status==="leased").length;
  const occupancy = units.length ? Math.round((leased/units.length)*100) : 0;
  const revenue  = units.filter(u => u.status==="leased").reduce((a,u) => a+u.rent, 0);

  const toggleFloor = f => setExpandedFloors(prev => ({ ...prev, [f]:!prev[f] }));

  const handleAddUnit = (unit) => setUnits(prev => [...prev, unit]);

  const handleAssign = (unitId, clientId, rentAmount) => {
    setUnits(prev => prev.map(u => u.id === unitId ? { ...u, status:"leased", rent:rentAmount||u.rent } : u));
  };

  if (!project) return null;

  return (
    <div className="p-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-4 hover:text-gray-700">
        <i className="ti ti-arrow-left text-[15px]" aria-hidden /> Back to projects
      </button>

      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background:project.color }} />
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            <Pill color={TYPE_COLORS[project.type]}>{TYPE_LABELS[project.type]}</Pill>
          </div>
          <div className="text-[13px] text-gray-400 flex items-center gap-1 ml-5">
            <i className="ti ti-map-pin text-[12px]" aria-hidden />{project.address}
          </div>
        </div>
        <Button icon="ti-plus" onClick={() => setShowAddUnit(true)}>Add unit</Button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          [project.floors,      "Total floors",  "ti-stairs",     "#1C64F2","#EBF5FF"],
          [project.totalUnits,  "Total units",   "ti-home",       "#057A55","#F3FAF7"],
          [`${occupancy}%`,     "Occupancy",     "ti-chart-pie",  "#6C2BD9","#F5F3FF"],
          [fmt(revenue),        "Monthly income","ti-coin-rupee", "#B45309","#FFFBEB"],
        ].map(([v,l,ic,fg,bg]) => (
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:bg }}>
                <i className={`ti ${ic} text-[13px]`} style={{ color:fg }} aria-hidden />
              </div>
              <span className="text-[11px] text-gray-400">{l}</span>
            </div>
            <div className="text-lg font-bold text-gray-900 font-mono">{v}</div>
          </div>
        ))}
      </div>

      <Card>
        <PanelHead icon="ti-building" title="Units by floor" sub={`${units.length} units · click floor to expand · click photo thumbnail to view images`} />
        <div className="px-4">
          {units.length === 0 && (
            <div className="py-10 text-center">
              <i className="ti ti-home-off text-3xl text-gray-200 mb-2" aria-hidden />
              <div className="text-[13px] text-gray-400">No units yet — click Add unit to get started.</div>
            </div>
          )}
          {floors.map(floor => {
            const floorUnits  = units.filter(u => u.floor === floor);
            const isOpen      = expandedFloors[floor];
            const floorLeased = floorUnits.filter(u => u.status==="leased").length;
            return (
              <div key={floor} className="border-b border-gray-100 last:border-0">
                <div onClick={() => toggleFloor(floor)}
                  className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 -mx-4 px-4 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-bold text-gray-600 font-mono">{floor}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-gray-800">Floor {floor}{floor===1?" · Ground":""}</div>
                    <div className="text-[11px] text-gray-400">{floorUnits.length} units · {floorLeased} leased</div>
                  </div>
                  <div className="flex gap-1.5 mr-2">
                    {floorUnits.map(u => (
                      <div key={u.id} className="w-2 h-2 rounded-full" style={{ background:u.status==="leased"?"#057A55":"#F59E0B" }} />
                    ))}
                  </div>
                  <i className={`ti ${isOpen?"ti-chevron-up":"ti-chevron-down"} text-gray-400 text-[15px]`} aria-hidden />
                </div>
                {isOpen && (
                  <div className="pb-1">
                    {floorUnits.map(u => (
                      <UnitRow key={u.id} unit={u} project={project} onAssignClient={setAssignUnit} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {showAddUnit && (
        <AddUnitModal projectId={projectId} onClose={() => setShowAddUnit(false)} onAdd={handleAddUnit} />
      )}
      {assignUnit && (
        <AssignClientModal unit={assignUnit} project={project} onClose={() => setAssignUnit(null)} onAssign={handleAssign} />
      )}
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, units, onClick }) {
  const leased   = units.filter(u => u.status==="leased").length;
  const vacant   = units.filter(u => u.status==="vacant").length;
  const occupancy = units.length ? Math.round((leased/units.length)*100) : 0;
  const revenue  = units.filter(u => u.status==="leased").reduce((a,u) => a+u.rent, 0);

  return (
    <div onClick={() => onClick(project.id)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-md transition-all shadow-sm"
      style={{ borderTop:`4px solid ${project.color}` }}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[15px] font-semibold text-gray-900">{project.name}</div>
            <div className="text-[12px] text-gray-400 mt-0.5 flex items-center gap-1">
              <i className="ti ti-map-pin text-[12px]" aria-hidden />{project.address}
            </div>
          </div>
          <Pill color={TYPE_COLORS[project.type]}>{TYPE_LABELS[project.type]}</Pill>
        </div>
        <div className="text-[12px] text-gray-500 mb-4 leading-relaxed line-clamp-2">{project.description}</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[[project.floors,"Floors","ti-stairs"],[project.totalUnits,"Units","ti-home"],[fmt(revenue),"Monthly","ti-coin-rupee"]].map(([v,l,ic]) => (
            <div key={l} className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
              <div className="text-[13px] font-bold text-gray-900 font-mono">{v}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-gray-400">Occupancy</span>
          <span className="text-[11px] font-bold font-mono" style={{ color:project.color }}>{occupancy}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-full rounded-full" style={{ width:`${occupancy}%`, background:project.color }} />
        </div>
        <div className="flex gap-3 mt-2">
          <span className="text-[11px] text-emerald-600 font-medium">{leased} leased</span>
          <span className="text-[11px] text-amber-600 font-medium">{vacant} vacant</span>
        </div>
      </div>
    </div>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────
export function ProjectsPage() {
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [units, setUnits]       = useState(DEMO_UNITS);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [filter, setFilter]         = useState("all");

  if (selectedId) return <ProjectDetail projectId={selectedId} onBack={() => setSelectedId(null)} />;

  const filtered     = projects.filter(p => filter==="all" || p.type===filter);
  const totalUnits   = units.length;
  const leasedUnits  = units.filter(u => u.status==="leased").length;
  const totalRevenue = units.filter(u => u.status==="leased").reduce((a,u) => a+u.rent, 0);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5">
          {[["all","All"],["residential","Residential"],["commercial","Commercial"],["mixed","Mixed-use"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>
              {l}
            </button>
          ))}
        </div>
        <Button icon="ti-plus" onClick={() => setShowModal(true)}>Add project</Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [projects.length,                   "Total projects",  "#1C64F2","#EBF5FF","ti-building"   ],
          [`${leasedUnits}/${totalUnits}`,     "Units leased",   "#057A55","#F3FAF7","ti-home"        ],
          [fmt(totalRevenue),                  "Monthly revenue","#B45309","#FFFBEB","ti-coin-rupee"  ],
        ].map(([v,l,fg,bg,ic]) => (
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:bg }}>
                <i className={`ti ${ic} text-[14px]`} style={{ color:fg }} aria-hidden />
              </div>
              <span className="text-[12px] text-gray-400">{l}</span>
            </div>
            <div className="text-xl font-bold text-gray-900 font-mono">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(p => (
          <ProjectCard key={p.id} project={p} units={units.filter(u => u.projectId===p.id)} onClick={setSelectedId} />
        ))}
      </div>

      {showModal && (
        <AddProjectModal onClose={() => setShowModal(false)} onAdd={p => setProjects(prev => [...prev, p])} />
      )}
    </div>
  );
}