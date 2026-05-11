import { useState } from "react";
import { Card, Avatar, Pill, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { CLIENTS, UNITS, PROJECTS } from "../data/demo.js";

async function summariseChat(clientName, chatText) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const res = await fetch(`${apiUrl}/api/whatsapp/summarise`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientName, chatText }),
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

function SummaryCard({ client }) {
  const unit    = client.unitId ? UNITS.find(u => u.id === client.unitId) : null;
  const project = unit ? PROJECTS.find(p => p.id === unit.projectId) : null;
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={client.name} size={40} />
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-gray-900">{client.name}</div>
            <div className="text-[12px] text-gray-400 mt-0.5">
              {project ? `${project.name} — Unit ${unit.unitNo}` : "Prospect · No unit assigned"}
            </div>
          </div>
          <Pill color={client.waSentiment==="positive"?"green":client.waSentiment==="negative"?"red":"gray"}>
            {client.waSentiment}
          </Pill>
        </div>

        <div className="mb-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">English</div>
          <div className="text-[13px] text-gray-700 leading-relaxed">{client.waSummary}</div>
        </div>

        {client.waSummaryUrdu && (
          <div className="mb-3 bg-gray-50 rounded-lg p-3">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Roman Urdu</div>
            <div className="text-[13px] text-gray-600 leading-relaxed">{client.waSummaryUrdu}</div>
          </div>
        )}

        <div className="flex gap-1.5 flex-wrap mb-3">
          {client.waTags.map(t => (
            <Pill key={t} color={client.waSentiment==="positive"?"green":client.waSentiment==="negative"?"red":"amber"}>{t}</Pill>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-purple-50 rounded-lg px-3 py-2">
          <i className="ti ti-sparkles text-purple-600 text-[13px]" aria-hidden />
          <span className="text-[11px] text-purple-600 font-medium">AI generated · Groq</span>
        </div>
      </div>
    </Card>
  );
}

function PasteModal({ onClose }) {
  const [clientId, setClientId] = useState("");
  const [chatText, setChatText] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");

  const sentColor = result?.sentiment==="positive"?"#057A55":result?.sentiment==="negative"?"#E02424":"#6B7280";
  const sentBg    = result?.sentiment==="positive"?"#F3FAF7":result?.sentiment==="negative"?"#FDF2F2":"#F3F4F6";

  const submit = async () => {
    if (!clientId)                  { setError("Please select a client"); return; }
    if (chatText.trim().length < 20) { setError("Please paste the WhatsApp conversation"); return; }
    setError(""); setLoading(true);
    try {
      const client = CLIENTS.find(c => c.id === clientId);
      const data   = await summariseChat(client.name, chatText);
      setResult(data);
    } catch {
      setError("Could not connect to the AI server. Make sure your Railway backend is running and GROQ_API_KEY is set.");
    }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>

        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"#111827" }}>Summarise WhatsApp chat</div>
            <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Paste exported conversation · Roman Urdu supported</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20 }}>
            <i className="ti ti-x" aria-hidden />
          </button>
        </div>

        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          {result ? (
            <>
              <Alert type="success">Summary generated successfully.</Alert>

              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>English summary</div>
                <div style={{ fontSize:13, color:"#374151", lineHeight:1.65, background:"#F9FAFB", borderRadius:8, padding:"12px 14px" }}>{result.summaryEn}</div>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Roman Urdu</div>
                <div style={{ fontSize:13, color:"#374151", lineHeight:1.65, background:"#F5F3FF", borderRadius:8, padding:"12px 14px" }}>{result.summaryUrdu}</div>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>AI signals</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <span style={{ background:sentBg, color:sentColor, fontSize:12, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>{result.sentiment} sentiment</span>
                  {result.tags?.map(t => (
                    <span key={t} style={{ background:"#EBF5FF", color:"#1E40AF", fontSize:12, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ background:"#FFFBEB", borderRadius:8, padding:"10px 14px" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#92400E", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Recommended action</div>
                <div style={{ fontSize:13, color:"#78350F" }}>{result.nudge}</div>
              </div>

              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <Button variant="secondary" onClick={() => setResult(null)}>Summarise another</Button>
                <Button onClick={onClose} icon="ti-check">Done</Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Client</label>
                <select value={clientId} onChange={e => setClientId(e.target.value)}
                  style={{ height:40, width:"100%", borderRadius:8, border:"1px solid #D1D5DB", padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff" }}>
                  <option value="">Select client…</option>
                  {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Paste WhatsApp conversation</label>
                <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:4 }}>
                  WhatsApp → Open chat → three dots → Export chat → Without media → copy all → paste here
                </div>
                <textarea value={chatText} onChange={e => setChatText(e.target.value)} rows={8}
                  placeholder={"[2025-05-10, 3:42 PM] Ahmed: bhai rent abhi nahi de sakta\n[2025-05-10, 3:43 PM] Arif: kab tak?\n[2025-05-10, 3:45 PM] Ahmed: ek hafte mein pakka…"}
                  style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"12px 14px", fontSize:13, color:"#374151", fontFamily:"monospace", outline:"none", resize:"vertical", lineHeight:1.6 }}
                  onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
                  onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
                />
              </div>

              {error && <Alert type="error">{error}</Alert>}

              <div style={{ background:"#F5F3FF", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#6C2BD9" }}>
                <i className="ti ti-sparkles" style={{ marginRight:5 }} aria-hidden />
                Fully understands Roman Urdu — "rent nahi de sakta", "agreement pe raazi hun", "ghar khali karna hai" etc.
              </div>

              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button loading={loading} onClick={submit} icon="ti-sparkles">Generate summary</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function WhatsAppPage() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter]       = useState("all");
  const filtered = CLIENTS.filter(c => filter === "all" || c.waSentiment === filter);

  return (
    <div className="p-5">
      <div className="mb-4">
        <Alert type="info">
          Paste any WhatsApp chat export and AI will summarise in English and Roman Urdu, detect sentiment, and recommend the next action.
        </Alert>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {[["all","All"],["positive","Positive"],["negative","Negative"],["neutral","Neutral"]].map(([v,l])=>(
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {l}
            </button>
          ))}
        </div>
        <Button icon="ti-brand-whatsapp" onClick={() => setShowModal(true)}>Summarise conversation</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(cl => <SummaryCard key={cl.id} client={cl} />)}
      </div>
      {showModal && <PasteModal onClose={() => setShowModal(false)} />}
    </div>
  );
}