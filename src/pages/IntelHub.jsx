import { useState } from "react";
import { T } from "../theme";
import { NEIGHBORHOODS, fmtPrice } from "../data/market";
import {
  STR_STATS, SB9_PROJECTS, FORECLOSURE_DATA, FLOOD_DATA,
  CRIME_DATA, SCHOOL_DATA, INFRASTRUCTURE, ROAD_DATA, ZONING_DATA,
  TAX_DATA, OWNER_INSIGHTS, HOOD_INTEL, DATA_SOURCES
} from "../data/intelligence";
import { HeroCaptureForm, TabCaptureBanner, IntelCaptureModal } from "../components/IntelCapture";

const Lbl = ({children,style:s}) => <div style={{fontSize:10,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;
const Badge = ({children,color,style:s}) => <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:color+"18",color,...s}}>{children}</span>;
const hoodName = id => NEIGHBORHOODS.find(n=>n.id===id)?.name || id;

const TABS = [
  { id:"overview", label:"Overview", icon:"🧠" },
  { id:"str", label:"STR Permits", icon:"🏠" },
  { id:"sb9", label:"SB 9 / ADUs", icon:"🏗" },
  { id:"foreclosure", label:"Distressed", icon:"⚠️" },
  { id:"flood", label:"Flood & Risk", icon:"🌊" },
  { id:"crime", label:"Crime", icon:"🛡" },
  { id:"schools", label:"Schools", icon:"🎓" },
  { id:"infra", label:"Infrastructure", icon:"🚧" },
  { id:"zoning", label:"Zoning", icon:"📐" },
  { id:"tax", label:"Tax & Equity", icon:"💰" },
  { id:"sources", label:"Sources", icon:"📡" },
];

function Stat({label,value,sub,color,delay=0}) {
  return (
    <div className="anim-up" style={{animationDelay:`${delay}s`}}>
      <Lbl>{label}</Lbl>
      <div className="anim-num" style={{fontSize:28,fontWeight:900,color:color||T.text,letterSpacing:"-1px",marginTop:4,animationDelay:`${delay+0.1}s`}}>{value}</div>
      {sub && <div style={{fontSize:12,color:T.muted,marginTop:2}}>{sub}</div>}
    </div>
  );
}

/* ── LOCKED CARD (for paid-service sections) ── */
function LockedCard({title,service,description,cta}) {
  return (
    <Card style={{padding:32,textAlign:"center",background:"linear-gradient(135deg,#f8fafc,#f1f5f9)"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔒</div>
      <div style={{fontSize:20,fontWeight:900,color:T.text,marginBottom:8}}>{title}</div>
      <p style={{fontSize:14,color:T.sec,lineHeight:1.6,maxWidth:480,margin:"0 auto 16px"}}>{description}</p>
      <Badge color="#f59e0b" style={{fontSize:12,padding:"6px 16px"}}>{service}</Badge>
      {cta && <p style={{fontSize:12,color:T.muted,marginTop:12}}>{cta}</p>}
    </Card>
  );
}

/* ══════ OVERVIEW TAB ══════ */
function Overview({ onCapture }) {
  const liveSources = DATA_SOURCES.filter(s=>s.status==="live").length;
  const paidSources = DATA_SOURCES.filter(s=>s.status==="requires-subscription").length;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* ★ LEAD CAPTURE CARD */}
      <Card className="glow-card" style={{
        padding:"24px 28px",
        background:"linear-gradient(135deg,#f0fdf4,#ecfdf5,#f0fdf4)",
        border:`2px solid ${T.brand}33`,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <span style={{fontSize:28}}>🔍</span>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:T.text,letterSpacing:"-0.5px"}}>Get Your Property Intelligence Report</div>
            <div style={{fontSize:13,color:T.sec}}>Flood zone, school path, zoning, STR eligibility — personalized for your address</div>
          </div>
        </div>
        <HeroCaptureForm onResult={onCapture}/>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="stats-4col">
        {[
          {l:"Live Sources",v:liveSources,s:`+ ${paidSources} premium`,c:T.brand},
          {l:"Dev Projects",v:SB9_PROJECTS.length,s:"Active cases",c:"#8b5cf6"},
          {l:"STR Licensed",v:STR_STATS.totalPermitted,s:"Citywide",c:"#f59e0b"},
          {l:"Crime Trend",v:`${CRIME_DATA.trends.overallGroupA.change1yr}%`,s:"YoY change",c:"#10b981"},
        ].map((s,i)=>(
          <Card key={i} className="stat-card" style={{padding:"20px 16px"}}>
            <Stat label={s.l} value={s.v} sub={s.s} color={s.c} delay={i*0.05}/>
          </Card>
        ))}
      </div>

      <div style={{fontSize:20,fontWeight:900,color:T.text,letterSpacing:"-0.5px",marginTop:8}}>Neighborhood Intelligence</div>

      {NEIGHBORHOODS.map((n,idx)=>{
        const intel = HOOD_INTEL[n.id];
        if(!intel) return null;
        const flood = FLOOD_DATA.byHood[n.id];
        const schoolPath = SCHOOL_DATA.byHood[n.id];
        return (
          <Card key={n.id} className={`card-dynamic anim-up-d${Math.min(idx+1,5)}`} style={{padding:0,overflow:"hidden"}}>
            <div style={{height:4,background:`linear-gradient(90deg, ${n.color}, ${n.color}88)`}}/>
            <div style={{padding:"20px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:18,fontWeight:900,color:T.text}}>{n.name}</div>
                  <Badge color={intel.signal.includes("Active")?"#ef4444":intel.signal.includes("Value")?"#10b981":intel.signal.includes("Trophy")?"#8b5cf6":intel.signal.includes("Stable")?"#3b82f6":"#f59e0b"}>{intel.signal}</Badge>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:24,fontWeight:900,color:T.text,letterSpacing:"-1px"}}>{fmtPrice(n.med)}</div>
                  <span style={{fontSize:12,fontWeight:700,color:n.chg>0?T.pos:T.neg}}>{n.chg>0?"↑":"↓"} {Math.abs(n.chg)}% YoY</span>
                </div>
              </div>
              <p style={{fontSize:13,color:T.sec,lineHeight:1.6,marginBottom:16}}>{intel.narrative}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}} className="stats-4col">
                <div style={{padding:10,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>Flood Risk</div>
                  <div style={{fontSize:14,fontWeight:800,color:flood?.risk?.includes("Moderate")?"#f59e0b":T.pos}}>{flood?.risk || "—"}</div>
                </div>
                <div style={{padding:10,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>School Path</div>
                  <div style={{fontSize:11,fontWeight:700,color:T.text}}>{schoolPath ? schoolPath.split("→").pop().trim().substring(0,20) : "—"}</div>
                </div>
                <div style={{padding:10,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>Flood Zone</div>
                  <div style={{fontSize:11,fontWeight:700,color:T.text}}>{flood?.zone?.substring(0,12) || "—"}</div>
                </div>
              </div>
              {intel.keyFacts && (
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>
                  {intel.keyFacts.map((f,i)=><Badge key={i} color={n.color}>{f}</Badge>)}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ══════ STR TAB ══════ */
function STRTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="stats-4col">
        {[
          {l:"Total Licensed",v:STR_STATS.totalPermitted,c:T.brand},
          {l:"Avg Daily Rate",v:`$${STR_STATS.avgDailyRate}`,c:"#f59e0b"},
          {l:"Avg Annual Rev",v:`$${(STR_STATS.avgAnnualRevenue/1000).toFixed(0)}K`,c:"#3b82f6"},
          {l:"TOT Rate",v:`${STR_STATS.totRate}%`,c:"#ef4444"},
        ].map((s,i)=>(
          <Card key={i} className="stat-card" style={{padding:"20px 16px"}}>
            <Stat label={s.l} value={s.v} color={s.c} delay={i*0.05}/>
          </Card>
        ))}
      </div>

      <Card style={{padding:20}}>
        <Lbl style={{marginBottom:12}}>Regulation Summary</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="stats-2col">
          {[
            {l:"Citywide Cap",v:`${STR_STATS.capCitywide}% of housing units`},
            {l:"Coastal Zone Cap",v:`${STR_STATS.capCoastal}% (west of I-5)`},
            {l:"Max Permits Possible",v:STR_STATS.maxPermitsCitywide},
            {l:"Min Stay (Non-Hosted)",v:`${STR_STATS.minStayNonHosted} nights`},
            {l:"Proximity Rule",v:`${STR_STATS.proximityRestriction}ft between non-hosted`},
            {l:"Permit Fee",v:`$${STR_STATS.permitFee}/yr`},
            {l:"ADUs Allowed?",v:STR_STATS.prohibitedInADUs?"No — Prohibited":"Yes"},
            {l:"Sea Bluffs Exempt?",v:STR_STATS.seaBluffsExempt?"Yes":"No"},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:13,color:T.sec}}>{s.l}</span>
              <span style={{fontSize:13,fontWeight:700,color:T.text}}>{s.v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{padding:20}}>
        <Lbl style={{marginBottom:12}}>Top Guest Origins</Lbl>
        {STR_STATS.topGuestOrigins.map((g,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.text,fontWeight:600}}>{g.city}</span>
            <span style={{fontSize:13,fontWeight:700,color:T.brand}}>{g.pct}%</span>
          </div>
        ))}
        <div style={{fontSize:11,color:T.muted,marginTop:12}}>Source: {STR_STATS.dataSource}</div>
      </Card>
    </div>
  );
}

/* ══════ SB9 TAB ══════ */
function SB9Tab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="stats-4col">
        {[
          {l:"Active Projects",v:SB9_PROJECTS.length,c:T.brand},
          {l:"Approved",v:SB9_PROJECTS.filter(p=>p.status==="Approved").length,c:"#10b981"},
          {l:"Under Review",v:SB9_PROJECTS.filter(p=>p.status==="Under Review"||p.status==="Continued"||p.status==="EIR Phase").length,c:"#f59e0b"},
        ].map((s,i)=>(
          <Card key={i} className="stat-card" style={{padding:"20px 16px"}}>
            <Stat label={s.l} value={s.v} color={s.c} delay={i*0.05}/>
          </Card>
        ))}
      </div>
      {SB9_PROJECTS.map((p,i)=>(
        <Card key={i} className="card-dynamic" style={{padding:"16px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:T.text}}>{p.addr}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:2}}>{hoodName(p.hood)} · Case #{p.caseNo}</div>
            </div>
            <Badge color={p.status==="Approved"?"#10b981":p.status==="Under Review"?"#f59e0b":"#64748b"}>{p.status}</Badge>
          </div>
          <div style={{display:"flex",gap:12,marginTop:10,fontSize:12,color:T.sec}}>
            <span><strong>Type:</strong> {p.type}</span>
            {p.date && <span><strong>Date:</strong> {p.date}</span>}
          </div>
        </Card>
      ))}
      <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>Source: City of Encinitas Development Services Public Notices</div>
    </div>
  );
}

/* ══════ FORECLOSURE TAB ══════ */
function ForeclosureTab() {
  return (
    <LockedCard
      title="Foreclosure & Distressed Properties"
      service={FORECLOSURE_DATA.service + " — $119/mo"}
      description={FORECLOSURE_DATA.description}
      cta="Sign up for PropertyRadar free trial (5 days) to unlock NOD, NTS, and REO data for Encinitas."
    />
  );
}

/* ══════ FLOOD TAB ══════ */
function FloodTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {NEIGHBORHOODS.map((n,i)=>{
        const f = FLOOD_DATA.byHood[n.id];
        if(!f) return null;
        const riskColor = f.risk.includes("highest")?"#ef4444":f.risk.includes("Moderate")?"#f59e0b":"#10b981";
        return (
          <Card key={n.id} className={`card-dynamic anim-up-d${Math.min(i+1,5)}`} style={{padding:0,overflow:"hidden"}}>
            <div style={{height:4,background:riskColor}}/>
            <div style={{padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:16,fontWeight:800,color:T.text}}>{n.name}</div>
                <Badge color={riskColor}>{f.risk}</Badge>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}} className="stats-2col">
                <div>
                  <Lbl style={{marginBottom:4}}>FEMA Zone</Lbl>
                  <div style={{fontSize:13,color:T.text,fontWeight:600}}>{f.zone}</div>
                </div>
                <div>
                  <Lbl style={{marginBottom:4}}>Insurance</Lbl>
                  <div style={{fontSize:13,color:T.text,fontWeight:600}}>{f.insurance}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:T.sec,lineHeight:1.6,background:"#f8fafc",padding:12,borderRadius:10}}>
                <strong>Key Areas:</strong> {f.keyAreas}
              </div>
            </div>
          </Card>
        );
      })}
      <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>{FLOOD_DATA.dataSource}</div>
    </div>
  );
}

/* ══════ CRIME TAB ══════ */
function CrimeTab() {
  const t = CRIME_DATA.trends;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="stats-4col">
        {[
          {l:"Overall Crime",v:`${t.overallGroupA.change1yr}%`,s:"vs 2023",c:"#10b981"},
          {l:"Property Crime",v:`${t.propertyOffenses.change1yr}%`,s:"vs 2023",c:"#10b981"},
          {l:"Persons Offenses",v:`+${t.personsOffenses.change1yr}%`,s:"vs 2023 (flat vs 2021)",c:"#ef4444"},
          {l:"Society Offenses",v:`${t.societyOffenses.change1yr}%`,s:"vs 2023",c:"#10b981"},
        ].map((s,i)=>(
          <Card key={i} className="stat-card" style={{padding:"20px 16px"}}>
            <Stat label={s.l} value={s.v} sub={s.s} color={s.c} delay={i*0.05}/>
          </Card>
        ))}
      </div>

      <Card style={{padding:20}}>
        <Lbl style={{marginBottom:12}}>Crimes Against Persons (2024)</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="stats-4col">
          {Object.entries(CRIME_DATA.personsDetail).map(([k,v],i)=>(
            <div key={i} style={{padding:12,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
              <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>{k.replace(/([A-Z])/g,' $1').trim()}</div>
              <div style={{fontSize:20,fontWeight:900,color:T.text}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{padding:20}}>
        <Lbl style={{marginBottom:12}}>Crimes Against Property (2024)</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="stats-4col">
          {Object.entries(CRIME_DATA.propertyDetail).map(([k,v],i)=>(
            <div key={i} style={{padding:12,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
              <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>{k.replace(/([A-Z])/g,' $1').trim()}</div>
              <div style={{fontSize:20,fontWeight:900,color:T.text}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{padding:16,background:"#f0fdf4",border:"2px solid #10b98122"}}>
        <p style={{fontSize:13,color:T.sec,lineHeight:1.6,margin:0}}>{CRIME_DATA.context}</p>
      </Card>
      <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>{CRIME_DATA.dataSource}</div>
    </div>
  );
}

/* ══════ SCHOOLS TAB ══════ */
function SchoolsTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card style={{padding:16,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",border:`2px solid ${T.brand}22`}}>
        <div style={{fontSize:14,fontWeight:800,color:T.brand,marginBottom:4}}>🎓 {SCHOOL_DATA.districtRanking}</div>
      </Card>

      <Lbl style={{marginTop:8}}>Elementary Schools</Lbl>
      {SCHOOL_DATA.elementary.map((s,i)=>(
        <Card key={i} className="card-dynamic" style={{padding:"14px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:T.text}}>{s.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{hoodName(s.hood)} · {s.students ? `${s.students} students` : ""}</div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {s.gs && <Badge color="#10b981">GS {s.gs}/10</Badge>}
              {s.niche && <Badge color="#3b82f6">Niche {s.niche}</Badge>}
            </div>
          </div>
          <div style={{display:"flex",gap:16,marginTop:8,fontSize:12,color:T.sec}}>
            {s.math && <span>Math: <strong>{s.math}%</strong></span>}
            {s.read && <span>Reading: <strong>{s.read}%</strong></span>}
            {s.note && <span style={{color:T.muted}}>· {s.note}</span>}
          </div>
        </Card>
      ))}

      <Lbl style={{marginTop:12}}>Middle & High Schools</Lbl>
      {SCHOOL_DATA.secondary.map((s,i)=>(
        <Card key={i} className="card-dynamic" style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:T.text}}>{s.name}</div>
            <div style={{fontSize:12,color:T.muted}}>{s.type} School {s.note ? `· ${s.note}` : ""}</div>
          </div>
          {s.gs && <Badge color="#10b981">GS {s.gs}/10</Badge>}
        </Card>
      ))}

      <Lbl style={{marginTop:12}}>School Paths by Neighborhood</Lbl>
      {NEIGHBORHOODS.map(n=>{
        const path = SCHOOL_DATA.byHood[n.id];
        if(!path) return null;
        return (
          <Card key={n.id} style={{padding:"12px 20px"}}>
            <div style={{fontSize:13,fontWeight:700,color:n.color,marginBottom:4}}>{n.name}</div>
            <div style={{fontSize:12,color:T.sec}}>{path}</div>
          </Card>
        );
      })}
      <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>{SCHOOL_DATA.dataSource}</div>
    </div>
  );
}

/* ══════ INFRASTRUCTURE TAB ══════ */
function InfraTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {INFRASTRUCTURE.map((p,i)=>(
        <Card key={i} className={`card-dynamic anim-up-d${Math.min(i+1,5)}`} style={{padding:"16px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:16,fontWeight:800,color:T.text}}>{p.name}</div>
            <Badge color={p.status==="In Progress"?"#10b981":p.status==="CIP"?"#3b82f6":"#f59e0b"}>{p.status}</Badge>
          </div>
          <p style={{fontSize:13,color:T.sec,lineHeight:1.5,margin:0}}>{p.desc}</p>
          <div style={{fontSize:11,color:T.muted,marginTop:6}}>Impact: {p.impact}</div>
        </Card>
      ))}
      <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>Source: City of Encinitas CIP & Council Agendas</div>
    </div>
  );
}

/* ══════ ZONING TAB ══════ */
function ZoningTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {NEIGHBORHOODS.map((n,i)=>{
        const z = ZONING_DATA.byHood[n.id];
        if(!z) return null;
        const overlays = z.overlay.split(", ");
        return (
          <Card key={n.id} className={`card-dynamic anim-up-d${Math.min(i+1,5)}`} style={{padding:"16px 20px"}}>
            <div style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:10}}>{n.name}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}} className="stats-4col">
              {[
                {l:"Primary Zoning",v:z.primary},
                {l:"Coastal Zone",v:z.coastal?"Yes":"No"},
                {l:"STR Eligible",v:z.strEligible?"Yes":"No"},
              ].map((s,j)=>(
                <div key={j} style={{padding:10,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
                  <div style={{fontSize:14,fontWeight:800,color:T.text}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
              {overlays.map(o=><Badge key={o} color="#8b5cf6">{o}</Badge>)}
            </div>
          </Card>
        );
      })}
      <div style={{fontSize:11,color:T.muted,textAlign:"center"}}>{ZONING_DATA.dataSource}</div>
    </div>
  );
}

/* ══════ TAX TAB ══════ */
function TaxTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <LockedCard
        title="Property Tax & Equity Analysis"
        service={TAX_DATA.service}
        description={OWNER_INSIGHTS.description}
        cta={TAX_DATA.freeOption}
      />
      <Card style={{padding:16,background:"#f8fafc"}}>
        <Lbl style={{marginBottom:8}}>Prop 13 Context</Lbl>
        <p style={{fontSize:12,color:T.sec,lineHeight:1.5,margin:0}}>{TAX_DATA.prop13Note}</p>
      </Card>
    </div>
  );
}

/* ══════ SOURCES TAB ══════ */
function SourcesTab() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Card style={{padding:16,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5,#f8fafc)",border:`2px solid ${T.brand}22`}}>
        <div style={{fontSize:13,fontWeight:700,color:T.brand,marginBottom:4}}>
          {DATA_SOURCES.filter(s=>s.status==="live").length} Live Data Sources · {DATA_SOURCES.filter(s=>s.status==="requires-subscription").length} Premium Sources Available
        </div>
        <p style={{fontSize:12,color:T.sec,lineHeight:1.5,margin:0}}>All data sourced from publicly available government records, open data portals, and verified third-party sources. No fabricated data.</p>
      </Card>
      {DATA_SOURCES.map((s,i)=>(
        <Card key={i} className="card-dynamic" style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:T.text}}>{s.name}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.source} · {s.freq}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {s.cost!=="Free" && s.cost!=="N/A" && <Badge color="#f59e0b">{s.cost}</Badge>}
            {s.status==="live" ? (
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div className="live-dot"/>
                <span style={{fontSize:10,fontWeight:700,color:T.pos}}>LIVE</span>
              </div>
            ) : s.status==="requires-subscription" ? (
              <Badge color="#64748b">🔒 Premium</Badge>
            ) : (
              <Badge color="#94a3b8">Unavailable</Badge>
            )}
          </div>
        </Card>
      ))}
      <div style={{textAlign:"center",padding:16,fontSize:11,color:T.muted}}>
        David Rose · HomeSmart Realty West · TheEncinitasReport.com
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN INTEL HUB
   ══════════════════════════════════════ */
export default function IntelHub() {
  const [tab, setTab] = useState("overview");
  const [captureModal, setCaptureModal] = useState(null); // { address, neighborhood }

  const handleCaptureResult = ({ address, neighborhood }) => {
    setCaptureModal({ address, neighborhood });
  };

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 32px 60px"}}>
      {/* CAPTURE MODAL */}
      {captureModal && (
        <IntelCaptureModal
          address={captureModal.address}
          neighborhood={captureModal.neighborhood}
          onClose={()=>setCaptureModal(null)}
          onComplete={(data)=>console.log("Lead captured:",data)}
        />
      )}

      {/* HERO */}
      <div className="hero-gradient tech-grid" style={{padding:"36px 32px",borderRadius:20,marginLeft:-32,marginRight:-32,marginTop:-32,paddingTop:48,marginBottom:24}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="anim-up" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(255,255,255,0.8)",backdropFilter:"blur(8px)",marginBottom:16}}>
            <div className="live-dot"/>
            <span style={{fontSize:11,fontWeight:700,color:T.brandDk,textTransform:"uppercase",letterSpacing:"1px"}}>{DATA_SOURCES.filter(s=>s.status==="live").length} Live Data Sources · Real Data Only</span>
          </div>
          <h1 className="anim-up-d1" style={{fontSize:42,fontWeight:900,color:T.text,letterSpacing:"-2px",margin:0,lineHeight:1}}>Intelligence</h1>
          <h1 className="anim-up-d2 gradient-text" style={{fontSize:42,fontWeight:900,letterSpacing:"-2px",margin:0,lineHeight:1.1}}>Command Center</h1>
          <p className="anim-up-d3" style={{fontSize:15,color:T.sec,marginTop:12,lineHeight:1.5,maxWidth:560}}>
            STR regulations, development projects, flood zones, crime stats, school ratings, infrastructure, and zoning — sourced from SANDAG, FEMA, GreatSchools, and City of Encinitas public records.
          </p>

          {/* ★ PHASE 1: LEAD CAPTURE CTA */}
          <div className="anim-up-d4">
            <HeroCaptureForm onResult={handleCaptureResult} />
          </div>

          <div className="anim-up-d5" style={{marginTop:12,fontSize:12,color:T.muted}}>
            David Rose · HomeSmart Realty West · TheEncinitasReport.com
          </div>
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20,padding:"8px",background:"white",borderRadius:14,border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className="nav-btn" style={{
            padding:"8px 14px",borderRadius:10,fontSize:12,border:"none",cursor:"pointer",
            fontWeight:tab===t.id?700:500,
            background:tab===t.id?"#ecfdf5":"transparent",
            color:tab===t.id?T.brandDk:T.sec,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div key={tab} className="anim-fade">
        {tab!=="overview" && tab!=="sources" && (
          <TabCaptureBanner
            tabName={TABS.find(t=>t.id===tab)?.label || tab}
            onResult={handleCaptureResult}
          />
        )}
        {tab==="overview" && <Overview onCapture={handleCaptureResult}/>}
        {tab==="str" && <STRTab/>}
        {tab==="sb9" && <SB9Tab/>}
        {tab==="foreclosure" && <ForeclosureTab/>}
        {tab==="flood" && <FloodTab/>}
        {tab==="crime" && <CrimeTab/>}
        {tab==="schools" && <SchoolsTab/>}
        {tab==="infra" && <InfraTab/>}
        {tab==="zoning" && <ZoningTab/>}
        {tab==="tax" && <TaxTab/>}
        {tab==="sources" && <SourcesTab/>}
      </div>
    </div>
  );
}
