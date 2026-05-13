import { useState } from "react";
import { Card, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { fmt } from "../lib/utils.js";
import { UNITS, PROJECTS, CLIENTS } from "../data/demo.js";

const PURPOSE_STYLES = {
  rent: { color:"blue",   label:"For rent"    },
  sale: { color:"purple", label:"For sale"    },
  both: { color:"green",  label:"Rent & sale" },
};

function UnitModal({ unit, project, tenant, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = unit.images || [];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:700, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.2)" }}
        onClick={e=>e.stopPropagation()}>

        {/* Image gallery */}
        {imgs.length > 0 && (
          <div style={{ position:"relative", height:280, background:"#F3F4F6", borderRadius:"16px 16px 0 0", overflow:"hidden" }}>
            <img src={imgs[imgIdx]} alt={`Unit ${unit.unitNo}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:6 }}>
              <Pill color={PURPOSE_STYLES[unit.purpose]?.color||"blue"}>{PURPOSE_STYLES[unit.purpose]?.label}</Pill>
              <Pill color={unit.status==="leased"?"green":"amber"}>{unit.status}</Pill>
            </div>
            {imgs.length > 1 && (
              <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
                {imgs.map((_,i)=>(
                  <button key={i} onClick={()=>setImgIdx(i)}
                    style={{ width:8, height:8, borderRadius:"50%", background:i===imgIdx?"#fff":"rgba(255,255,255,0.5)", border:"none", cursor:"pointer", padding:0 }} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:18, fontWeight:600, color:"#111827" }}>{project?.name} — Unit {unit.unitNo}</div>
              <div style={{ fontSize:13, color:"#6B7280", marginTop:3 }}>Floor {unit.floor} · {unit.type.charAt(0).toUpperCase()+unit.type.slice(1)}</div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:22 }}>
              <i className="ti ti-x" aria-hidden />
            </button>
          </div>

          {/* Key specs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
            {[
              [unit.size||"–",                "Size",    "ti-ruler"     ],
              [unit.bedrooms?`${unit.bedrooms} bed`:"–", "Bedrooms","ti-bed"  ],
              [unit.bathrooms?`${unit.bathrooms} bath`:"–","Bathrooms","ti-droplet"],
              [`Floor ${unit.floor}`,         "Floor",   "ti-stairs"    ],
            ].map(([v,l,ic])=>(
              <div key={l} style={{ background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                <i className={`ti ${ic}`} style={{ fontSize:18, color:"#6B7280", marginBottom:6, display:"block" }} aria-hidden />
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
                <div style={{ fontSize:20, fontWeight:700, color:"#1C64F2", fontFamily:"monospace" }}>{fmt(unit.rent)}</div>
              </div>
            )}
            {(unit.purpose==="sale"||unit.purpose==="both") && (
              <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"#4C1D95", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Sale price</div>
                <div style={{ fontSize:20, fontWeight:700, color:"#6C2BD9", fontFamily:"monospace" }}>{fmt(unit.salePrice)}</div>
              </div>
            )}
          </div>

          {/* Description */}
          {unit.description && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Description</div>
              <div style={{ fontSize:14, color:"#374151", lineHeight:1.65 }}>{unit.description}</div>
            </div>
          )}

          {/* Tenant */}
          {tenant && (
            <div style={{ background:"#F3FAF7", border:"1px solid #A7F3D0", borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
              <i className="ti ti-user-check" style={{ fontSize:16, color:"#057A55" }} aria-hidden />
              <div>
                <div style={{ fontSize:12, color:"#065F46", fontWeight:600 }}>Currently leased to</div>
                <div style={{ fontSize:13, color:"#065F46" }}>{tenant.name} · {tenant.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UnitsPage() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [selected, setSelected]           = useState(null);

  const filtered = UNITS.filter(u => {
    const matchP = projectFilter === "all" || u.projectId === projectFilter;
    const matchPu = purposeFilter === "all" || u.purpose === purposeFilter;
    const matchS = statusFilter === "all" || u.status === statusFilter;
    return matchP && matchPu && matchS;
  });

  const selectedUnit    = selected ? UNITS.find(u=>u.id===selected) : null;
  const selectedProject = selectedUnit ? PROJECTS.find(p=>p.id===selectedUnit.projectId) : null;
  const selectedTenant  = selectedUnit ? CLIENTS.find(c=>c.unitId===selectedUnit.id) : null;

  return (
    <div className="p-5">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          [UNITS.filter(u=>u.status==="leased").length,                    "Leased",        "#057A55","#F3FAF7","ti-home-check"   ],
          [UNITS.filter(u=>u.status==="vacant").length,                    "Vacant",        "#B45309","#FFFBEB","ti-home-off"     ],
          [UNITS.filter(u=>u.purpose==="sale"||u.purpose==="both").length, "For sale",      "#6C2BD9","#F5F3FF","ti-tag"          ],
          [UNITS.filter(u=>u.purpose==="rent"||u.purpose==="both").length, "For rent",      "#1C64F2","#EBF5FF","ti-key"          ],
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

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="flex gap-1.5">
          <span className="text-[11px] text-gray-400 self-center mr-1">Project</span>
          <button onClick={()=>setProjectFilter("all")} className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${projectFilter==="all"?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>All</button>
          {PROJECTS.map(p=>(
            <button key={p.id} onClick={()=>setProjectFilter(p.id)} className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${projectFilter===p.id?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>
              {p.name.split(" ").slice(0,2).join(" ")}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex gap-1.5">
          <span className="text-[11px] text-gray-400 self-center mr-1">Purpose</span>
          {[["all","All"],["rent","For rent"],["sale","For sale"],["both","Rent & sale"]].map(([v,l])=>(
            <button key={v} onClick={()=>setPurposeFilter(v)} className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${purposeFilter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>{l}</button>
          ))}
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex gap-1.5">
          <span className="text-[11px] text-gray-400 self-center mr-1">Status</span>
          {[["all","All"],["leased","Leased"],["vacant","Vacant"]].map(([v,l])=>(
            <button key={v} onClick={()=>setStatusFilter(v)} className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${statusFilter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Unit grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(u=>{
          const project = PROJECTS.find(p=>p.id===u.projectId);
          const tenant  = CLIENTS.find(c=>c.unitId===u.id);
          const img     = u.images?.[0];
          return (
            <div key={u.id} onClick={()=>setSelected(u.id)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-md transition-all shadow-sm">
              {/* Image */}
              <div style={{ height:140, background:"#F3F4F6", position:"relative", overflow:"hidden" }}>
                {img
                  ? <img src={img} alt={`Unit ${u.unitNo}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div className="w-full h-full flex items-center justify-center"><i className="ti ti-home text-gray-300 text-4xl" aria-hidden /></div>
                }
                <div style={{ position:"absolute", top:8, left:8, display:"flex", gap:5 }}>
                  <Pill color={PURPOSE_STYLES[u.purpose]?.color||"blue"}>{PURPOSE_STYLES[u.purpose]?.label}</Pill>
                </div>
                <div style={{ position:"absolute", top:8, right:8 }}>
                  <Pill color={u.status==="leased"?"green":"amber"}>{u.status}</Pill>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[14px] font-semibold text-gray-900">Unit {u.unitNo}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{project?.name} · Floor {u.floor}</div>
                  </div>
                </div>

                {/* Specs row */}
                <div className="flex gap-3 mb-3">
                  {u.bedrooms && <span className="text-[12px] text-gray-500 flex items-center gap-1"><i className="ti ti-bed text-[12px]" />{u.bedrooms} bed</span>}
                  {u.bathrooms && <span className="text-[12px] text-gray-500 flex items-center gap-1"><i className="ti ti-droplet text-[12px]" />{u.bathrooms} bath</span>}
                  {u.size && <span className="text-[12px] text-gray-500 flex items-center gap-1"><i className="ti ti-ruler text-[12px]" />{u.size}</span>}
                </div>

                {/* Pricing */}
                <div className="flex gap-2 flex-wrap">
                  {(u.purpose==="rent"||u.purpose==="both") && (
                    <div className="text-[13px] font-semibold font-mono text-brand-500">{fmt(u.rent)}<span className="text-[10px] text-gray-400 font-normal">/mo</span></div>
                  )}
                  {(u.purpose==="sale"||u.purpose==="both") && (
                    <div className="text-[13px] font-semibold font-mono text-purple-600">{fmt(u.salePrice)}</div>
                  )}
                </div>

                {tenant && (
                  <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1">
                    <i className="ti ti-user-check text-[11px]" />{tenant.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length===0 && (
          <div className="col-span-3 py-16 text-center text-[13px] text-gray-400 bg-white border border-gray-200 rounded-xl">
            No units match your filters.
          </div>
        )}
      </div>

      {/* Unit detail modal */}
      {selected && (
        <UnitModal
          unit={selectedUnit}
          project={selectedProject}
          tenant={selectedTenant}
          onClose={()=>setSelected(null)}
        />
      )}
    </div>
  );
}