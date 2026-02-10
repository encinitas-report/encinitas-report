import { useState } from "react";
import { T } from "./theme";
import { LogoIcon, LogoIconSmall } from "./Logo";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import RatesPage from "./pages/RatesPage";
import HomeValue from "./pages/HomeValue";
import Permits from "./pages/Permits";
import PropertyIntel from "./pages/PropertyIntel";
import WeeklyBrief from "./pages/WeeklyBrief";
import ContentEngine from "./pages/ContentEngine";

const PAGES = [
  { id:"dash", label:"Dashboard" },
  { id:"map", label:"Map" },
  { id:"report", label:"Rates" },
  { id:"permits", label:"Permits" },
  { id:"value", label:"Home Value" },
  { id:"intel", label:"Intel Report" },
  { id:"brief", label:"Weekly Brief" },
  { id:"content", label:"Content" },
];

export default function App() {
  const [page, setPage] = useState("dash");
  const [mob, setMob] = useState(false);

  const nav = (p) => { setPage(p); setMob(false); if(p!=="map") window.scrollTo({top:0,behavior:"smooth"}); };

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      <nav style={{
        background:T.card, borderBottom:`1px solid ${T.border}`,
        padding:"0 20px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:2000,
      }}>
        <div onClick={()=>nav("dash")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", userSelect:"none" }}>
          <LogoIcon size={34}/>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:"-0.3px", lineHeight:1.1 }}>The Encinitas Report</div>
            <div style={{ fontSize:9, color:T.muted, fontWeight:600 }}>DRE# 02168977</div>
          </div>
        </div>

        <div className="desk-nav" style={{ display:"flex", gap:1 }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>nav(p.id)} style={{
              padding:"7px 12px", borderRadius:8, fontSize:11.5, cursor:"pointer",
              fontWeight: page===p.id ? 700 : 500,
              background:"transparent",
              border: page===p.id ? `1.5px solid ${T.text}` : "1.5px solid transparent",
              color: page===p.id ? T.text : T.sec,
              transition:"all 0.15s",
            }}>{p.label}</button>
          ))}
        </div>

        <button className="mob-btn" onClick={()=>setMob(!mob)} style={{
          display:"none", alignItems:"center", justifyContent:"center",
          background:"none", border:"none", color:T.text, fontSize:22, cursor:"pointer", padding:6,
        }}>{mob?"✕":"☰"}</button>
      </nav>

      {mob && (
        <div style={{
          position:"fixed", top:64, left:0, right:0, bottom:0, zIndex:1999,
          background:"rgba(248,250,252,0.98)", backdropFilter:"blur(10px)", padding:"12px 32px",
        }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>nav(p.id)} style={{
              display:"block", width:"100%", padding:"16px 0", border:"none",
              borderBottom:`1px solid ${T.border}`, background:"none",
              textAlign:"left", cursor:"pointer", fontSize:17,
              fontWeight: page===p.id ? 800 : 400,
              color: page===p.id ? T.brand : T.text,
            }}>{p.label}</button>
          ))}
        </div>
      )}

      <div key={page}>
        {page==="dash" && <Dashboard />}
        {page==="map" && <MapView />}
        {page==="report" && <RatesPage />}
        {page==="permits" && <Permits />}
        {page==="value" && <HomeValue />}
        {page==="intel" && <PropertyIntel />}
        {page==="brief" && <WeeklyBrief />}
        {page==="content" && <ContentEngine />}
      </div>

      {page !== "map" && (
        <div style={{
          borderTop:`1px solid ${T.border}`, padding:"24px 32px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          maxWidth:1200, margin:"0 auto", flexWrap:"wrap", gap:8,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <LogoIconSmall size={20}/>
            <span style={{ fontSize:12, color:T.muted }}>© 2026 The Encinitas Report · DRE# 02168977</span>
          </div>
          <span style={{ fontSize:11, color:"#cbd5e1" }}>Data: Redfin, Zillow, MLS, City of Encinitas, SD County Assessor</span>
        </div>
      )}
    </div>
  );
}
