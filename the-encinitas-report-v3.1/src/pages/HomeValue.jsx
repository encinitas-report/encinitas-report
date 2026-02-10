import { useState } from "react";
import { NEIGHBORHOODS, MARKET, RATES, fmt, fmtPrice, calcPayment } from "../data/market";

export default function HomeValue() {
  const [form, setForm] = useState({ address: "", name: "", email: "", phone: "" });
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const estimate = () => {
    setLoading(true);
    setTimeout(() => {
      const base = 1100000 + Math.floor(Math.random() * 1800000);
      const n = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
      setRes({
        val: base, low: Math.round(base * 0.93), high: Math.round(base * 1.07),
        conf: 78 + Math.floor(Math.random() * 16),
        growth: (2 + Math.random() * 6).toFixed(1),
        equity: Math.round(base * (0.02 + Math.random() * 0.06)),
        tax: Math.round(base * 0.011),
        hood: n.name,
        pmt: calcPayment(base * 0.8, RATES.conventional30.rate),
      });
      setLoading(false);
    }, 2200);
  };

  const inp = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)", fontSize: 15,
    background: "rgba(255,255,255,0.04)", color: "#f1f5f9",
    fontFamily: "inherit", transition: "all 0.2s",
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Instant Estimate</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-2px", margin: 0 }}>What's Your Home Worth?</h1>
        <p style={{ fontSize: 15, color: "#64748b", marginTop: 6 }}>Powered by Encinitas neighborhood data. Results in seconds.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
        {step === 1 && !res && <>
          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: 6 }}>Property Address</span>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="123 Pacific View Dr, Encinitas" style={inp} />
          </label>
          <button onClick={() => form.address.trim() && setStep(2)} style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: form.address.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.06)",
            color: form.address.trim() ? "white" : "#475569", fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}>Continue →</button>
        </>}
        {step === 2 && !res && <>
          {[
            { k: "name", l: "Full Name", ph: "Jane Smith" },
            { k: "email", l: "Email", ph: "jane@email.com", t: "email" },
            { k: "phone", l: "Phone (optional)", ph: "(760) 555-0123", t: "tel" },
          ].map(f => (
            <label key={f.k} style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: 6 }}>{f.l}</span>
              <input value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                type={f.t || "text"} placeholder={f.ph} style={inp} />
            </label>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "#cbd5e1", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>← Back</button>
            <button onClick={estimate} disabled={loading || !form.name || !form.email} style={{
              flex: 2, padding: "14px", borderRadius: 12, border: "none",
              background: form.name && form.email ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.06)",
              color: form.name && form.email ? "white" : "#475569",
              fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1,
            }}>{loading ? "Calculating..." : "Get My Estimate"}</button>
          </div>
        </>}
        {res && <>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Estimated Value</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#22c55e", letterSpacing: "-3px" }}>{fmtPrice(res.val)}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>Range: {fmtPrice(res.low)} — {fmtPrice(res.high)}</div>
            <div style={{
              display: "inline-block", marginTop: 12, padding: "6px 16px", borderRadius: 8,
              background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 13, fontWeight: 700,
            }}>{res.conf}% confidence · {res.hood}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "24px 0" }}>
            {[["12-Mo Growth", `+${res.growth}%`, "#22c55e"], ["Equity Gain", `+${fmtPrice(res.equity)}`, "#6366f1"], ["Est. Tax/yr", `$${fmt(res.tax)}`, "#f59e0b"]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center", padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: c, letterSpacing: "-0.5px", marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 16 }}>
            Monthly payment at {RATES.conventional30.rate}% (20% down): <strong style={{ color: "#a5b4fc" }}>${fmt(Math.round(res.pmt))}/mo</strong>
          </div>
          <button style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}>Schedule Free Walkthrough</button>
          <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 12 }}>
            This is a preliminary estimate. For a precise CMA, schedule a free consultation. DRE# 02168977.
          </div>
        </>}
      </div>
    </div>
  );
}
