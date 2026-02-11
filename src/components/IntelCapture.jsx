import { useState } from "react";
import { T } from "../theme";
import { NEIGHBORHOODS } from "../data/market";
import { FLOOD_DATA, SCHOOL_DATA, ZONING_DATA, HOOD_INTEL, CRIME_DATA, STR_STATS } from "../data/intelligence";
import { submitToHubSpot } from "../hubspot";

/* ── Helpers ── */
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;
const Lbl = ({children,style:s}) => <div style={{fontSize:10,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Badge = ({children,color,style:s}) => <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:color+"18",color,...s}}>{children}</span>;

/* Map address keywords to neighborhoods */
function detectNeighborhood(addr) {
  const a = addr.toLowerCase();
  const leucadiaKeys = ["neptune","vulcan","hermes","orpheus","diana","hymettus","leucadia","phoebe","daphne","coast hwy 101 north","eolus"];
  const oldEncKeys = ["d st","e st","f st","1st st","2nd st","3rd st","cornish","requeza","west j","santa fe","flora vista","moonlight","encinitas blvd west","vulcan south"];
  const newEncKeys = ["saxony","gascony","amalfi","summerhill","via escalante","park dale","village park","rancho santa fe","el camino real","camino del rancho","encinitas ranch"];
  const olivKeys = ["lone hill","via de caballo","rancho encinitas","calle rancho","manchester east","lomas santa fe","olivenhain","willowspring","fortuna ranch","double ll"];
  const cardiffKeys = ["oxford","montgomery","liverpool","san mario","mozart","cambridge","edinburg","san elijo","chesterfield","windsor","birmingham","restaurant row","cardiff"];

  if (leucadiaKeys.some(k => a.includes(k))) return "leucadia";
  if (cardiffKeys.some(k => a.includes(k))) return "cardiff";
  if (olivKeys.some(k => a.includes(k))) return "olivenhain";
  if (newEncKeys.some(k => a.includes(k))) return "new-encinitas";
  if (oldEncKeys.some(k => a.includes(k))) return "old-encinitas";

  if (a.includes("92007")) return "cardiff";
  if (a.includes("92024")) return "old-encinitas";

  return null;
}

function buildReport(hood) {
  const n = NEIGHBORHOODS.find(nb => nb.id === hood);
  const intel = HOOD_INTEL[hood];
  const flood = FLOOD_DATA.byHood[hood];
  const schools = SCHOOL_DATA.byHood[hood];
  const zoning = ZONING_DATA.byHood[hood];
  const crime = CRIME_DATA.trends;
  if (!n || !intel) return null;
  return { n, intel, flood, schools, zoning, crime };
}

/* ═══════════════════════════════════════════
   HERO CAPTURE — Address input CTA
   ═══════════════════════════════════════════ */
export function HeroCaptureForm({ onResult }) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    const hood = detectNeighborhood(address);
    setTimeout(() => {
      setLoading(false);
      onResult({ address: address.trim(), neighborhood: hood });
    }, 600);
  };

  return (
    <form onSubmit={handleLookup} style={{display:"flex",gap:8,maxWidth:540,marginTop:20,flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:240,position:"relative"}}>
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>📍</span>
        <input
          type="text"
          value={address}
          onChange={e=>setAddress(e.target.value)}
          placeholder="Enter any Encinitas address..."
          style={{
            width:"100%",padding:"14px 14px 14px 40px",fontSize:15,borderRadius:12,
            border:`2px solid ${T.border}`,background:"white",color:T.text,fontWeight:500,
            boxShadow:"0 4px 20px rgba(0,0,0,0.06)",
          }}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-glow" style={{
        padding:"14px 28px",borderRadius:12,fontSize:14,fontWeight:800,
        background:`linear-gradient(135deg,${T.brand},${T.brandDk})`,
        color:"white",border:"none",cursor:"pointer",
        boxShadow:"0 4px 16px rgba(16,185,129,0.3)",
        opacity:loading?0.7:1,
        minWidth:180,
      }}>
        {loading ? "Analyzing..." : "Get Property Intel →"}
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════════
   INLINE TAB CAPTURE — Smaller CTA for tabs
   ═══════════════════════════════════════════ */
export function TabCaptureBanner({ tabName, onResult }) {
  const [address, setAddress] = useState("");

  const handleLookup = (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    const hood = detectNeighborhood(address);
    onResult({ address: address.trim(), neighborhood: hood });
  };

  return (
    <Card style={{
      padding:"16px 20px",
      background:"linear-gradient(135deg,#f0fdf4,#ecfdf5,#f8fafc)",
      border:`2px solid ${T.brand}22`,
      marginBottom:16,
    }}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{flex:"0 0 auto"}}>
          <div style={{fontSize:13,fontWeight:800,color:T.brandDk}}>
            🔍 Get {tabName} data for your specific address
          </div>
          <div style={{fontSize:11,color:T.muted,marginTop:2}}>
            Personalized neighborhood intelligence delivered to your inbox
          </div>
        </div>
        <form onSubmit={handleLookup} style={{display:"flex",gap:6,flex:1,minWidth:280}}>
          <input
            type="text"
            value={address}
            onChange={e=>setAddress(e.target.value)}
            placeholder="Enter address..."
            style={{
              flex:1,padding:"10px 14px",fontSize:13,borderRadius:10,
              border:`1.5px solid ${T.border}`,background:"white",color:T.text,
            }}
          />
          <button type="submit" className="btn-glow" style={{
            padding:"10px 18px",borderRadius:10,fontSize:12,fontWeight:700,
            background:T.brand,color:"white",border:"none",cursor:"pointer",
            whiteSpace:"nowrap",
          }}>
            Lookup →
          </button>
        </form>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   LEAD CAPTURE MODAL — Email gate
   ═══════════════════════════════════════════ */
export function IntelCaptureModal({ address, neighborhood, onClose, onComplete }) {
  const [step, setStep] = useState("preview");
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const report = neighborhood ? buildReport(neighborhood) : null;
  const hoodLabel = report?.n?.name || "Encinitas";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.firstName) {
      setError("Name and email are required");
      return;
    }
    setSubmitting(true);
    setError("");

    const ok = await submitToHubSpot({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address,
      neighborhood: hoodLabel,
      source: "Intel Hub — Property Intelligence Report",
    });

    setSubmitting(false);
    if (ok) {
      setStep("success");
      if (onComplete) onComplete({ ...form, address, neighborhood });
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{
      position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,
      background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:20,
    }} onClick={onClose}>
      <div className="anim-scale" onClick={e=>e.stopPropagation()} style={{
        background:"white",borderRadius:24,maxWidth:560,width:"100%",
        maxHeight:"90vh",overflow:"auto",
        boxShadow:"0 25px 60px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{
          padding:"24px 28px 20px",
          background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",
          borderRadius:"24px 24px 0 0",
          borderBottom:`1px solid ${T.border}`,
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <Lbl style={{marginBottom:6}}>Property Intelligence Report</Lbl>
              <div style={{fontSize:18,fontWeight:900,color:T.text,letterSpacing:"-0.5px"}}>{address}</div>
              {neighborhood && (
                <Badge color={report?.n?.color || T.brand} style={{marginTop:6}}>
                  {hoodLabel}
                </Badge>
              )}
            </div>
            <button onClick={onClose} style={{
              background:"none",border:"none",fontSize:20,color:T.muted,
              cursor:"pointer",padding:4,lineHeight:1,
            }}>✕</button>
          </div>
        </div>

        {/* Step: Preview */}
        {step === "preview" && (
          <div style={{padding:"20px 28px 28px"}}>
            {report ? (
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[
                    {l:"Median Price",v:`$${(report.n.med/1e6).toFixed(2)}M`,c:T.text},
                    {l:"YoY Change",v:`${report.n.chg>0?"+":""}${report.n.chg}%`,c:report.n.chg>0?T.pos:T.neg},
                    {l:"Flood Risk",v:report.flood?.risk||"—",c:report.flood?.risk?.includes("Moderate")?"#f59e0b":"#10b981"},
                    {l:"Market Signal",v:report.intel.signal,c:T.brand},
                  ].map((s,i)=>(
                    <div key={i} style={{padding:14,borderRadius:12,background:"#f8fafc",textAlign:"center"}}>
                      <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
                      <div style={{fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{position:"relative",marginBottom:20}}>
                  <div style={{filter:"blur(4px)",userSelect:"none",pointerEvents:"none"}}>
                    <div style={{padding:12,borderRadius:10,background:"#f8fafc",marginBottom:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:T.label,marginBottom:4}}>SCHOOL PATH</div>
                      <div style={{fontSize:13,color:T.text}}>{report.schools || "Loading school data..."}</div>
                    </div>
                    <div style={{padding:12,borderRadius:10,background:"#f8fafc",marginBottom:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:T.label,marginBottom:4}}>ZONING & STR ELIGIBILITY</div>
                      <div style={{fontSize:13,color:T.text}}>{report.zoning?.primary || "R-3"} · STR: {report.zoning?.strEligible?"Eligible":"Not Eligible"}</div>
                    </div>
                    <div style={{padding:12,borderRadius:10,background:"#f8fafc"}}>
                      <div style={{fontSize:11,fontWeight:700,color:T.label,marginBottom:4}}>NEIGHBORHOOD INTELLIGENCE</div>
                      <div style={{fontSize:13,color:T.text}}>{report.intel.narrative}</div>
                    </div>
                  </div>
                  <div style={{
                    position:"absolute",top:0,left:0,right:0,bottom:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:"rgba(255,255,255,0.3)",
                  }}>
                    <div style={{
                      background:"white",padding:"12px 24px",borderRadius:12,
                      boxShadow:"0 4px 20px rgba(0,0,0,0.1)",
                      fontSize:13,fontWeight:700,color:T.brandDk,
                    }}>
                      🔒 Enter your info to unlock full report
                    </div>
                  </div>
                </div>

                <button onClick={()=>setStep("form")} className="btn-glow" style={{
                  width:"100%",padding:"16px",borderRadius:14,fontSize:15,fontWeight:800,
                  background:`linear-gradient(135deg,${T.brand},${T.brandDk})`,
                  color:"white",border:"none",cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(16,185,129,0.3)",
                }}>
                  Unlock Your Property Intelligence Report →
                </button>
                <div style={{fontSize:11,color:T.muted,textAlign:"center",marginTop:8}}>
                  Free · No spam · Personalized for your address
                </div>
              </>
            ) : (
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <div style={{fontSize:36,marginBottom:12}}>🏠</div>
                <div style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:8}}>
                  We'll prepare your custom report
                </div>
                <p style={{fontSize:13,color:T.sec,lineHeight:1.6,marginBottom:20}}>
                  Enter your info below and we'll send a personalized intelligence report for <strong>{address}</strong> — including flood zone, school path, zoning, STR eligibility, and market analysis.
                </p>
                <button onClick={()=>setStep("form")} className="btn-glow" style={{
                  padding:"14px 32px",borderRadius:14,fontSize:15,fontWeight:800,
                  background:`linear-gradient(135deg,${T.brand},${T.brandDk})`,
                  color:"white",border:"none",cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(16,185,129,0.3)",
                }}>
                  Get My Report →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: Form */}
        {step === "form" && (
          <div style={{padding:"24px 28px 28px"}}>
            <div style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:4}}>
              Almost there — where should we send it?
            </div>
            <p style={{fontSize:12,color:T.muted,marginBottom:20,lineHeight:1.5}}>
              Your personalized intelligence report for <strong>{address}</strong> will include flood zone, school path, zoning, STR eligibility, crime trends, and market analysis.
            </p>

            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:T.sec,marginBottom:4,display:"block"}}>First Name *</label>
                  <input
                    type="text" required value={form.firstName}
                    onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}
                    placeholder="First name"
                    style={{width:"100%",padding:"12px 14px",fontSize:14,borderRadius:10,border:`1.5px solid ${T.border}`,background:"white",color:T.text}}
                  />
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:T.sec,marginBottom:4,display:"block"}}>Last Name</label>
                  <input
                    type="text" value={form.lastName}
                    onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}
                    placeholder="Last name"
                    style={{width:"100%",padding:"12px 14px",fontSize:14,borderRadius:10,border:`1.5px solid ${T.border}`,background:"white",color:T.text}}
                  />
                </div>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:T.sec,marginBottom:4,display:"block"}}>Email *</label>
                <input
                  type="email" required value={form.email}
                  onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  placeholder="your@email.com"
                  style={{width:"100%",padding:"12px 14px",fontSize:14,borderRadius:10,border:`1.5px solid ${T.border}`,background:"white",color:T.text}}
                />
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:T.sec,marginBottom:4,display:"block"}}>Phone (optional)</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                  placeholder="(760) 555-1234"
                  style={{width:"100%",padding:"12px 14px",fontSize:14,borderRadius:10,border:`1.5px solid ${T.border}`,background:"white",color:T.text}}
                />
              </div>

              {error && <div style={{fontSize:12,color:T.neg,fontWeight:600}}>{error}</div>}

              <button onClick={handleSubmit} disabled={submitting} className="btn-glow" style={{
                width:"100%",padding:"16px",borderRadius:14,fontSize:15,fontWeight:800,
                background:`linear-gradient(135deg,${T.brand},${T.brandDk})`,
                color:"white",border:"none",cursor:"pointer",
                boxShadow:"0 4px 20px rgba(16,185,129,0.3)",
                opacity:submitting?0.7:1,marginTop:4,
              }}>
                {submitting ? "Sending..." : "Send My Property Intelligence Report →"}
              </button>
              <div style={{fontSize:10,color:T.muted,textAlign:"center"}}>
                David Rose · HomeSmart Realty West · DRE# 02168977
              </div>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div style={{padding:"32px 28px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:22,fontWeight:900,color:T.text,marginBottom:8}}>Report on its way!</div>
            <p style={{fontSize:14,color:T.sec,lineHeight:1.6,maxWidth:400,margin:"0 auto 20px"}}>
              Your personalized Property Intelligence Report for <strong>{address}</strong> ({hoodLabel}) is being prepared. Check your inbox at <strong>{form.email}</strong>.
            </p>

            {report && (
              <div style={{textAlign:"left",marginTop:20}}>
                <Lbl style={{marginBottom:10}}>Your Neighborhood Snapshot — {hoodLabel}</Lbl>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[
                    {l:"Median Price",v:`$${(report.n.med/1e6).toFixed(2)}M`},
                    {l:"YoY Change",v:`${report.n.chg>0?"+":""}${report.n.chg}%`},
                    {l:"Flood Risk",v:report.flood?.risk||"—"},
                    {l:"FEMA Zone",v:report.flood?.zone?.substring(0,18)||"—"},
                    {l:"Zoning",v:report.zoning?.primary||"—"},
                    {l:"STR Eligible",v:report.zoning?.strEligible?"Yes":"No"},
                  ].map((s,i)=>(
                    <div key={i} style={{padding:10,borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                      <div style={{fontSize:9,fontWeight:700,color:T.label,textTransform:"uppercase",marginBottom:2}}>{s.l}</div>
                      <div style={{fontSize:14,fontWeight:800,color:T.text}}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:12,borderRadius:10,background:"#f8fafc",marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.label,marginBottom:4}}>SCHOOL PATH</div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{report.schools || "Contact us for details"}</div>
                </div>
                <div style={{padding:12,borderRadius:10,background:"#f0fdf4"}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.brand,marginBottom:4}}>MARKET SIGNAL</div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.5}}>{report.intel.narrative}</div>
                </div>
              </div>
            )}

            <button onClick={onClose} style={{
              marginTop:20,padding:"12px 32px",borderRadius:12,fontSize:14,fontWeight:700,
              background:T.brand,color:"white",border:"none",cursor:"pointer",
            }}>
              Explore Intel Hub →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
