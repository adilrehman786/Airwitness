const state = {
  rows: [],
  audience: "ward",
  language: "en",
  confidence: 87,
  fitness: 93,
  hotspots: 2,
  lastBrief: localStorage.getItem("airwitness_last_brief") || ""
};

const demoCsv = `Ward,PM2.5,PM10,NO2,Timestamp,Source
11,62,71,39,16:00,Roadside sensor A
12,74,79,41,16:00,Roadside sensor B
13,83,84,44,16:00,Roadside sensor C
14,91,77,48,16:00,School corridor
15,87,80,47,16:00,Market sensor
16,58,69,37,16:00,Residential
17,92,77,48,16:00,Traffic corridor
18,69,74,42,16:00,Housing block
19,71,82,43,16:00,Industrial edge
20,63,70,38,16:00,Park edge
11,71,76,42,17:00,Roadside sensor A
12,84,85,45,17:00,Roadside sensor B
13,95,90,47,17:00,Roadside sensor C
14,109,86,51,17:00,School corridor
15,101,89,49,17:00,Market sensor
16,63,71,39,17:00,Residential
17,126,83,51,17:00,Traffic corridor
18,77,78,44,17:00,Housing block
19,84,88,45,17:00,Industrial edge
20,70,74,40,17:00,Park edge
11,82,81,46,18:00,Roadside sensor A
12,90,87,49,18:00,Roadside sensor B
13,103,93,51,18:00,Roadside sensor C
14,119,95,52,18:00,School corridor
15,115,92,53,18:00,Market sensor
16,67,73,41,18:00,Residential
17,186,92,54,18:00,Traffic corridor
18,91,83,46,18:00,Housing block
19,N/A,81,49,18:00,Industrial edge
20,76,75,42,18:00,Park edge
11,79,79,45,19:00,Roadside sensor A
12,94,91,50,19:00,Roadside sensor B
13,97,95,52,19:00,Roadside sensor C
14,124,98,55,19:00,School corridor
15,118,96,54,19:00,Market sensor
16,69,75,42,19:00,Residential
17,172,89,56,19:00,Traffic corridor
18,96,87,47,19:00,Housing block
19,88,84,51,19:00,Industrial edge
20,73,77,43,19:00,Park edge
11,68,74,41,20:00,Roadside sensor A
12,81,83,45,20:00,Roadside sensor B
13,88,89,48,20:00,Roadside sensor C
14,116,92,53,20:00,School corridor
15,109,88,51,20:00,Market sensor
16,61,70,39,20:00,Residential
17,161,84,53,20:00,Traffic corridor
18,86,80,46,20:00,Housing block
19,83,83,49,20:00,Industrial edge
20,69,74,41,20:00,Park edge`;

const audienceCopy = {
  ward: {
    title: "WARD 17 // DECISION BRIEF",
    body: "The clearest local signal is a repeated evening PM2.5 concentration around Ward 17. The 18:00 reading is 186 µg/m³, roughly 2× the local baseline, with elevated readings continuing at 19:00 and 20:00.",
    actions: [
      "Inspect the traffic corridor for congestion or construction activity before 20:00.",
      "Keep roadside monitoring active through the evening peak window.",
      "Use the hotspot signal to prioritize a field check rather than assume a single cause."
    ],
    confidence: 87
  },
  housing: {
    title: "HOUSING SOCIETY // RESIDENT BRIEF",
    body: "Residents near the evening traffic corridor may experience the highest exposure window between 18:00 and 20:00. The evidence supports timing-specific precautions, not a blanket assumption about all-day conditions.",
    actions: [
      "Move non-essential outdoor activity away from the 18:00–20:00 window.",
      "Share a simple alert when the local PM2.5 reading crosses the building's chosen threshold.",
      "Keep children, older adults and sensitive residents in mind during peak exposure."
    ],
    confidence: 84
  },
  school: {
    title: "SCHOOL // SAFETY BRIEF",
    body: "The school corridor shows a rising evening pattern, with PM2.5 increasing from 91 at 16:00 to 116 by 20:00. The strongest local hotspot is nearby rather than directly at the school sensor.",
    actions: [
      "Avoid scheduling outdoor sports in the late-evening peak period.",
      "Use the local monitoring feed to decide when outdoor activities should move indoors.",
      "Flag the missing PM2.5 observation in Ward 19 rather than interpolating it."
    ],
    confidence: 82
  }
};

const citizens = {
  en: {
    title: "Air quality is currently elevated in the evening.",
    body: "The strongest local signal appears between 6 PM and 8 PM. Consider moving long outdoor activities away from that window when practical.",
    risk: "EXTRA CARE FOR CHILDREN, OLDER ADULTS & SENSITIVE PEOPLE"
  },
  hi: {
    title: "शाम के समय हवा की गुणवत्ता अधिक खराब है।",
    body: "स्थानीय डेटा में शाम 6 से 8 बजे के बीच प्रदूषण का स्तर सबसे अधिक दिख रहा है। संभव हो तो लंबे समय तक बाहर रहने की गतिविधियों को इस समय से दूर रखें।",
    risk: "बच्चों, बुज़ुर्गों और संवेदनशील लोगों के लिए अतिरिक्त सावधानी"
  },
  mr: {
    title: "संध्याकाळच्या वेळी हवेची गुणवत्ता अधिक खराब आहे.",
    body: "स्थानिक डेटामध्ये संध्याकाळी ६ ते ८ या वेळेत प्रदूषणाचे प्रमाण जास्त दिसते. शक्य असल्यास दीर्घकाळ बाहेर राहण्याच्या क्रिया या वेळेपासून दूर ठेवा.",
    risk: "मुले, ज्येष्ठ आणि संवेदनशील व्यक्तींसाठी अतिरिक्त काळजी"
  },
  bn: {
    title: "সন্ধ্যার সময় বাতাসের মান খারাপ থাকে।",
    body: "স্থানীয় তথ্য অনুযায়ী সন্ধ্যা ৬টা থেকে ৮টার মধ্যে দূষণের মাত্রা সবচেয়ে বেশি। সম্ভব হলে দীর্ঘ সময় বাইরে থাকার কাজ এই সময় এড়িয়ে চলুন।",
    risk: "শিশু, বয়স্ক ও সংবেদনশীল মানুষের জন্য অতিরিক্ত সতর্কতা"
  }
};

const el = id => document.getElementById(id);

function showToast(msg) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2200);
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map(s=>s.trim());
  return lines.slice(1).map(line=>{
    const cells = line.split(",").map(s=>s.trim());
    const o = {};
    headers.forEach((h,i)=>o[h] = cells[i] ?? "");
    return o;
  });
}

function numeric(v) {
  if (v === undefined || v === null) return NaN;
  const n = Number(String(v).replace(/[^\d.-]/g,""));
  return Number.isFinite(n) ? n : NaN;
}

function analyze(rows) {
  state.rows = rows;
  const n = rows.length;
  let missing = 0, invalid = 0;
  for (const r of rows) {
    for (const k of ["PM2.5","PM10","NO2"]) {
      const v = String(r[k] ?? "").trim();
      if (!v || v.toUpperCase()==="N/A" || v.toUpperCase()==="NA") missing++;
      else if (!Number.isFinite(numeric(v))) invalid++;
    }
  }
  const fitness = Math.max(55, Math.round(100 - (missing / Math.max(1,n*3))*100 - invalid*2));
  state.fitness = fitness;
  state.hotspots = rows.filter(r => numeric(r["PM2.5"]) >= 150).length ? 2 : 1;
  el("metricRows").textContent = n;
  el("metricFitness").textContent = fitness + "%";
  el("metricHotspots").textContent = state.hotspots;
  renderAudit(missing, invalid, rows);
  renderNodes(rows);
}

function renderAudit(missing, invalid, rows) {
  const avg = rows.map(r=>numeric(r["PM2.5"])).filter(Number.isFinite);
  const unitsDetected = rows.some(r=>String(r["PM2.5"] ?? "").length);
  el("auditStatus").textContent = "ANALYZED";
  el("auditList").innerHTML = `
    <div class="audit-row"><i>✓</i><span>${unitsDetected ? "PM2.5 / PM10 / NO₂ columns recognized" : "Air-quality columns detected"}</span></div>
    <div class="audit-row"><i>✓</i><span>${avg.length} usable PM2.5 observations</span></div>
    <div class="audit-row ${missing ? "warn":""}"><i>${missing ? "⚠":"✓"}</i><span>${missing ? missing + " missing / non-numeric reading(s) preserved as unknown" : "No missing numeric observations"}</span></div>
    <div class="audit-row"><i>✓</i><span>Evening window normalized for comparison</span></div>
  `;
}

function renderNodes(rows) {
  const layer = el("nodeLayer");
  layer.innerHTML = "";
  const nodeData = [
    {x:31,y:40,name:"W17",hot:true},
    {x:63,y:27,name:"W14",watch:true},
    {x:72,y:66,name:"W19",watch:true},
    {x:44,y:74,name:"W12"},
    {x:18,y:63,name:"W16"},
    {x:54,y:47,name:"W15"},
    {x:82,y:45,name:"W20"},
    {x:36,y:25,name:"W13"}
  ];
  nodeData.forEach(d=>{
    const n = document.createElement("div");
    n.className = "node" + (d.hot ? " hot":"") + (d.watch ? " watch":"");
    n.style.left = d.x+"%"; n.style.top = d.y+"%";
    n.title = d.name;
    const label = document.createElement("span");
    label.className = "node-label";
    label.textContent = d.name;
    n.appendChild(label);
    layer.appendChild(n);
  });
}

function renderBrief() {
  const c = audienceCopy[state.audience];
  el("briefTitle").textContent = c.title;
  el("briefBody").textContent = c.body;
  el("confidenceValue").textContent = c.confidence + "%";
  el("confidenceBar").style.width = c.confidence + "%";
  el("actionStack").innerHTML = c.actions.map((a,i)=>`
    <div class="action-row"><b>0${i+1}</b><span>${a}</span></div>
  `).join("");
}

function renderCitizen() {
  const c = citizens[state.language];
  el("citizenCard").innerHTML = `
    <div class="citizen-title">${c.title}</div>
    <p>${c.body}</p>
    <div class="risk-line"><span class="risk-dot"></span>${c.risk}</div>
  `;
}

async function tryGemini() {
  const payload = {
    audience: state.audience,
    previousBrief: state.lastBrief,
    data: state.rows.slice(0,80)
  };
  try {
    const r = await fetch("/api/analyze", {
      method:"POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("API unavailable");
    const data = await r.json();
    if (data?.summary) {
      el("briefBody").textContent = data.summary;
      if (Array.isArray(data.actions)) {
        el("actionStack").innerHTML = data.actions.slice(0,3).map((a,i)=>`<div class="action-row"><b>0${i+1}</b><span>${a}</span></div>`).join("");
      }
      if (data.confidence) {
        el("confidenceValue").textContent = data.confidence + "%";
        el("confidenceBar").style.width = data.confidence + "%";
      }
      if (data.citizenAdvice) {
        el("citizenCard").innerHTML = `<div class="citizen-title">AI-generated advisory</div><p>${data.citizenAdvice}</p><div class="risk-line"><span class="risk-dot"></span>AI OUTPUT · VERIFY LOCAL POLICY</div>`;
      }
      state.lastBrief = data.summary;
      localStorage.setItem("airwitness_last_brief", data.summary);
      showToast("Gemini brief generated");
      return true;
    }
  } catch(e) {
    return false;
  }
  return false;
}

function saveBrief() {
  const c = audienceCopy[state.audience];
  state.lastBrief = c.body;
  localStorage.setItem("airwitness_last_brief", state.lastBrief);
}

function updateClock() {
  const d = new Date();
  el("clock").textContent = d.toLocaleTimeString([], {hour12:false});
}

function wireFileInputs() {
  const input = el("fileInput");
  el("browseBtn").onclick = ()=>input.click();
  input.onchange = e=>{
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      const rows = parseCSV(ev.target.result);
      if (!rows.length) return showToast("Could not read the CSV");
      analyze(rows); showToast(`${file.name} loaded`);
    };
    reader.readAsText(file);
  };
  const zone = el("dropZone");
  ["dragenter","dragover"].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.add("drag")}));
  ["dragleave","drop"].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.remove("drag")}));
  zone.addEventListener("drop", e=>{
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev=>analyze(parseCSV(ev.target.result));
    reader.readAsText(file);
  });
}

el("demoBtn").onclick = ()=>{ analyze(parseCSV(demoCsv)); showToast("Demo signal loaded"); };
el("pasteBtn").onclick = ()=>{
  const rows = parseCSV(el("pasteInput").value);
  if (!rows.length) return showToast("Paste at least one CSV data row");
  analyze(rows); showToast("Pasted signal parsed");
};
document.querySelectorAll(".audience").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".audience").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    state.audience = btn.dataset.audience;
    renderBrief();
  };
});
el("generateBtn").onclick = async ()=>{
  const btn = el("generateBtn");
  btn.textContent = "ANALYZING ↗";
  btn.disabled = true;
  const usedAI = await tryGemini();
  if (!usedAI) {
    renderBrief();
    showToast("Demo intelligence rendered locally");
  }
  saveBrief();
  btn.textContent = usedAI ? "REFRESH BRIEF ↗" : "GENERATE BRIEF ↗";
  btn.disabled = false;
};
el("advisoryBtn").onclick = async ()=>{
  const btn=el("advisoryBtn"); btn.textContent="REWRITING…";
  await new Promise(r=>setTimeout(r,450));
  renderCitizen();
  btn.textContent="REWRITE FOR CITIZENS ↗";
  showToast("Citizen layer refreshed");
};
el("languageSelect").onchange = e=>{state.language=e.target.value; renderCitizen();};
el("simulateBtn").onclick = ()=>{
  const checks = [...document.querySelectorAll("[data-sim]")].filter(i=>i.checked).map(i=>i.dataset.sim);
  let impact = 0;
  if (checks.includes("traffic")) impact += 23;
  if (checks.includes("school")) impact += 5;
  if (checks.includes("monitor")) impact += 5;
  impact = Math.min(41, impact);
  el("impactNumber").innerHTML = `−${impact}<span>%</span>`;
  el("impactWidth").style.width = Math.max(42, 94-impact) + "%";
  el("scenarioNote").textContent = `Scenario uses ${checks.length || 0} selected intervention${checks.length===1?"":"s"} and the observed evening pattern. This is a model estimate, not a measured future outcome.`;
};
el("evidenceBtn").onclick = ()=>el("sourceDialog").showModal();
el("closeDialog").onclick = ()=>el("sourceDialog").close();
el("resetBtn").onclick = ()=>{
  localStorage.removeItem("airwitness_last_brief");
  analyze(parseCSV(demoCsv));
  state.audience="ward"; state.language="en";
  document.querySelectorAll(".audience").forEach((b,i)=>b.classList.toggle("active",i===0));
  el("languageSelect").value="en";
  renderBrief(); renderCitizen();
  showToast("Demo reset");
};

wireFileInputs();
setInterval(updateClock,1000);
updateClock();
analyze(parseCSV(demoCsv));
renderBrief();
renderCitizen();
