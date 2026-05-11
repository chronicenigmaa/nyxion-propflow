import { useState } from "react";
import { Card, PanelHead, Pill } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt } from "../lib/utils.js";
import { PROJECTS, UNITS, CLIENTS } from "../data/demo.js";

const TYPE_LABELS = { residential:"Residential", commercial:"Commercial", mixed:"Mixed-use" };
const TYPE_COLORS = { residential:"blue", commercial:"green", mixed:"purple" };

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
    if (!form.floors || isNaN(form.floors) || Number(form.floors) < 1)         e.floors     = "Enter number of floors";
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
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>Add new project</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Building or development to manage</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Project / building name" value={form.name} onChange={set("name")} placeholder="e.g. DHA Residency Tower Block B" error={errors.name} icon="ti-building" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Type</label>
              <select value={form.type} onChange={set("type")} style={{ height:40, borderRadius:8, border:"1px solid #D1D5DB", padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff" }}>
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
            <textarea value={form.description} onChange={set("description")} placeholder="Brief description of the project..." rows={3}
              style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"vertical", lineHeight:1.5 }}
              onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
              onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
            />
          </div>
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid #E5E7EB", display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={submit} icon="ti-plus">Add project</Button>
        </div>
      </div>
    </div>
  );
}

function UnitRow({ unit }) {
  const tenant = CLIENTS.find(c => c.unitId === unit.id);
  const typeIcon = { apartment:"ti-home", office:"ti-briefcase", retail:"ti-shopping-bag" }[unit.type] || "ti-home";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors">
      <div className="w-16 text-center">
        <div className="text-[10px] text-gray-400 font-mono">Floor</div>
        <div className="text-[13px] font-semibold text-gray-700 font-mono">{unit.floor}</div>
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:unit.status==="leased"?"#EBF5FF":"#F3F4F6" }}>
        <i className={`ti ${typeIcon} text-[14px]`} style={{ color:unit.status==="leased"?"#1C64F2":"#9CA3AF" }} aria-hidden />
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-medium text-gray-900">Unit {unit.unitNo}</div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          {unit.type.charAt(0).toUpperCase()+unit.type.slice(1)}
          {unit.bedrooms ? ` · ${unit.bedrooms} bed` : ""}
          {unit.size ? ` · ${unit.size}` : ""}
        </div>
      </div>
      {tenant
        ? <div className="text-right mr-2"><div className="text-[12px] font-medium text-gray-700">{tenant.name}</div><div className="text-[11px] text-gray-400">Tenant</div></div>
        : <div className="text-[12px] text-amber-600 font-medium mr-2">Vacant</div>
      }
      <div className="text-right">
        <div className="text-[13px] font-semibold font-mono text-brand-500">{fmt(unit.rent)}</div>
        <div className="text-[10px] text-gray-400">/month</div>
      </div>
      <Pill color={unit.status==="leased"?"green":"amber"}>{unit.status}</Pill>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  const units    = UNITS.filter(u => u.projectId === project.id);
  const leased   = units.filter(u => u.status === "leased").length;
  const vacant   = units.filter(u => u.status === "vacant").length;
  const occupancy = units.length ? Math.round((leased / units.length) * 100) : 0;
  const revenue  = units.filter(u => u.status === "leased").reduce((a, u) => a + u.rent, 0);

  return (
    <div onClick={() => onClick(project.id)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 transition-all"
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
        <div className="text-[12px] text-gray-500 mb-4 leading-relaxed">{project.description}</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[[project.floors,"Floors","ti-stairs"],[project.totalUnits,"Total units","ti-home"],[fmt(revenue),"Monthly rent","ti-coin-rupee"]].map(([v,l,ic])=>(
            <div key={l} className="bg-gray-50 rounded-lg p-2.5 text-center">
              <div className="text-[13px] font-semibold text-gray-900 font-mono">{v}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-gray-400">Occupancy</span>
          <span className="text-[11px] font-semibold font-mono" style={{ color:project.color }}>{occupancy}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div className="h-full rounded-full" style={{ width:`${occupancy}%`, background:project.color }} />
        </div>
        <div className="flex gap-3 mt-2">
          <span className="text-[11px] text-emerald-600">{leased} leased</span>
          <span className="text-[11px] text-amber-600">{vacant} vacant</span>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ projectId, onBack }) {
  const project = PROJECTS.find(p => p.id === projectId);
  const units   = UNITS.filter(u => u.projectId === projectId);
  const [expandedFloors, setExpandedFloors] = useState({});

  const floors   = [...new Set(units.map(u => u.floor))].sort((a, b) => a - b);
  const leased   = units.filter(u => u.status === "leased").length;
  const occupancy = units.length ? Math.round((leased / units.length) * 100) : 0;
  const revenue  = units.filter(u => u.status === "leased").reduce((a, u) => a + u.rent, 0);

  const toggleFloor = f => setExpandedFloors(prev => ({ ...prev, [f]: !prev[f] }));

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
        <Button size="sm" icon="ti-plus">Add unit</Button>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          [project.floors,    "Total floors",  "ti-stairs",     "#1C64F2","#EBF5FF"],
          [project.totalUnits,"Total units",   "ti-home",       "#057A55","#F3FAF7"],
          [`${occupancy}%`,   "Occupancy",     "ti-chart-pie",  "#6C2BD9","#F5F3FF"],
          [fmt(revenue),      "Monthly income","ti-coin-rupee", "#B45309","#FFFBEB"],
        ].map(([v,l,ic,fg,bg])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
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
        <PanelHead icon="ti-building" title="Units by floor" sub={`${units.length} units · click a floor to expand`} />
        <div className="px-4">
          {floors.map(floor => {
            const floorUnits  = units.filter(u => u.floor === floor);
            const isOpen      = expandedFloors[floor];
            const floorLeased = floorUnits.filter(u => u.status === "leased").length;
            return (
              <div key={floor} className="border-b border-gray-100 last:border-0">
                <div onClick={() => toggleFloor(floor)}
                  className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 -mx-4 px-4 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-[12px] font-semibold text-gray-600 font-mono">{floor}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-gray-800">Floor {floor}{floor===1?" · Ground":""}</div>
                    <div className="text-[11px] text-gray-400">{floorUnits.length} units · {floorLeased} leased</div>
                  </div>
                  <div className="flex gap-1.5 mr-2">
                    {floorUnits.map(u=>(
                      <div key={u.id} className="w-2 h-2 rounded-full" style={{ background:u.status==="leased"?"#057A55":"#F59E0B" }} />
                    ))}
                  </div>
                  <i className={`ti ${isOpen?"ti-chevron-up":"ti-chevron-down"} text-gray-400 text-[15px]`} aria-hidden />
                </div>
                {isOpen && (
                  <div className="pb-2">
                    {floorUnits.map(u => <UnitRow key={u.id} unit={u} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function ProjectsPage() {
  const [showModal, setShowModal]   = useState(false);
  const [projects, setProjects]     = useState(PROJECTS);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter]         = useState("all");

  if (selectedId) return <ProjectDetail projectId={selectedId} onBack={() => setSelectedId(null)} />;

  const filtered     = projects.filter(p => filter === "all" || p.type === filter);
  const totalUnits   = UNITS.length;
  const leasedUnits  = UNITS.filter(u => u.status === "leased").length;
  const totalRevenue = UNITS.filter(u => u.status === "leased").reduce((a, u) => a + u.rent, 0);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5">
          {[["all","All"],["residential","Residential"],["commercial","Commercial"],["mixed","Mixed-use"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {l}
            </button>
          ))}
        </div>
        <Button icon="ti-plus" onClick={() => setShowModal(true)}>Add project</Button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [projects.length,               "Total projects",  "#1C64F2","#EBF5FF","ti-building"   ],
          [`${leasedUnits}/${totalUnits}`, "Units leased",   "#057A55","#F3FAF7","ti-home"        ],
          [fmt(totalRevenue),             "Monthly revenue", "#B45309","#FFFBEB","ti-coin-rupee"  ],
        ].map(([v,l,fg,bg,ic])=>(
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
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
        {filtered.map(p => <ProjectCard key={p.id} project={p} onClick={setSelectedId} />)}
      </div>
      {showModal && (
        <AddProjectModal onClose={() => setShowModal(false)} onAdd={p => setProjects(prev => [...prev, p])} />
      )}
    </div>
  );
}