import { useState, useEffect } from "react";
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
  { id:"dash", label:"Dashboard", icon:"\u{1F4CA}" },
  { id:"map", label:"Map", icon:"\u{1F5FA}" },
  { id:"report", label:"Rates", icon:"\u{1F4C8}" },
  { id:"permits", label:"Permits", icon:"\u{1F3D7}" },
  { id:"value", label:"Home Value", icon:"\u{1F3E0}" },
  { id:"intel", label:"Intel Report", icon:"\u{1F50D}" },
  { id:"brief", label:"Weekly Brief", icon:"\u{1F4EC}" },
  { id:"content", label:"Content", icon:"\u{270D}\u{FE0F}" },
];

export default function App() {
  const [page, setPage] = useState("dash");
  const [mob, setMob] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (p) => {
    if (p === page) return;
    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      setMob(false);
      setTransitioning(false);
      if (p !== "map") window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      <nav className="glass-nav" style={{
        padding:"0 20px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:2000,
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow 0.3s ease",
      }}>
        <div onClick={()=>nav("dash")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", userSelect:"none" }}>
          <LogoIcon size={34}/>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:"-0.3px", lineHeight:1.1 }}>The Encinitas Report</div>
            <div style={{ fontSize:8, color:T.muted, fontWeight:600, letterSpacing:"0.5px" }}>HomeSmart Realty West \u00b7 DRE# 02168977</div>
          </div>
        </div>

        <div className="desk-nav" style={{ display:"flex", gap:1 }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>nav(p.id)} className={`nav-btn ${page===p.id?"active":""}`} style={{
              padding:"7px 12px", borderRadius:8, fontSize:11.5, cursor:"pointer",
              fontWeight: page===p.id ? 700 : 500,
              background:"transparent",
              border: page===p.id ? `1.5px solid ${T.text}` : "1.5px solid transparent",
              color: page===p.id ? T.text : T.sec,
            }}>{p.label}</button>
          ))}
        </div>

        <button className="mob-btn" onClick={()=>setMob(!mob)} style={{
          display:"none", alignItems:"center", justifyContent:"center",
          background:"none", border:"none", color:T.text, fontSize:22, cursor:"pointer", padding:6,
        }}>{mob?"\u2715":"\u2630"}</button>
      </nav>

      {mob && (
        <div className="mob-menu" style={{
          position:"fixed", top:64, left:0, right:0, bottom:0, zIndex:1999,
          background:"rgba(248,250,252,0.98)", backdropFilter:"blur(20px)", padding:"12px 32px",
        }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>nav(p.id)} style={{
              display:"flex", alignItems:"center", gap:12, width:"100%", padding:"16px 0", border:"none",
              borderBottom:`1px solid ${T.border}`, background:"none",
              textAlign:"left", cursor:"pointer", fontSize:17,
              fontWeight: page===p.id ? 800 : 400,
              color: page===p.id ? T.brand : T.text,
            }}>
              <span style={{ fontSize:20 }}>{p.icon}</span>
              {p.label}
            </button>
          ))}
          <div style={{ marginTop:24, padding:"16px 0", borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.brand }}>HomeSmart Realty West</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>DRE# 02168977 \u00b7 TheEncinitasReport.com</div>
          </div>
        </div>
      )}

      <div key={page} style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
      }}>
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
          maxWidth:1200, margin:"0 auto",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <LogoIconSmall size={20}/>
              <div>
                <span style={{ fontSize:12, color:T.text, fontWeight:600 }}>TheEncinitasReport.com</span>
                <span style={{ fontSize:11, color:T.muted, marginLeft:8 }}>HomeSmart Realty West \u00b7 DRE# 02168977</span>
              </div>
            </div>
            <span style={{ fontSize:10, color:"#cbd5e1" }}>Data: Redfin, Zillow, MLS, City of Encinitas, SD County Assessor</span>
          </div>
          <div style={{ fontSize:9, color:"#cbd5e1", marginTop:8, textAlign:"center" }}>
            \u00a9 2026 The Encinitas Report. Not intended to solicit currently listed properties. All data for informational purposes only.
          </div>
        </div>
      )}
    </div>
  );
}
