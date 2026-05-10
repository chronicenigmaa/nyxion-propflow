export const DEMO_USER = {
  name: "Arif Khan",
  email: "arif.khan@nyxionlabs.com",
  role: "Admin",
  company: "Nyxion Properties",
};

export const UNITS = [
  { id:"U01", label:"DHA Phase 6 – 10-A", type:"House", size:"10 Marla", city:"Lahore", rent:120000, status:"leased" },
  { id:"U02", label:"Bahria Town – Block D, 22", type:"Apartment", size:"3 Bed", city:"Rawalpindi", rent:85000, status:"leased" },
  { id:"U03", label:"Gulshan-e-Iqbal – B2 / 4F", type:"Office", size:"1500 sqft", city:"Karachi", rent:200000, status:"leased" },
  { id:"U04", label:"DHA Phase 2 – 55-C", type:"House", size:"1 Kanal", city:"Lahore", rent:175000, status:"vacant" },
  { id:"U05", label:"F-11 Markaz – Shop 3", type:"Commercial", size:"400 sqft", city:"Islamabad", rent:95000, status:"leased" },
  { id:"U06", label:"Clifton Block 5 – Apt 12A", type:"Apartment", size:"4 Bed", city:"Karachi", rent:145000, status:"leased" },
  { id:"U07", label:"Blue Area – Floor 6", type:"Office", size:"2200 sqft", city:"Islamabad", rent:260000, status:"vacant" },
  { id:"U08", label:"Johar Town – 45-B", type:"House", size:"5 Marla", city:"Lahore", rent:60000, status:"leased" },
];

export const CLIENTS = [
  { id:"C01", name:"Sara Akhtar", phone:"+92 300 1234567", email:"sara.akhtar@gmail.com", cnic:"35202-1234567-8", city:"Lahore", unit:"U01", score:92, status:"Top priority", statusColor:"green", leaseStart:"2024-08-01", leaseEnd:"2025-07-31", rentAmount:120000, paymentStatus:"paid", waSummary:"Client confirmed willingness to renew at 18% above current rate. Very responsive and ready to sign this week.", waTags:["Ready to sign","Price agreed"], waSentiment:"positive", riskFlags:[], nextNudge:"Send lease renewal document today", notes:"Long-term tenant. Always pays on time." },
  { id:"C02", name:"Kamran Mirza", phone:"+92 321 9876543", email:"kamran.m@hotmail.com", cnic:"42201-9876543-2", city:"Karachi", unit:"U03", score:85, status:"Negotiating", statusColor:"blue", leaseStart:"2024-10-15", leaseEnd:"2025-10-14", rentAmount:200000, paymentStatus:"paid", waSummary:"Negotiating 15% rent increase. Agreed in principle but wants minor renovations first.", waTags:["Negotiating","Price increase agreed"], waSentiment:"positive", riskFlags:[], nextNudge:"Follow up on renovation request", notes:"Corporate tenant. Responds quickly." },
  { id:"C03", name:"Fatima Qureshi", phone:"+92 333 5554433", email:"fatimaq@yahoo.com", cnic:"61101-5554433-1", city:"Islamabad", unit:null, score:78, status:"Interested", statusColor:"blue", leaseStart:null, leaseEnd:null, rentAmount:null, paymentStatus:"prospect", waSummary:"New enquiry about 3-bed apartment. Budget around Rs. 140,000/month. Flexible on move-in date.", waTags:["New enquiry","Viewing requested"], waSentiment:"positive", riskFlags:[], nextNudge:"Schedule site visit for this week", notes:"Referred by Sara Akhtar." },
  { id:"C04", name:"Ahmed Hassan", phone:"+92 311 7778899", email:"ahmed.hassan@gmail.com", cnic:"35301-7778899-3", city:"Rawalpindi", unit:"U02", score:41, status:"Cooling off", statusColor:"amber", leaseStart:"2024-12-01", leaseEnd:"2025-11-30", rentAmount:85000, paymentStatus:"overdue", waSummary:"Hesitant on rent increase. Asked about flexible payments. No reply in 9 days.", waTags:["Hesitant","No response"], waSentiment:"negative", riskFlags:["No WhatsApp reply in 9 days","Payment overdue 37 days"], nextNudge:"Send soft check-in — last chance before escalation", notes:"Something changed around March." },
  { id:"C05", name:"Zara Baig", phone:"+92 345 2221100", email:"zara.baig@live.com", cnic:"42301-2221100-9", city:"Karachi", unit:"U06", score:22, status:"At risk", statusColor:"red", leaseStart:"2024-06-01", leaseEnd:"2025-05-31", rentAmount:145000, paymentStatus:"overdue", waSummary:"Consistently late since January. Mentioned financial difficulties and possibly vacating early.", waTags:["Payment issues","Early exit risk"], waSentiment:"negative", riskFlags:["3rd consecutive late payment","Lease expires in 21 days","Mentioned early exit"], nextNudge:"Call directly — do not WhatsApp", notes:"Handle carefully. Has two dependents." },
  { id:"C06", name:"Bilal Chaudhry", phone:"+92 300 6667788", email:"bilal.chaudhry@gmail.com", cnic:"35202-6667788-5", city:"Lahore", unit:"U08", score:67, status:"Active", statusColor:"green", leaseStart:"2025-01-01", leaseEnd:"2025-12-31", rentAmount:60000, paymentStatus:"paid", waSummary:"Satisfied with property. Asked about parking for second vehicle. No issues.", waTags:["Satisfied","Minor request"], waSentiment:"positive", riskFlags:[], nextNudge:"Resolve parking query", notes:"First time renting independently." },
  { id:"C07", name:"Hina Siddiqui", phone:"+92 321 3334455", email:"hina.s@gmail.com", cnic:"42201-3334455-7", city:"Islamabad", unit:"U05", score:74, status:"Active", statusColor:"green", leaseStart:"2024-11-01", leaseEnd:"2025-10-31", rentAmount:95000, paymentStatus:"paid", waSummary:"Enquired about subletting part of commercial space. Business is expanding — positive signal.", waTags:["Sublease interest","Expanding"], waSentiment:"positive", riskFlags:[], nextNudge:"Discuss sublease terms", notes:"Runs a boutique retail business." },
  { id:"C08", name:"Usman Raza", phone:"+92 333 9990011", email:"usman.raza@outlook.com", cnic:"61101-9990011-4", city:"Lahore", unit:null, score:55, status:"Prospect", statusColor:"blue", leaseStart:null, leaseEnd:null, rentAmount:null, paymentStatus:"prospect", waSummary:"Interested in 1 Kanal DHA Phase 2. Budget Rs. 160,000–180,000. Visited once, slow to commit.", waTags:["Considering","Site visited"], waSentiment:"neutral", riskFlags:[], nextNudge:"Send unit comparison sheet", notes:"May want longer lease term." },
];

export const PAYMENTS = [
  { id:"P01", clientId:"C05", client:"Zara Baig", unit:"U06", amount:145000, due:"2025-03-12", paid:null, status:"overdue", daysLate:59, aiLabel:"Escalate", aiColor:"red" },
  { id:"P02", clientId:"C04", client:"Ahmed Hassan", unit:"U02", amount:85000, due:"2025-04-01", paid:null, status:"overdue", daysLate:39, aiLabel:"Likely to miss", aiColor:"amber" },
  { id:"P03", clientId:"C01", client:"Sara Akhtar", unit:"U01", amount:120000, due:"2025-05-01", paid:"2025-05-01", status:"paid", daysLate:0, aiLabel:"On time", aiColor:"green" },
  { id:"P04", clientId:"C02", client:"Kamran Mirza", unit:"U03", amount:200000, due:"2025-05-15", paid:null, status:"upcoming", daysLate:0, aiLabel:"Likely to pay", aiColor:"blue" },
  { id:"P05", clientId:"C06", client:"Bilal Chaudhry", unit:"U08", amount:60000, due:"2025-05-03", paid:"2025-05-03", status:"paid", daysLate:0, aiLabel:"On time", aiColor:"green" },
  { id:"P06", clientId:"C07", client:"Hina Siddiqui", unit:"U05", amount:95000, due:"2025-05-02", paid:"2025-05-02", status:"paid", daysLate:0, aiLabel:"On time", aiColor:"green" },
];

export const NUDGES = [
  { id:"N01", clientId:"C04", client:"Ahmed Hassan", icon:"ti-message", msg:"No reply in 9 days. Send a soft check-in before escalating.", urgency:"high", action:"Draft message" },
  { id:"N02", clientId:"C01", client:"Sara Akhtar", icon:"ti-file-text", msg:"Client is ready to sign. Send lease renewal document today.", urgency:"high", action:"Send lease" },
  { id:"N03", clientId:"C05", client:"Zara Baig", icon:"ti-phone", msg:"Three consecutive late payments. Call directly — WhatsApp has not worked.", urgency:"critical", action:"Log call" },
  { id:"N04", clientId:"C07", client:"Hina Siddiqui", icon:"ti-arrow-transfer-up", msg:"Sublease enquiry pending response. Good upsell opportunity.", urgency:"medium", action:"Respond" },
  { id:"N05", clientId:"C08", client:"Usman Raza", icon:"ti-building-estate", msg:"Visited DHA Phase 2 unit. Send comparison sheet to nudge decision.", urgency:"medium", action:"Send sheet" },
];

export const RISKS = [
  { id:"R01", clientId:"C05", client:"Zara Baig", unit:"U06", reason:"3rd consecutive late payment — 59 days overdue", level:"critical" },
  { id:"R02", clientId:"C04", client:"Ahmed Hassan", unit:"U02", reason:"No WhatsApp reply in 9 days, lease renewal window closing", level:"high" },
  { id:"R03", unitId:"U04", client:"–", unit:"U04", reason:"DHA Phase 2 unit vacant for 45 days — no active leads", level:"medium" },
  { id:"R04", clientId:"C05", client:"Zara Baig", unit:"U06", reason:"Client mentioned early exit — lease ends May 31", level:"high" },
  { id:"R05", unitId:"U07", client:"–", unit:"U07", reason:"Blue Area office floor vacant, 2nd consecutive month", level:"medium" },
];

export const FORECAST = [
  { month:"Jun", projected:875000 }, { month:"Jul", projected:905000 },
  { month:"Aug", projected:940000 }, { month:"Sep", projected:880000 },
  { month:"Oct", projected:925000 }, { month:"Nov", projected:860000 },
];
