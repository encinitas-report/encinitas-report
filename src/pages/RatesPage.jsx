import { useState } from "react";
import { T } from "../theme";
import { RATES, MARKET, fmt, fmtPrice, calcPayment } from "../data/market";

const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

export default function RatesPage() {
  const [price, setPrice] = useState(MARKET.median);
  const [downPct, setDownPct] = useState(20);
  const allRates = [RATES.conventional30, RATES.conventional15, RATES.fha30, RATES.va30, RATES.jumbo30, RATES.arm51];

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
      <h1 style={{ fontSize:28, fontWeight:900, color:T.text, letterSpacing:"-1px", margin:"0 0 6px" }}>Today's Mortgage Rates</h1>
      <p style={{ fontSize:14, color:T.muted, marginBottom:24 }}>Updated {RATES.updated} · Freddie Mac, Bankrate, Veterans United</p>

      {/* Rate Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {allRates.map(r => (
          <Card key={r.label} style={{ padding:"20px 24px" }}>
            <Lbl>{r.label}</Lbl>
            <div style={{ fontSize:36, fontWeight:900, color:T.text, letterSpacing:"-2px", marginTop:6 }}>{r.rate}%</div>
            {r.note && <div style={{ fontSize:11, color:T.muted, marginTop:6 }}>{r.note}</div>}
          </Card>
        ))}
      </div>

      {/* Rate Trend */}
      <Card style={{ padding:"24px 28px", marginBottom:24 }}>
        <Lbl style={{ marginBottom:14 }}>30-Year Fixed Trend (2026)</Lbl>
        <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:120 }}>
          {RATES.trend.map((t,i) => {
            const mx = Math.max(...RATES.trend.map(x=>x.r));
            const mn = Math.min(...RATES.trend.map(x=>x.r)) - 0.5;
            const pct = ((t.r - mn) / (mx - mn)) * 100;
            const isLast = i === RATES.trend.length - 1;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ fontSize:12, fontWeight:700, color:isLast?T.chart:T.text }}>{t.r}%</div>
                <div style={{ width:"100%", maxWidth:50, height:`${pct}%`, minHeight:6, borderRadius:8, background:isLast?T.chart:"#e8ecf1", transition:"height 0.4s ease" }}/>
                <div style={{ fontSize:9, color:T.muted }}>{t.w}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:12, color:T.pos, fontWeight:600, marginTop:12, textAlign:"center" }}>
          ↓ Rates dropped from 6.93% to {RATES.conventional30.rate}% in 2026
        </div>
      </Card>

      {/* Payment Calculator */}
      <Card style={{ padding:"24px 28px" }}>
        <Lbl style={{ marginBottom:16 }}>Payment Calculator</Lbl>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.sec, marginBottom:6 }}>Home Price</div>
            <input type="range" min={500000} max={5000000} step={25000} value={price}
              onChange={e=>setPrice(+e.target.value)} style={{ width:"100%", accentColor:T.brand }}/>
            <div style={{ fontSize:24, fontWeight:900, color:T.text, letterSpacing:"-1px" }}>{fmtPrice(price)}</div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.sec, marginBottom:6 }}>Down Payment</div>
            <input type="range" min={0} max={50} step={1} value={downPct}
              onChange={e=>setDownPct(+e.target.value)} style={{ width:"100%", accentColor:T.brand }}/>
            <div style={{ fontSize:24, fontWeight:900, color:T.text, letterSpacing:"-1px" }}>
              {downPct}% <span style={{ fontSize:14, color:T.muted }}>({fmtPrice(Math.round(price*downPct/100))})</span>
            </div>
          </div>
        </div>

        {[
          { ...RATES.conventional30, dp:downPct/100 },
          { ...RATES.conventional15, dp:downPct/100, y:15 },
          { ...RATES.fha30, dp:Math.max(0.035, downPct/100) },
          { ...RATES.va30, dp:0 },
        ].map(r => {
          const loan = price * (1 - r.dp);
          const pmt = calcPayment(loan, r.rate, r.y || 30);
          return (
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{r.label}</div>
                <div style={{ fontSize:12, color:T.muted }}>{r.rate}% · {fmtPrice(Math.round(loan))} loan</div>
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:T.text }}>
                ${fmt(Math.round(pmt))}<span style={{ fontSize:12, color:T.muted, fontWeight:400 }}>/mo</span>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize:11, color:T.muted, marginTop:12 }}>P&I only. Excludes property tax (~1.1%), insurance, HOA, MIP.</div>
      </Card>
    </div>
  );
}
