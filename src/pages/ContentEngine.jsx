import { useState } from "react";
import { T } from "../theme";
import { submitToHubSpot } from "../hubspot";

export default function ContentEngine() {
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 32px 60px"}}>
      <div className="hero-gradient tech-grid" style={{padding:"36px 32px",borderRadius:20,marginLeft:-32,marginRight:-32,marginTop:-32,paddingTop:48,marginBottom:24}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="anim-up" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(255,255,255,0.8)",backdropFilter:"blur(8px)",marginBottom:16}}>
            <div className="live-dot"/>
            <span style={{fontSize:11,fontWeight:700,color:T.brandDk,textTransform:"uppercase",letterSpacing:"1px"}}>Content Engine</span>
          </div>
          <h1 className="anim-up-d1" style={{fontSize:42,fontWeight:900,color:T.text,letterSpacing:"-2px",margin:0,lineHeight:1}}>Encinitas</h1>
          <h1 className="anim-up-d2 gradient-text" style={{fontSize:42,fontWeight:900,letterSpacing:"-2px",margin:0,lineHeight:1.1}}>Content Engine</h1>
          <p className="anim-up-d3" style={{fontSize:15,color:T.sec,marginTop:12,lineHeight:1.5,maxWidth:560}}>
            AI-powered local real estate content — blog posts, social captions, and market updates generated from live Encinitas data.
          </p>
          <div className="anim-up-d4" style={{marginTop:12,fontSize:12,color:T.muted}}>
            David Rose · HomeSmart Realty West · TheEncinitasReport.com
          </div>
        </div>
      </div>

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,padding:32,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✍️</div>
        <div style={{fontSize:20,fontWeight:900,color:T.text,marginBottom:8}}>Content Engine — Coming Soon</div>
        <p style={{fontSize:14,color:T.sec,lineHeight:1.6,maxWidth:480,margin:"0 auto"}}>
          Automated blog posts, social media captions, and neighborhood market updates powered by the Intelligence Command Center data feeds.
        </p>
      </div>
    </div>
  );
}
