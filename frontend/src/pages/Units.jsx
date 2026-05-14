import { useState, useRef } from "react";
import { Card, Pill } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt } from "../lib/utils.js";
import { UNITS as DEMO_UNITS, PROJECTS, CLIENTS } from "../data/demo.js";

const PURPOSE_STYLES = {
  rent: { color:"blue",   label:"For rent"    },
  sale: { color:"purple", label:"For sale"    },
  both: { color:"green",  label:"Rent & sale" },
};

const sel = (err) => ({
  height:40, width:"100%", borderRadius:8, border:`1px solid ${err?"#E02424":"#D1D5DB"}`,
  padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff",
});

// ─── Add Unit Modal ───────────────────────────────────────────────────────────
function AddUnitModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    projectId:"", floor:"", unitNo:"", type:"apartment",
    bedrooms:"", bathrooms:"", size:"", rent:"", salePrice:"",
    purpose:"rent", description:"",
  });
  const [images, setImages]     = useState([]);
  const [floorPlan, setFloorPlan] = useState(null);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const imgRef  = useRef();
  const fpRef   = useRef();
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleFloorPlan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFloorPlan(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.projectId) e.projectId = "Select a project";
    if (!form.floor || isNaN(form.floor)) e.floor = "Enter floor number";
    if (!form.unitNo.trim()) e.unitNo = "Enter unit number";
    if ((form.purpose === "rent" || form.purpose === "both") && (!form.rent || isNaN(form.rent))) e.rent = "Enter monthly rent";
    if ((form.purpose === "sale" || form.purpose === "both") && (!form.salePrice || isNaN(form.salePrice))) e.salePrice = "Enter sale price";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    onAdd({
      id: "U_NEW_" + Date.now(),
      projectId: form.projectId,
      floor: Number(form.floor),
      unitNo: form.unitNo,
      type: form.type,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      size: form.size || undefined,
      rent: form.rent ? Number(form.rent) : 0,
      salePrice: form.salePrice ? Number(form.salePrice) : 0,
      purpose: form.purpose,
      status: "vacant",
      description: form.description,
      images: images,
      floorPlan: floorPlan,
    });
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:560, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>Add new unit</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Add unit details, images, and floor plan</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>

        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          {/* Project */}
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Project / building</label>
            <select value={form.projectId} onChange={set("projectId")} style={sel(errors.projectId)}>
              <option value="">Select project…</option>
              {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
            </select>
            {errors.projectId && <span style={{ fontSize:12, color:"#E02424" }}>{errors.projectId}</span>}
          </div>

          {/* Floor + Unit no + Type */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <Input label="Floor number" value={form.floor} onChange={set("floor")} placeholder="e.g. 3" error={errors.floor} icon="ti-stairs" />
            <Input label="Unit number" value={form.unitNo} onChange={set("unitNo")} placeholder="e.g. 301" error={errors.unitNo} />
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

          {/* Beds + Baths + Size */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <Input label="Bedrooms" value={form.bedrooms} onChange={set("bedrooms")} placeholder="e.g. 3" icon="ti-bed" />
            <Input label="Bathrooms" value={form.bathrooms} onChange={set("bathrooms")} placeholder="e.g. 2" icon="ti-droplet" />
            <Input label="Size (sqft)" value={form.size} onChange={set("size")} placeholder="e.g. 1,650 sqft" icon="ti-ruler" />
          </div>

          {/* Purpose */}
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Listing purpose</label>
            <div style={{ display:"flex", gap:8 }}>
              {[["rent","For rent"],["sale","For sale"],["both","Rent & sale"]].map(([v,l]) => (
                <button key={v} type="button" onClick={() => setForm(f => ({ ...f, purpose:v }))}
                  style={{ flex:1, padding:"8px 12px", borderRadius:8, border:`1px solid ${form.purpose===v?"#1C64F2":"#D1D5DB"}`,
                    background:form.purpose===v?"#EBF5FF":"#fff", color:form.purpose===v?"#1C64F2":"#374151",
                    fontSize:13, fontWeight:form.purpose===v?600:400, cursor:"pointer", fontFamily:"inherit" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {(form.purpose==="rent"||form.purpose==="both") && (
              <Input label="Monthly rent (Rs.)" value={form.rent} onChange={set("rent")} placeholder="e.g. 120000" error={errors.rent} icon="ti-coin-rupee" />
            )}
            {(form.purpose==="sale"||form.purpose==="both") && (
              <Input label="Sale price (Rs.)" value={form.salePrice} onChange={set("salePrice")} placeholder="e.g. 18500000" error={errors.salePrice} icon="ti-tag" />
            )}
          </div>

          {/* Description */}
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Description (optional)</label>
            <textarea value={form.description} onChange={set("description")} rows={2}
              placeholder="Key features, finishes, views, parking…"
              style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
              onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
              onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
            />
          </div>

          {/* Images */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Unit photos (optional)</label>
            <input ref={imgRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display:"none" }} />
            <button type="button" onClick={() => imgRef.current.click()}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"2px dashed #D1D5DB", borderRadius:10, background:"#F9FAFB", cursor:"pointer", fontSize:13, color:"#6B7280" }}>
              <i className="ti ti-photo-plus" style={{ fontSize:18 }} aria-hidden />
              Click to upload photos (JPG, PNG)
            </button>
            {images.length > 0 && (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position:"relative", width:72, height:72 }}>
                    <img src={img} alt="" style={{ width:72, height:72, objectFit:"cover", borderRadius:8, border:"1px solid #E5E7EB" }} />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_,idx) => idx!==i))}
                      style={{ position:"absolute", top:-6, right:-6, width:18, height:18, background:"#E02424", border:"none", borderRadius:"50%", cursor:"pointer", color:"#fff", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <i className="ti ti-x" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Floor plan */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Floor plan (optional)</label>
            <input ref={fpRef} type="file" accept="image/*,.pdf" onChange={handleFloorPlan} style={{ display:"none" }} />
            {floorPlan ? (
              <div style={{ position:"relative", display:"inline-block" }}>
                <img src={floorPlan} alt="Floor plan" style={{ width:"100%", maxHeight:160, objectFit:"contain", borderRadius:10, border:"1px solid #E5E7EB", background:"#F9FAFB" }} />
                <button type="button" onClick={() => setFloorPlan(null)}
                  style={{ position:"absolute", top:8, right:8, background:"#E02424", border:"none", borderRadius:6, cursor:"pointer", color:"#fff", padding:"4px 8px", fontSize:12 }}>
                  Remove
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fpRef.current.click()}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:"2px dashed #D1D5DB", borderRadius:10, background:"#F9FAFB", cursor:"pointer", fontSize:13, color:"#6B7280" }}>
                <i className="ti ti-blueprint" style={{ fontSize:18 }} aria-hidden />
                Upload floor plan (image or PDF)
              </button>
            )}
          </div>
        </div>

        <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={submit} icon="ti-home-plus">Add unit</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Unit Detail Modal ────────────────────────────────────────────────────────
function UnitModal({ unit, project, tenant, onClose }) {
  const [imgIdx, setImgIdx]   = useState(0);
  const [showFP, setShowFP]   = useState(false);
  const imgs = unit.images || [];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:680, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.22)" }}
        onClick={e => e.stopPropagation()}>

        {/* Image gallery */}
        {imgs.length > 0 && !showFP && (
          <div style={{ position:"relative", height:280, background:"#F3F4F6", borderRadius:"16px 16px 0 0", overflow:"hidden" }}>
            <img src={imgs[imgIdx]} alt={`Unit ${unit.unitNo}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />

            {/* Prev / Next buttons */}
            {imgs.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i-1+imgs.length)%imgs.length)}
                  style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.4)", border:"none", cursor:"pointer", color:"#fff", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="ti ti-chevron-left" aria-hidden />
                </button>
                <button onClick={() => setImgIdx(i => (i+1)%imgs.length)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.4)", border:"none", cursor:"pointer", color:"#fff", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className="ti ti-chevron-right" aria-hidden />
                </button>
                {/* Dots */}
                <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
                  {imgs.map((_,i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      style={{ width:i===imgIdx?20:8, height:8, borderRadius:4, background:i===imgIdx?"#fff":"rgba(255,255,255,0.5)", border:"none", cursor:"pointer", padding:0, transition:"all 0.2s" }} />
                  ))}
                </div>
              </>
            )}

            {/* Image count */}
            <div style={{ position:"absolute", top:12, left:12, background:"rgba(0,0,0,0.5)", color:"#fff", fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20 }}>
              {imgIdx+1} / {imgs.length}
            </div>

            {/* Status badges */}
            <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:6 }}>
              <Pill color={PURPOSE_STYLES[unit.purpose]?.color||"blue"}>{PURPOSE_STYLES[unit.purpose]?.label}</Pill>
              <Pill color={unit.status==="leased"?"green":"amber"}>{unit.status}</Pill>
            </div>

            {/* Floor plan toggle */}
            {unit.floorPlan && (
              <button onClick={() => setShowFP(true)}
                style={{ position:"absolute", bottom:12, right:12, display:"flex", alignItems:"center", gap:6, background:"rgba(0,0,0,0.55)", color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>
                <i className="ti ti-blueprint" style={{ fontSize:14 }} aria-hidden /> Floor plan
              </button>
            )}
          </div>
        )}

        {/* Floor plan view */}
        {showFP && unit.floorPlan && (
          <div style={{ position:"relative", background:"#F9FAFB", borderRadius:"16px 16px 0 0", padding:16 }}>
            <img src={unit.floorPlan} alt="Floor plan" style={{ width:"100%", maxHeight:280, objectFit:"contain", borderRadius:10 }} />
            <button onClick={() => setShowFP(false)}
              style={{ position:"absolute", top:24, right:24, background:"rgba(0,0,0,0.5)", color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>
              Back to photos
            </button>
          </div>
        )}

        {/* No images placeholder */}
        {imgs.length === 0 && (
          <div style={{ height:140, background:"#F3F4F6", borderRadius:"16px 16px 0 0", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ textAlign:"center" }}>
              <i className="ti ti-home" style={{ fontSize:36, color:"#D1D5DB" }} aria-hidden />
              <div style={{ fontSize:12, color:"#9CA3AF", marginTop:6 }}>No photos uploaded</div>
            </div>
          </div>
        )}

        <div style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
            <div>
              <div style={{ fontSize:18, fontWeight:600, color:"#111827" }}>{project?.name} — Unit {unit.unitNo}</div>
              <div style={{ fontSize:13, color:"#6B7280", marginTop:3 }}>Floor {unit.floor} · {unit.type.charAt(0).toUpperCase()+unit.type.slice(1)}</div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:22, lineHeight:1 }}>
              <i className="ti ti-x" aria-hidden />
            </button>
          </div>

          {/* Specs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
            {[
              [unit.size||"–",                                "Size",     "ti-ruler"  ],
              [unit.bedrooms?`${unit.bedrooms} bed`:"–",     "Bedrooms", "ti-bed"    ],
              [unit.bathrooms?`${unit.bathrooms} bath`:"–",  "Bathrooms","ti-droplet"],
              [`Floor ${unit.floor}`,                         "Floor",    "ti-stairs" ],
            ].map(([v,l,ic]) => (
              <div key={l} style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, padding:"12px", textAlign:"center" }}>
                <i className={`ti ${ic}`} style={{ fontSize:18, color:"#9CA3AF", marginBottom:6, display:"block" }} aria-hidden />
                <div style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{v}</div>
                <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
            {(unit.purpose==="rent"||unit.purpose==="both") && (
              <div style={{ background:"#EBF5FF", border:"1px solid #BFDBFE", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"#1E40AF", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Monthly rent</div>
                <div style={{ fontSize:22, fontWeight:700, color:"#1C64F2", fontFamily:"monospace" }}>{fmt(unit.rent)}</div>
              </div>
            )}
            {(unit.purpose==="sale"||unit.purpose==="both") && (
              <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"#4C1D95", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Sale price</div>
                <div style={{ fontSize:22, fontWeight:700, color:"#6C2BD9", fontFamily:"monospace" }}>{fmt(unit.salePrice)}</div>
              </div>
            )}
          </div>

          {unit.description && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Description</div>
              <div style={{ fontSize:14, color:"#374151", lineHeight:1.65 }}>{unit.description}</div>
            </div>
          )}

          {tenant && (
            <div style={{ background:"#F3FAF7", border:"1px solid #A7F3D0", borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
              <i className="ti ti-user-check" style={{ fontSize:16, color:"#057A55" }} aria-hidden />
              <div>
                <div style={{ fontSize:12, color:"#065F46", fontWeight:600 }}>Currently leased to</div>
                <div style={{ fontSize:13, color:"#065F46" }}>{tenant.name} · {tenant.phone}</div>
              </div>
            </div>
          )}

          {/* Thumbnail strip */}
          {imgs.length > 1 && (
            <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
              {imgs.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => { setImgIdx(i); setShowFP(false); }}
                  style={{ width:60, height:50, objectFit:"cover", borderRadius:8, cursor:"pointer", border:`2px solid ${i===imgIdx?"#1C64F2":"#E5E7EB"}`, transition:"border 0.15s" }} />
              ))}
              {unit.floorPlan && (
                <div onClick={() => setShowFP(true)}
                  style={{ width:60, height:50, borderRadius:8, cursor:"pointer", border:`2px solid ${showFP?"#1C64F2":"#E5E7EB"}`, background:"#F3F4F6", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2 }}>
                  <i className="ti ti-blueprint" style={{ fontSize:14, color:"#6B7280" }} aria-hidden />
                  <span style={{ fontSize:9, color:"#9CA3AF" }}>Plan</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Units Page ───────────────────────────────────────────────────────────────
export function UnitsPage() {
  const [units, setUnits]               = useState(DEMO_UNITS);
  const [projectFilter, setProjectFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selected, setSelected]           = useState(null);
  const [showAdd, setShowAdd]             = useState(false);

  const filtered = units.filter(u => {
    const matchP  = projectFilter === "all" || u.projectId === projectFilter;
    const matchPu = purposeFilter === "all" || u.purpose === purposeFilter;
    const matchS  = statusFilter === "all"  || u.status === statusFilter;
    return matchP && matchPu && matchS;
  });

  const selUnit    = selected ? units.find(u => u.id === selected) : null;
  const selProject = selUnit  ? PROJECTS.find(p => p.id === selUnit.projectId) : null;
  const selTenant  = selUnit  ? CLIENTS.find(c => c.unitId === selUnit.id) : null;

  return (
    <div className="p-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          [units.filter(u=>u.status==="leased").length,                    "Leased",      "#057A55","#F3FAF7","ti-home-check"],
          [units.filter(u=>u.status==="vacant").length,                    "Vacant",      "#B45309","#FFFBEB","ti-home-off"  ],
          [units.filter(u=>u.purpose==="sale"||u.purpose==="both").length, "For sale",    "#6C2BD9","#F5F3FF","ti-tag"       ],
          [units.filter(u=>u.purpose==="rent"||u.purpose==="both").length, "For rent",    "#1C64F2","#EBF5FF","ti-key"       ],
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

      {/* Filters + Add */}
      <div className="flex gap-3 mb-5 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Project</span>
            <select value={projectFilter} onChange={e=>setProjectFilter(e.target.value)}
              style={{ height:32, borderRadius:8, border:"1px solid #E5E7EB", padding:"0 10px", fontSize:12, color:"#374151", fontFamily:"inherit", outline:"none", background:"#fff", cursor:"pointer" }}>
              <option value="all">All</option>
              {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name.split(" ").slice(0,2).join(" ")}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Purpose</span>
            <select value={purposeFilter} onChange={e=>setPurposeFilter(e.target.value)}
              style={{ height:32, borderRadius:8, border:"1px solid #E5E7EB", padding:"0 10px", fontSize:12, color:"#374151", fontFamily:"inherit", outline:"none", background:"#fff", cursor:"pointer" }}>
              <option value="all">All</option>
              <option value="rent">For rent</option>
              <option value="sale">For sale</option>
              <option value="both">Rent & sale</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Status</span>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
              style={{ height:32, borderRadius:8, border:"1px solid #E5E7EB", padding:"0 10px", fontSize:12, color:"#374151", fontFamily:"inherit", outline:"none", background:"#fff", cursor:"pointer" }}>
              <option value="all">All</option>
              <option value="leased">Leased</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
        </div>
        <Button icon="ti-plus" onClick={() => setShowAdd(true)}>Add unit</Button>
      </div>

      {/* Unit grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(u => {
          const project = PROJECTS.find(p => p.id === u.projectId);
          const tenant  = CLIENTS.find(c => c.unitId === u.id);
          const img     = u.images?.[0];
          return (
            <div key={u.id} onClick={() => setSelected(u.id)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-md transition-all shadow-sm">
              {/* Image */}
              <div style={{ height:160, background:"#F3F4F6", position:"relative", overflow:"hidden" }}>
                {img
                  ? <img src={img} alt={`Unit ${u.unitNo}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <i className="ti ti-home text-gray-300 text-4xl" aria-hidden />
                      <span className="text-[11px] text-gray-400">No photos yet</span>
                    </div>
                }
                {u.images?.length > 1 && (
                  <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.5)", color:"#fff", fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20 }}>
                    +{u.images.length-1} photos
                  </div>
                )}
                {u.floorPlan && (
                  <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,0.5)", color:"#fff", fontSize:10, padding:"2px 7px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}>
                    <i className="ti ti-blueprint" style={{ fontSize:11 }} aria-hidden /> Floor plan
                  </div>
                )}
                <div style={{ position:"absolute", top:8, left:8 }}>
                  <Pill color={PURPOSE_STYLES[u.purpose]?.color||"blue"}>{PURPOSE_STYLES[u.purpose]?.label}</Pill>
                </div>
                <div style={{ position:"absolute", top:8, right:8 }}>
                  <Pill color={u.status==="leased"?"green":"amber"}>{u.status}</Pill>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="mb-2">
                  <div className="text-[14px] font-semibold text-gray-900">Unit {u.unitNo}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{project?.name} · Floor {u.floor}</div>
                </div>
                <div className="flex gap-3 mb-3 flex-wrap">
                  {u.bedrooms  && <span className="text-[12px] text-gray-500 flex items-center gap-1"><i className="ti ti-bed text-[12px]" aria-hidden />{u.bedrooms} bed</span>}
                  {u.bathrooms && <span className="text-[12px] text-gray-500 flex items-center gap-1"><i className="ti ti-droplet text-[12px]" aria-hidden />{u.bathrooms} bath</span>}
                  {u.size      && <span className="text-[12px] text-gray-500 flex items-center gap-1"><i className="ti ti-ruler text-[12px]" aria-hidden />{u.size}</span>}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {(u.purpose==="rent"||u.purpose==="both") && (
                    <div className="text-[13px] font-bold font-mono text-brand-500">{fmt(u.rent)}<span className="text-[10px] text-gray-400 font-normal">/mo</span></div>
                  )}
                  {(u.purpose==="sale"||u.purpose==="both") && (
                    <div className="text-[13px] font-bold font-mono text-purple-600">{fmt(u.salePrice)}</div>
                  )}
                </div>
                {tenant && (
                  <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <i className="ti ti-user-check text-[11px]" aria-hidden />{tenant.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center bg-white border border-gray-200 rounded-xl shadow-sm">
            <i className="ti ti-home-off text-4xl text-gray-300 mb-3" aria-hidden />
            <div className="text-[13px] text-gray-400">No units match your filters.</div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddUnitModal onClose={() => setShowAdd(false)} onAdd={u => setUnits(prev => [...prev, u])} />
      )}
      {selected && selUnit && (
        <UnitModal unit={selUnit} project={selProject} tenant={selTenant} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}