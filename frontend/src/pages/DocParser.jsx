import { useState, useRef } from "react";
import { Card, Alert } from "../components/index.jsx";
import { Button } from "../components/Button.jsx";
import { CLIENTS } from "../data/demo.js";

const EXTRACTED_DEMO = [
  ["Tenant",           "Sara Akhtar"                         ],
  ["Landlord",         "Nyxion Properties Pvt. Ltd."         ],
  ["Project",          "DHA Residency Tower"                 ],
  ["Unit",             "Unit 301 · Floor 3"                  ],
  ["Lease start",      "01 August 2024"                      ],
  ["Lease end",        "31 July 2025"                        ],
  ["Monthly rent",     "Rs. 120,000"                         ],
  ["Security deposit", "Rs. 360,000 (3 months)"              ],
  ["Notice period",    "60 days"                             ],
  ["Sub-letting",      "Not permitted without written consent"],
  ["Maintenance",      "Tenant responsible under Rs. 5,000"  ],
  ["Governing law",    "Courts of Lahore, Punjab, Pakistan"  ],
];

export function DocParserPage() {
  const [dragging, setDragging]   = useState(false);
  const [parsed, setParsed]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [fileName, setFileName]   = useState("");
  const [linkClient, setLinkClient] = useState("");
  const [linked, setLinked]       = useState(false);
  const fileRef = useRef();

  const parse = async (name) => {
    setLoading(true);
    setFileName(name || "document.pdf");
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setParsed(true);
  };

  const handleFile = (file) => {
    if (file) parse(file.name);
  };

  return (
    <div className="p-5 max-w-2xl">
      <div className="mb-4">
        <Alert type="info">
          Upload any signed lease, agreement, or notice. AI will extract key terms — rent, duration, parties, clauses — automatically. Supports PDF, DOCX, and scanned images.
        </Alert>
      </div>

      {!parsed ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <input ref={fileRef} type="file" accept=".pdf,.docx,image/*" style={{ display:"none" }}
            onChange={e => handleFile(e.target.files[0])} />
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragging?"border-brand-500 bg-blue-50":"border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}>
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <i className="ti ti-loader-2 text-4xl text-brand-500 animate-spin" aria-hidden />
                <div className="text-[14px] font-medium text-gray-700">Parsing document…</div>
                <div className="text-[12px] text-gray-400">AI is extracting fields</div>
              </div>
            ) : (
              <>
                <i className={`ti ti-cloud-upload text-4xl mb-3 ${dragging?"text-brand-500":"text-gray-300"}`} aria-hidden />
                <div className="text-[15px] font-medium text-gray-700 mb-1.5">Drop document here or click to browse</div>
                <div className="text-[13px] text-gray-400 mb-5">PDF, DOCX, or scanned image · Max 20MB</div>
                <Button variant="secondary" icon="ti-upload" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>Choose file</Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <i className="ti ti-circle-check text-emerald-600 text-lg" aria-hidden />
            <div>
              <div className="text-[13px] font-semibold text-emerald-700">Parsed successfully</div>
              <div className="text-[12px] text-emerald-600">{fileName}</div>
            </div>
          </div>

          <div className="text-[13px] font-semibold text-gray-700 mb-3">Extracted fields</div>
          <div className="border border-gray-100 rounded-xl overflow-hidden mb-5">
            {EXTRACTED_DEMO.map(([k,v], i) => (
              <div key={k} className={`flex py-2.5 px-4 ${i%2===0?"bg-white":"bg-gray-50"} border-b border-gray-100 last:border-0`}>
                <span className="text-[12px] text-gray-400 w-44 shrink-0 font-medium">{k}</span>
                <span className="text-[13px] text-gray-800 font-medium">{v}</span>
              </div>
            ))}
          </div>

          {!linked ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <div className="text-[13px] font-semibold text-blue-800 mb-3">Link to client profile</div>
              <div className="flex gap-2">
                <select value={linkClient} onChange={e => setLinkClient(e.target.value)}
                  style={{ flex:1, height:38, borderRadius:8, border:"1px solid #BFDBFE", padding:"0 12px", fontSize:13, color:"#111827", fontFamily:"inherit", outline:"none", background:"#EBF5FF" }}>
                  <option value="">Select client…</option>
                  {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <Button size="sm" icon="ti-link" onClick={() => { if(linkClient) setLinked(true); }}>Link</Button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-4 flex items-center gap-2.5">
              <i className="ti ti-user-check text-emerald-600 text-base" aria-hidden />
              <span className="text-[13px] text-emerald-700 font-medium">
                Linked to {CLIENTS.find(c=>c.id===linkClient)?.name}
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon="ti-refresh" onClick={() => { setParsed(false); setLinked(false); setLinkClient(""); }}>Parse another</Button>
            <Button variant="secondary" size="sm" icon="ti-download">Download summary</Button>
          </div>
        </div>
      )}
    </div>
  );
}