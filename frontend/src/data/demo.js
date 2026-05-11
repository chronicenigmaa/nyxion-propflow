export const DEMO_USER = {
  name: "Arif Khan",
  email: "arif.khan@nyxionlabs.com",
  role: "Admin",
  company: "Nyxion Properties Pvt. Ltd.",
};

export const PROJECTS = [
  { id:"P01", name:"DHA Residency Tower",    type:"residential", city:"Lahore",     address:"DHA Phase 6, Main Boulevard, Lahore",             totalUnits:48, floors:12, completionYear:2022, status:"active", color:"#1C64F2", description:"12-storey residential tower, 4 units per floor, mix of 2 and 3-bedroom apartments." },
  { id:"P02", name:"Bahria Business Centre", type:"commercial",  city:"Rawalpindi", address:"Bahria Town Phase 7, Commercial Zone, Rawalpindi", totalUnits:32, floors:8,  completionYear:2021, status:"active", color:"#057A55", description:"8-storey commercial complex with offices and retail ground floor." },
  { id:"P03", name:"Clifton Heights",        type:"mixed",       city:"Karachi",    address:"Block 5, Clifton, Karachi",                        totalUnits:60, floors:15, completionYear:2023, status:"active", color:"#6C2BD9", description:"Mixed-use tower. Ground to 3rd floor commercial, 4th to 15th residential." },
  { id:"P04", name:"F-11 Corporate Park",    type:"commercial",  city:"Islamabad",  address:"F-11 Markaz, Islamabad",                           totalUnits:24, floors:6,  completionYear:2020, status:"active", color:"#B45309", description:"6-storey office park in F-11 Markaz with ground floor retail." },
  { id:"P05", name:"Gulshan Arcade",         type:"mixed",       city:"Karachi",    address:"Gulshan-e-Iqbal Block 10A, Karachi",                totalUnits:36, floors:9,  completionYear:2019, status:"active", color:"#E02424", description:"9-storey mixed-use. Retail ground, offices 2-5, residential 6-9." },
];

export const UNITS = [
  { id:"U01", projectId:"P01", floor:3,  unitNo:"301",  type:"apartment", bedrooms:3, size:"1,650 sqft", rent:120000, status:"leased" },
  { id:"U02", projectId:"P01", floor:3,  unitNo:"302",  type:"apartment", bedrooms:2, size:"1,200 sqft", rent:95000,  status:"leased" },
  { id:"U03", projectId:"P01", floor:5,  unitNo:"501",  type:"apartment", bedrooms:3, size:"1,650 sqft", rent:125000, status:"vacant" },
  { id:"U04", projectId:"P01", floor:7,  unitNo:"701",  type:"apartment", bedrooms:2, size:"1,200 sqft", rent:100000, status:"leased" },
  { id:"U05", projectId:"P01", floor:10, unitNo:"1001", type:"apartment", bedrooms:3, size:"1,800 sqft", rent:145000, status:"leased" },
  { id:"U06", projectId:"P02", floor:1,  unitNo:"G-01", type:"retail",    size:"800 sqft",   rent:200000, status:"leased" },
  { id:"U07", projectId:"P02", floor:2,  unitNo:"201",  type:"office",    size:"1,500 sqft", rent:175000, status:"leased" },
  { id:"U08", projectId:"P02", floor:3,  unitNo:"301",  type:"office",    size:"2,000 sqft", rent:220000, status:"vacant" },
  { id:"U09", projectId:"P02", floor:4,  unitNo:"401",  type:"office",    size:"1,800 sqft", rent:195000, status:"leased" },
  { id:"U10", projectId:"P03", floor:1,  unitNo:"G-02", type:"retail",    size:"600 sqft",   rent:160000, status:"leased" },
  { id:"U11", projectId:"P03", floor:5,  unitNo:"501",  type:"apartment", bedrooms:2, size:"1,100 sqft", rent:110000, status:"leased" },
  { id:"U12", projectId:"P03", floor:8,  unitNo:"801",  type:"apartment", bedrooms:3, size:"1,550 sqft", rent:140000, status:"vacant" },
  { id:"U13", projectId:"P03", floor:12, unitNo:"1201", type:"apartment", bedrooms:4, size:"2,200 sqft", rent:210000, status:"leased" },
  { id:"U14", projectId:"P04", floor:2,  unitNo:"201",  type:"office",    size:"1,200 sqft", rent:95000,  status:"leased" },
  { id:"U15", projectId:"P04", floor:3,  unitNo:"301",  type:"office",    size:"900 sqft",   rent:75000,  status:"leased" },
  { id:"U16", projectId:"P04", floor:5,  unitNo:"501",  type:"office",    size:"2,500 sqft", rent:180000, status:"vacant" },
  { id:"U17", projectId:"P05", floor:1,  unitNo:"G-01", type:"retail",    size:"450 sqft",   rent:90000,  status:"leased" },
  { id:"U18", projectId:"P05", floor:4,  unitNo:"401",  type:"office",    size:"1,100 sqft", rent:85000,  status:"leased" },
  { id:"U19", projectId:"P05", floor:7,  unitNo:"701",  type:"apartment", bedrooms:2, size:"1,050 sqft", rent:80000,  status:"leased" },
  { id:"U20", projectId:"P05", floor:9,  unitNo:"901",  type:"apartment", bedrooms:3, size:"1,400 sqft", rent:105000, status:"vacant" },
];

export const CLIENTS = [
  { id:"C01", name:"Sara Akhtar",    phone:"+92 300 1234567", email:"sara.akhtar@gmail.com",    cnic:"35202-1234567-8", city:"Lahore",     unitId:"U01", score:92, status:"Top priority", statusColor:"green", rentAmount:120000, paymentStatus:"paid",     waSummary:"Client confirmed willingness to renew at 18% above current rate. Very responsive and ready to sign this week.", waSummaryUrdu:"Client ne kaha ke wo 18% zyada rent dene ko tayar hai. Is hafte sign karna chahti hai.", waTags:["Ready to sign","Price agreed"],    waSentiment:"positive", riskFlags:[],                                                              nextNudge:"Send lease renewal document today",             notes:"Long-term tenant. Always pays on time." },
  { id:"C02", name:"Kamran Mirza",   phone:"+92 321 9876543", email:"kamran.m@hotmail.com",     cnic:"42201-9876543-2", city:"Rawalpindi", unitId:"U07", score:85, status:"Negotiating",  statusColor:"blue",  rentAmount:175000, paymentStatus:"paid",     waSummary:"Negotiating 15% rent increase. Agreed in principle but wants renovation first.",                              waSummaryUrdu:"15% izafa pe raazi hai lekin renovation chahta hai. Tone positive hai.",                 waTags:["Negotiating","Increase agreed"],   waSentiment:"positive", riskFlags:[],                                                              nextNudge:"Follow up on renovation request",               notes:"Corporate tenant. Responds quickly." },
  { id:"C03", name:"Fatima Qureshi", phone:"+92 333 5554433", email:"fatimaq@yahoo.com",        cnic:"61101-5554433-1", city:"Islamabad",  unitId:null,  score:78, status:"Interested",   statusColor:"blue",  rentAmount:null,   paymentStatus:"prospect", waSummary:"Enquiry about 3-bed apartment. Budget around Rs. 140,000/month. Flexible on move-in date.",                  waSummaryUrdu:"3-bed apartment chahiye. Budget 140,000 rupay. Date flexible hai.",                      waTags:["New enquiry","Viewing requested"], waSentiment:"positive", riskFlags:[],                                                              nextNudge:"Schedule site visit this week",                 notes:"Referred by Sara Akhtar." },
  { id:"C04", name:"Ahmed Hassan",   phone:"+92 311 7778899", email:"ahmed.hassan@gmail.com",   cnic:"35301-7778899-3", city:"Rawalpindi", unitId:"U02", score:41, status:"Cooling off",  statusColor:"amber", rentAmount:95000,  paymentStatus:"overdue",  waSummary:"Hesitant on rent increase. Asked about flexible payments. No reply in 9 days.",                               waSummaryUrdu:"Rent badhane se pareshan hai. Flexible payment manga tha. 9 din se jawab nahi.",          waTags:["Hesitant","No response"],         waSentiment:"negative", riskFlags:["No reply 9 days","Overdue 37 days"],                   nextNudge:"Soft check-in — last chance before escalation", notes:"Something changed around March." },
  { id:"C05", name:"Zara Baig",      phone:"+92 345 2221100", email:"zara.baig@live.com",       cnic:"42301-2221100-9", city:"Karachi",    unitId:"U11", score:22, status:"At risk",      statusColor:"red",   rentAmount:110000, paymentStatus:"overdue",  waSummary:"Consistently late since January. Mentioned financial difficulties and possibly vacating early.",               waSummaryUrdu:"January se late chal rahi hai. Paison ki takleef aur jaldi khali karne ki baat ki.",     waTags:["Payment issues","Exit risk"],     waSentiment:"negative", riskFlags:["3rd late payment","Lease ends May 31","Early exit"], nextNudge:"Call directly — do not WhatsApp",               notes:"Handle carefully. Has two dependents." },
  { id:"C06", name:"Bilal Chaudhry", phone:"+92 300 6667788", email:"bilal.chaudhry@gmail.com", cnic:"35202-6667788-5", city:"Lahore",     unitId:"U04", score:67, status:"Active",       statusColor:"green", rentAmount:100000, paymentStatus:"paid",     waSummary:"Satisfied with property. Asked about parking for second vehicle.",                                            waSummaryUrdu:"Property se khush hai. Doosri gaari ke liye parking manga tha.",                         waTags:["Satisfied","Minor request"],      waSentiment:"positive", riskFlags:[],                                                              nextNudge:"Resolve parking query",                         notes:"First time renting independently." },
  { id:"C07", name:"Hina Siddiqui",  phone:"+92 321 3334455", email:"hina.s@gmail.com",         cnic:"42201-3334455-7", city:"Islamabad",  unitId:"U14", score:74, status:"Active",       statusColor:"green", rentAmount:95000,  paymentStatus:"paid",     waSummary:"Enquired about subletting part of office. Business is expanding.",                                            waSummaryUrdu:"Office ka kuch hissa sublet karna chahti hai. Business barh raha hai.",                  waTags:["Sublease interest","Expanding"],  waSentiment:"positive", riskFlags:[],                                                              nextNudge:"Discuss sublease terms — upsell opportunity",   notes:"Runs a boutique retail business." },
  { id:"C08", name:"Usman Raza",     phone:"+92 333 9990011", email:"usman.raza@outlook.com",   cnic:"61101-9990011-4", city:"Lahore",     unitId:null,  score:55, status:"Prospect",     statusColor:"blue",  rentAmount:null,   paymentStatus:"prospect", waSummary:"Interested in 3-bed in DHA tower. Budget Rs. 120,000-130,000. Visited once.",                                waSummaryUrdu:"DHA tower mein 3-bed chahiye. Budget 120,000-130,000. Ek baar dekh chuka hai.",          waTags:["Considering","Site visited"],     waSentiment:"neutral",  riskFlags:[],                                                              nextNudge:"Send unit comparison to nudge decision",        notes:"May want longer lease term." },
];

export const LEASES = [
  { id:"L01", clientId:"C01", unitId:"U01", rentAmount:120000, startDate:"2024-08-01", endDate:"2025-07-31", status:"active",     securityDeposit:360000, noticePeriod:60 },
  { id:"L02", clientId:"C02", unitId:"U07", rentAmount:175000, startDate:"2024-10-15", endDate:"2025-10-14", status:"active",     securityDeposit:525000, noticePeriod:90 },
  { id:"L03", clientId:"C04", unitId:"U02", rentAmount:95000,  startDate:"2024-12-01", endDate:"2025-11-30", status:"active",     securityDeposit:285000, noticePeriod:60 },
  { id:"L04", clientId:"C05", unitId:"U11", rentAmount:110000, startDate:"2024-06-01", endDate:"2025-05-31", status:"expiring",   securityDeposit:330000, noticePeriod:60 },
  { id:"L05", clientId:"C06", unitId:"U04", rentAmount:100000, startDate:"2025-01-01", endDate:"2025-12-31", status:"active",     securityDeposit:300000, noticePeriod:60 },
  { id:"L06", clientId:"C07", unitId:"U14", rentAmount:95000,  startDate:"2024-11-01", endDate:"2025-10-31", status:"active",     securityDeposit:285000, noticePeriod:60 },
  { id:"L07", clientId:"C06", unitId:"U09", rentAmount:195000, startDate:"2023-06-01", endDate:"2024-05-31", status:"terminated", securityDeposit:585000, noticePeriod:90 },
];

export const BOOKINGS = [
  { id:"B01", clientId:"C03", unitId:"U03", visitDate:"2025-05-14", visitTime:"11:00 AM", status:"scheduled", type:"viewing",    notes:"First viewing. Client wants 3-bed." },
  { id:"B02", clientId:"C08", unitId:"U01", visitDate:"2025-05-12", visitTime:"3:00 PM",  status:"scheduled", type:"viewing",    notes:"Second visit. Comparing units." },
  { id:"B03", clientId:"C01", unitId:"U01", visitDate:"2025-05-16", visitTime:"10:00 AM", status:"scheduled", type:"signing",    notes:"Lease renewal signing." },
  { id:"B04", clientId:"C02", unitId:"U07", visitDate:"2025-05-08", visitTime:"2:00 PM",  status:"completed", type:"inspection", notes:"Renovation inspection before renewal." },
  { id:"B05", clientId:"C05", unitId:"U11", visitDate:"2025-05-03", visitTime:"12:00 PM", status:"cancelled", type:"viewing",    notes:"Client cancelled — not responding." },
  { id:"B06", clientId:"C07", unitId:"U08", visitDate:"2025-05-20", visitTime:"11:30 AM", status:"scheduled", type:"viewing",    notes:"Interested in larger office for expansion." },
];

export const PAYMENTS = [
  { id:"PY01", clientId:"C05", unitId:"U11", amount:110000, due:"2025-03-12", paid:null,         status:"overdue",  daysLate:59, aiLabel:"Escalate",      aiColor:"red"   },
  { id:"PY02", clientId:"C04", unitId:"U02", amount:95000,  due:"2025-04-01", paid:null,         status:"overdue",  daysLate:39, aiLabel:"Likely to miss", aiColor:"amber" },
  { id:"PY03", clientId:"C01", unitId:"U01", amount:120000, due:"2025-05-01", paid:"2025-05-01", status:"paid",     daysLate:0,  aiLabel:"On time",        aiColor:"green" },
  { id:"PY04", clientId:"C02", unitId:"U07", amount:175000, due:"2025-05-15", paid:null,         status:"upcoming", daysLate:0,  aiLabel:"Likely to pay",  aiColor:"blue"  },
  { id:"PY05", clientId:"C06", unitId:"U04", amount:100000, due:"2025-05-03", paid:"2025-05-03", status:"paid",     daysLate:0,  aiLabel:"On time",        aiColor:"green" },
  { id:"PY06", clientId:"C07", unitId:"U14", amount:95000,  due:"2025-05-02", paid:"2025-05-02", status:"paid",     daysLate:0,  aiLabel:"On time",        aiColor:"green" },
];

export const NUDGES = [
  { id:"N01", clientId:"C04", client:"Ahmed Hassan",  icon:"ti-message",           msg:"No reply in 9 days. Send a soft check-in before escalating.", urgency:"high",    action:"Draft message" },
  { id:"N02", clientId:"C01", client:"Sara Akhtar",   icon:"ti-file-text",         msg:"Client is ready to sign. Send lease renewal document today.", urgency:"high",    action:"Send lease"    },
  { id:"N03", clientId:"C05", client:"Zara Baig",     icon:"ti-phone",             msg:"Three consecutive late payments. Call directly.",             urgency:"critical", action:"Log call"      },
  { id:"N04", clientId:"C07", client:"Hina Siddiqui", icon:"ti-arrow-transfer-up", msg:"Sublease enquiry pending. Good upsell opportunity.",          urgency:"medium",  action:"Respond"       },
  { id:"N05", clientId:"C08", client:"Usman Raza",    icon:"ti-building-estate",   msg:"Visited DHA tower. Send comparison to nudge decision.",       urgency:"medium",  action:"Send sheet"    },
];

export const RISKS = [
  { id:"R01", clientId:"C05", client:"Zara Baig",    unitId:"U11", reason:"3rd consecutive late payment — 59 days overdue",             level:"critical" },
  { id:"R02", clientId:"C04", client:"Ahmed Hassan", unitId:"U02", reason:"No WhatsApp reply in 9 days, renewal window closing",         level:"high"     },
  { id:"R03", unitId:"U03",   client:"–",            reason:"DHA Tower Unit 501 vacant for 45 days — no active leads",                  level:"medium"   },
  { id:"R04", clientId:"C05", client:"Zara Baig",    unitId:"U11", reason:"Client mentioned early exit — lease ends May 31",             level:"high"     },
  { id:"R05", unitId:"U08",   client:"–",            reason:"Bahria Business Centre Unit 301 vacant — 2nd consecutive month",           level:"medium"   },
];

export const FORECAST = [
  { month:"Jun", projected:2875000 },
  { month:"Jul", projected:2950000 },
  { month:"Aug", projected:3100000 },
  { month:"Sep", projected:2880000 },
  { month:"Oct", projected:3050000 },
  { month:"Nov", projected:2960000 },
];

export const PROJECT_REVENUE = [
  { projectId:"P01", collected:440000, overdue:95000,  upcoming:120000 },
  { projectId:"P02", collected:370000, overdue:0,      upcoming:220000 },
  { projectId:"P03", collected:460000, overdue:110000, upcoming:0      },
  { projectId:"P04", collected:170000, overdue:0,      upcoming:75000  },
  { projectId:"P05", collected:275000, overdue:0,      upcoming:105000 },
];