import { useState } from "react";
import { T } from "../theme";
import { MARKET, NEIGHBORHOODS, fmtPrice, fmt } from "../data/market";

const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

export default function HomeValue() {
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const inp = { width:"100%", padding:"14px 16px", borderRadius:12, border:`1px solid ${T.border}`, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box", color:T.text };
  const btn = { marginTop:12, padding:"14px 32px", borderRadius:12, border:"none", fontSize:15, fontWeight:700, background:T.brand, color:"white", cursor:"pointer", width:"100%" };

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
      <h1 style={{ fontSize:28, fontWeight:900, color:T.text, letterSpacing:"-1px", margin:"0 0 6px" }}>What's Your Home Worth?</h1>
      <p style={{ fontSize:14, color:T.muted, marginBottom:24 }}>Get a data-driven estimate using real Encinitas comps</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
        {/* Left — Form */}
        <Card style={{ padding:32 }}>
          {step === 1 && <>
            <Lbl style={{ marginBottom:12 }}>Enter Your Address</Lbl>
            <input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="e.g. 412 Neptune Ave, Encinitas" style={inp} />
            <button onClick={()=>addr&&setStep(2)} style={btn}>Get Estimate</button>
          </>}

          {step === 2 && <>
            <Lbl style={{ marginBottom:12 }}>Almost there — where should we send the report?</Lbl>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" style={{...inp, marginBottom:10}} />
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{...inp, marginBottom:10}} />
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (optional)" style={{...inp, marginBottom:10}} />
            <button onClick={()=>setStep(3)} style={btn}>See My Estimate</button>
          </>}

          {step === 3 && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.brand, marginBottom:8, textTransform:"uppercase", letterSpacing:"1px" }}>Estimated Value</div>
              <div style={{ fontSize:48, fontWeight:900, color:T.text, letterSpacing:"-2px" }}>{fmtPrice(MARKET.median)}</div>
              <div style={{ fontSize:14, color:T.muted, marginTop:4 }}>Based on comparable sales within 0.5 mi</div>

              <div style={{ marginTop:20, padding:"16px 20px", background:"#f0fdf4", borderRadius:12, textAlign:"left" }}>
                <div style={{ fontSize:13, color:T.sec, lineHeight:1.6 }}>
                  Want a walkthrough of these numbers? I'll break down exactly how we got here — and what you could actually sell for today.
                </div>
              </div>

              <button onClick={()=>setStep(1)} style={{
                ...btn, background:"transparent", border:`2px solid ${T.brand}`, color:T.brand, marginTop:16,
              }}>Request Free CMA</button>

              <div style={{ fontSize:10, color:T.muted, marginTop:16 }}>DRE# 02168977 · Estimates are approximate and not an appraisal.</div>
            </div>
          )}
        </Card>

        {/* Right — Context */}
        <div>
          <Card style={{ padding:"24px 28px", marginBottom:16 }}>
            <Lbl>Encinitas Market Context</Lbl>
            <div style={{ fontSize:28, fontWeight:900, color:T.text, letterSpacing:"-1.5px", marginTop:8 }}>{fmtPrice(MARKET.median)}</div>
            <div style={{ fontSize:13, color:T.sec, marginTop:4 }}>City median · {MARKET.medianChange}% YoY</div>
            <div style={{ marginTop:16 }}>
              {NEIGHBORHOODS.map(n => (
                <div key={n.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid #f1f5f9` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:3, background:n.color }}/>
                    <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{n.name}</span>
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:T.text }}>{fmtPrice(n.med)}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:n.chg>0?T.pos:T.neg }}>{n.chg>0?"+":""}{n.chg}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding:"24px 28px" }}>
            <Lbl>Why This Report?</Lbl>
            <div style={{ marginTop:12 }}>
              {["Real comparable sales — not Zestimates","Neighborhood-specific data, not citywide averages","Payment calculations at today's rates","Compete score showing buyer demand"].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                  <span style={{ color:T.brand, fontWeight:700, fontSize:14, marginTop:1 }}>✓</span>
                  <span style={{ fontSize:13, color:T.sec, lineHeight:1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
