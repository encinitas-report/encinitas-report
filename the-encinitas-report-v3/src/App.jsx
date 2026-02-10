import { useState } from "react";
import { T } from "./theme";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import RatesPage from "./pages/RatesPage";
import HomeValue from "./pages/HomeValue";
import ContentEngine from "./pages/ContentEngine";

const PAGES = [
  { id:"dash", label:"Dashboard" },
  { id:"map", label:"Map" },
  { id:"report", label:"Property Report" },
  { id:"value", label:"Home Value" },
  { id:"content", label:"Content Engine" },
];

export default function App() {
  const [page, setPage] = useState("dash");
  const [mob, setMob] = useState(false);

  const nav = (p) => { setPage(p); setMob(false); if(p!=="map") window.scrollTo({top:0,behavior:"smooth"}); };

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      {/* ── NAV ── */}
      <nav style={{
        background:T.card, borderBottom:`1px solid ${T.border}`,
        padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:2000,
      }}>
        <div onClick={()=>nav("dash")} style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none" }}>
          <div style={{
            width:36, height:36, borderRadius:10, background:T.brand,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white", fontSize:13, fontWeight:900,
          }}>ER</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:T.text, letterSpacing:"-0.3px", lineHeight:1.1 }}>The Encinitas Report</div>
            <div style={{ fontSize:10, color:T.muted, fontWeight:600 }}>DRE# 02168977</div>
          </div>
        </div>

        <div className="desk-nav" style={{ display:"flex", gap:4 }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>nav(p.id)} style={{
              padding:"8px 18px", borderRadius:10, fontSize:13, cursor:"pointer",
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

      {/* Mobile Menu */}
      {mob && (
        <div style={{
          position:"fixed", top:64, left:0, right:0, bottom:0, zIndex:1999,
          background:"rgba(248,250,252,0.98)", backdropFilter:"blur(10px)", padding:"12px 32px",
        }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>nav(p.id)} style={{
              display:"block", width:"100%", padding:"18px 0", border:"none",
              borderBottom:`1px solid ${T.border}`, background:"none",
              textAlign:"left", cursor:"pointer", fontSize:18,
              fontWeight: page===p.id ? 800 : 400,
              color: page===p.id ? T.brand : T.text,
            }}>{p.label}</button>
          ))}
        </div>
      )}

      {/* ── PAGES ── */}
      <div key={page}>
        {page==="dash" && <Dashboard />}
        {page==="map" && <MapView />}
        {page==="report" && <RatesPage />}
        {page==="value" && <HomeValue />}
        {page==="content" && <ContentEngine />}
      </div>

      {/* ── FOOTER ── */}
      {page !== "map" && (
        <div style={{
          borderTop:`1px solid ${T.border}`, padding:"24px 32px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          maxWidth:1200, margin:"0 auto", flexWrap:"wrap", gap:8,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              width:20, height:20, borderRadius:6, background:T.brand,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"white", fontSize:7, fontWeight:900,
            }}>ER</div>
            <span style={{ fontSize:12, color:T.muted }}>© 2026 The Encinitas Report · DRE# 02168977</span>
          </div>
          <span style={{ fontSize:11, color:"#cbd5e1" }}>Data sourced from Redfin, Zillow & MLS. For informational purposes only.</span>
        </div>
      )}
    </div>
  );
}
