import { useState } from "react";
import { Card, Avatar, Pill } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { fmt } from "../lib/utils.js";
import { PAYMENTS as DEMO_PAYMENTS, CLIENTS, UNITS, PROJECTS } from "../data/demo.js";

const sel = (err) => ({
  height:40, width:"100%", borderRadius:8, border:`1px solid ${err?"#E02424":"#D1D5DB"}`,
  padding:"0 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", background:"#fff",
});

function Modal({ title, sub, onClose, children, footer }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
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

function AddPaymentModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ clientId:"", unitId:"", amount:"", dueDate:"", note:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.clientId) e.clientId = "Select a client";
    if (!form.amount || isNaN(form.amount)) e.amount = "Enter a valid amount";
    if (!form.dueDate) e.dueDate = "Select a due date";
    return e;
  };

  const submit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onAdd({
      id: "PY_NEW_" + Date.now(),
      clientId: form.clientId, unitId: form.unitId || null,
      amount: Number(form.amount), due: form.dueDate,
      paid: null, status: "upcoming", daysLate: 0,
      aiLabel: "Upcoming", aiColor: "blue", note: form.note,
    });
    onClose();
  };

  return (
    <Modal title="Add payment" sub="Record an upcoming or overdue payment" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={submit} icon="ti-receipt">Save</Button></>}>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Client</label>
        <select value={form.clientId} onChange={set("clientId")} style={sel(errors.clientId)}>
          <option value="">Select client…</option>
          {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.clientId && <span style={{ fontSize:12, color:"#E02424" }}>{errors.clientId}</span>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Unit (optional)</label>
        <select value={form.unitId} onChange={set("unitId")} style={sel(false)}>
          <option value="">No unit</option>
          {UNITS.map(u => {
            const p = PROJECTS.find(pr => pr.id === u.projectId);
            return <option key={u.id} value={u.id}>{p?.name} — Unit {u.unitNo}</option>;
          })}
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Input label="Amount (Rs.)" value={form.amount} onChange={set("amount")} placeholder="120000" error={errors.amount} icon="ti-coin-rupee" />
        <Input label="Due date" type="date" value={form.dueDate} onChange={set("dueDate")} error={errors.dueDate} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:13, fontWeight:500, color:"#374151" }}>Note (optional)</label>
        <textarea value={form.note} onChange={set("note")} placeholder="e.g. May rent, security deposit…" rows={2}
          style={{ borderRadius:8, border:"1px solid #D1D5DB", padding:"10px 12px", fontSize:14, color:"#111827", fontFamily:"inherit", outline:"none", resize:"none" }}
          onFocus={e=>{e.target.style.borderColor="#1C64F2";e.target.style.boxShadow="0 0 0 3px #EBF5FF";}}
          onBlur={e=>{e.target.style.borderColor="#D1D5DB";e.target.style.boxShadow="none";}}
        />
      </div>
    </Modal>
  );
}

function MarkPaidModal({ payment, onClose, onConfirm }) {
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const client = CLIENTS.find(c => c.id === payment.clientId);
  const confirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    onConfirm(paidDate); onClose();
  };
  return (
    <Modal title="Mark as paid" sub={`Confirm receipt from ${client?.name}`} onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button loading={loading} onClick={confirm} icon="ti-circle-check">Confirm</Button></>}>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="text-[12px] text-emerald-600 font-semibold mb-1">{client?.name}</div>
        <div className="text-2xl font-bold font-mono text-emerald-700">{fmt(payment.amount)}</div>
        {payment.daysLate > 0 && <div className="text-[12px] text-amber-600 mt-1">{payment.daysLate} days late</div>}
      </div>
      <Input label="Date received" type="date" value={paidDate} onChange={e => setPaidDate(e.target.value)} icon="ti-calendar" />
    </Modal>
  );
}

export function PaymentsPage() {
  const [payments, setPayments] = useState(DEMO_PAYMENTS);
  const [filter, setFilter]     = useState("all");
  const [showAdd, setShowAdd]   = useState(false);
  const [markPaid, setMarkPaid] = useState(null);

  const filtered = payments.filter(p => filter === "all" || p.status === filter);
  const paid     = payments.filter(p => p.status === "paid").reduce((a,p) => a+p.amount, 0);
  const overdue  = payments.filter(p => p.status === "overdue").reduce((a,p) => a+p.amount, 0);
  const upcoming = payments.filter(p => p.status === "upcoming").reduce((a,p) => a+(p.amount||0), 0);

  const confirmPaid = (id, date) => setPayments(prev => prev.map(p =>
    p.id === id ? { ...p, status:"paid", paid:date, daysLate:0, aiLabel:"On time", aiColor:"green" } : p
  ));

  const remove = (id) => { if (window.confirm("Remove this payment?")) setPayments(prev => prev.filter(p => p.id !== id)); };

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          [fmt(paid),     "Collected",  "#057A55","#F3FAF7","ti-circle-check"     ],
          [fmt(overdue),  "Overdue",    "#E02424","#FDF2F2","ti-clock-exclamation"],
          [fmt(upcoming), "Due soon",   "#1C64F2","#EBF5FF","ti-calendar-time"   ],
        ].map(([v,l,fg,bg,ic]) => (
          <div key={l} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:bg }}>
                <i className={`ti ${ic} text-[14px]`} style={{ color:fg }} aria-hidden />
              </div>
              <span className="text-[12px] text-gray-500">{l}</span>
            </div>
            <div className="text-xl font-bold font-mono" style={{ color:fg }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {[["all","All"],["overdue","Overdue"],["upcoming","Upcoming"],["paid","Paid"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${filter===v?"border-brand-500 bg-blue-50 text-brand-500":"border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}>
              {l}
            </button>
          ))}
        </div>
        <Button icon="ti-plus" onClick={() => setShowAdd(true)}>Add payment</Button>
      </div>

      <Card>
        <div className="grid px-4 py-3 border-b border-gray-200 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 rounded-t-xl"
          style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 110px 130px" }}>
          <span>Client</span><span>Unit</span><span>Amount</span><span>Date</span><span>Status</span><span>Actions</span>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">No payments found.</div>}
        {filtered.map(p => {
          const unit    = UNITS.find(u => u.id === p.unitId);
          const project = unit ? PROJECTS.find(pr => pr.id === unit.projectId) : null;
          const client  = CLIENTS.find(c => c.id === p.clientId);
          return (
            <div key={p.id} className="grid items-center px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr 110px 130px" }}>
              <div className="flex items-center gap-2.5">
                <Avatar name={client?.name||"–"} size={30} />
                <div>
                  <div className="text-[13px] font-medium text-gray-900">{client?.name||"–"}</div>
                  {p.status==="overdue" && <div className="text-[11px] text-red-500 font-medium">{p.daysLate} days overdue</div>}
                  {p.note && <div className="text-[11px] text-gray-400">{p.note}</div>}
                </div>
              </div>
              <div>
                <div className="text-[13px] text-gray-700">{project?.name||"–"}</div>
                <div className="text-[11px] text-gray-400">{unit?`Unit ${unit.unitNo}`:"No unit"}</div>
              </div>
              <div className="text-[13px] font-bold font-mono" style={{ color:p.status==="overdue"?"#E02424":p.status==="paid"?"#057A55":"#374151" }}>
                {fmt(p.amount)}
              </div>
              <div className="text-[12px] text-gray-500">{p.paid||p.due||"–"}</div>
              <Pill color={p.aiColor}>{p.aiLabel}</Pill>
              <div className="flex gap-1.5">
                {p.status !== "paid" && (
                  <button onClick={() => setMarkPaid(p)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-semibold hover:bg-emerald-100 transition-colors">
                    <i className="ti ti-check text-[12px]" aria-hidden /> Mark paid
                  </button>
                )}
                <button onClick={() => remove(p.id)}
                  className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-400 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">
                  <i className="ti ti-trash text-[12px]" aria-hidden />
                </button>
              </div>
            </div>
          );
        })}
      </Card>

      {showAdd && <AddPaymentModal onClose={() => setShowAdd(false)} onAdd={p => setPayments(prev => [p, ...prev])} />}
      {markPaid && <MarkPaidModal payment={markPaid} onClose={() => setMarkPaid(null)} onConfirm={(d) => confirmPaid(markPaid.id, d)} />}
    </div>
  );
}