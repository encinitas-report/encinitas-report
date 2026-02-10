import { useState } from "react";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import RatesPage from "./pages/RatesPage";
import HomeValue from "./pages/HomeValue";
import ContentEngine from "./pages/ContentEngine";

const PAGES = [
  { id:"map", label:"Map", icon:"◎" },
  { id:"dash", label:"Dashboard", icon:"▦" },
  { id:"rates", label:"Rates", icon:"%" },
  { id:"value", label:"Home Value", icon:"◇" },
  { id:"content", label:"Content", icon:"▶" },
];

export default function App() {
  const [page, setPage] = useState("map");
  const [mob, setMob] = useState(false);

  const navigate = (p) => { setPage(p); setMob(false); if(p!=="map") window.scrollTo({top:0,behavior:"smooth"}); };

  return (
    <div style={{ minHeight:"100vh",background:"#0f172a" }}>
      <nav style={{
        height:56,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(15,23,42,0.95)",backdropFilter:"blur(20px)",
        position:"sticky",top:0,zIndex:2000,
      }}>
        <div onClick={()=>navigate("map")} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",userSelect:"none" }}>
          <div style={{
            width:32,height:32,borderRadius:9,
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"white",fontSize:11,fontWeight:900,
            boxShadow:"0 2px 12px rgba(99,102,241,0.4)",
          }}>ER</div>
          <div>
            <div style={{ fontSize:14,fontWeight:800,color:"#f1f5f9",letterSpacing:"-0.3px",lineHeight:1.1 }}>The Encinitas Report</div>
            <div style={{ fontSize:8.5,color:"#475569",fontWeight:600,letterSpacing:"0.8px" }}>DRE# 02168977 · HomeSmart Realty West</div>
          </div>
        </div>
        <div className="desk-nav" style={{ display:"flex",gap:2,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3 }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>navigate(p.id)} style={{
              padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",
              fontSize:12,fontWeight:page===p.id?700:400,
              background:page===p.id?"rgba(99,102,241,0.15)":"transparent",
              color:page===p.id?"#a5b4fc":"#64748b",
              transition:"all 0.2s",display:"flex",alignItems:"center",gap:5,
            }}><span style={{ fontSize:10 }}>{p.icon}</span>{p.label}</button>
          ))}
        </div>
        <button className="mob-btn" onClick={()=>setMob(!mob)} style={{
          display:"none",alignItems:"center",justifyContent:"center",
          background:"none",border:"none",color:"#e2e8f0",fontSize:20,cursor:"pointer",padding:6,
        }}>{mob?"✕":"☰"}</button>
      </nav>

      {mob && (
        <div style={{
          position:"fixed",top:56,left:0,right:0,bottom:0,zIndex:1999,
          background:"rgba(15,23,42,0.98)",backdropFilter:"blur(20px)",padding:"12px 24px",
        }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={()=>navigate(p.id)} style={{
              display:"block",width:"100%",padding:"18px 0",border:"none",
              borderBottom:"1px solid rgba(255,255,255,0.04)",background:"none",
              textAlign:"left",cursor:"pointer",fontSize:18,
              fontWeight:page===p.id?800:400,
              color:page===p.id?"#a5b4fc":"#cbd5e1",
            }}><span style={{ marginRight:10 }}>{p.icon}</span>{p.label}</button>
          ))}
        </div>
      )}

      <div key={page}>
        {page==="map" && <MapView />}
        {page==="dash" && <Dashboard />}
        {page==="rates" && <RatesPage />}
        {page==="value" && <HomeValue />}
        {page==="content" && <ContentEngine />}
      </div>

      {page !== "map" && (
        <div style={{
          padding:"24px 24px 40px",borderTop:"1px solid rgba(255,255,255,0.04)",
          display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,
          maxWidth:1200,margin:"0 auto",
        }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{
              width:18,height:18,borderRadius:5,background:"linear-gradient(135deg,#6366f1,#a78bfa)",
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"white",fontSize:6,fontWeight:900,
            }}>ER</div>
            <span style={{ fontSize:11,color:"#475569" }}>© 2026 The Encinitas Report · DRE# 02168977 · HomeSmart Realty West</span>
          </div>
          <span style={{ fontSize:10,color:"#334155" }}>Data: Redfin, Zillow, Freddie Mac, MLS. For informational purposes only.</span>
        </div>
      )}
    </div>
  );
}
