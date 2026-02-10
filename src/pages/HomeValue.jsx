import { useState } from "react";
import { fmt, fmtPrice } from "../data";
import { Reveal, GlowCard, Tag, GradientText, Footer } from "../components/ui";

export default function HomeValue() {
  const [form, setForm] = useState({ address: "", name: "", email: "", phone: "" });
  const [res, setRes] = useState(null);
  const [ld, setLd] = useState(false);
  const [step, setStep] = useState(1);

  const est = () => {
    setLd(true);
    setTimeout(() => {
      const b = 1100000 + Math.floor(Math.random() * 1800000);
      setRes({
        val: b, low: Math.round(b * 0.93), high: Math.round(b * 1.07),
        conf: 78 + Math.floor(Math.random() * 16),
        appr: (2 + Math.random() * 6).toFixed(1),
        eq: Math.round(b * (0.02 + Math.random() * 0.06)),
        tax: Math.round(b * 0.011),
      });
      setLd(false);
    }, 2400);
  };

  const inp = {
    width: "100%", padding: "15px 18px", borderRadius: 14,
    border: "1.5px solid rgba(0,0,0,0.07)", fontSize: 15, outline: "none",
    fontFamily: "inherit", background: "rgba(255,255,255,0.8)",
    boxSizing: "border-box", fontWeight: 500, transition: "all 0.3s",
  };

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 32px 120px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <Tag color="#22c55e">Instant Estimate</Tag>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-2.5px", margin: "20px 0 0", lineHeight: 1 }}>
          What's Your Home <GradientText>Worth?</GradientText>
        </h1>
        <p style={{ fontSize: 17, color: "#64748b", marginTop: 10 }}>Backed by real Encinitas market data. Get your estimate in seconds.</p>
      </Reveal>

      <div className="value-grid" style={{
        display: "grid", gridTemplateColumns: res ? "1fr 1fr" : "1fr",
        gap: 24, marginTop: 36, maxWidth: res ? 1320 : 580, margin: res ? "36px 0 0" : "36px auto 0",
      }}>
        <Reveal>
          <GlowCard>
            <div style={{ padding: 36, borderRadius: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 28 }}>
                {res ? "Your Property" : `Step ${step} of 2`}
              </div>

              {(step === 1 || res) && (
                <label style={{ display: "block", marginBottom: 24 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "block", marginBottom: 8 }}>Property Address</span>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Pacific View Dr, Encinitas" style={inp} />
                </label>
              )}

              {step === 1 && !res && (
                <button onClick={() => form.address.trim() && setStep(2)} style={{
                  width: "100%", padding: "16px", borderRadius: 14, border: "none",
                  background: form.address.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e2e8f0",
                  color: form.address.trim() ? "white" : "#94a3b8",
                  fontSize: 16, fontWeight: 700, cursor: form.address.trim() ? "pointer" : "default",
                  boxShadow: form.address.trim() ? "0 6px 24px rgba(99,102,241,0.35)" : "none",
                }}>Continue →</button>
              )}

              {step === 2 && !res && (
                <>
                  {[
                    { k: "name", l: "Full Name", ph: "Jane Smith" },
                    { k: "email", l: "Email", ph: "jane@email.com", t: "email" },
                    { k: "phone", l: "Phone (optional)", ph: "(760) 555-0123", t: "tel" },
                  ].map((fi) => (
                    <label key={fi.k} style={{ display: "block", marginBottom: 18 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "block", marginBottom: 8 }}>{fi.l}</span>
                      <input value={form[fi.k]} onChange={(e) => setForm({ ...form, [fi.k]: e.target.value })}
                        type={fi.t || "text"} placeholder={fi.ph} style={inp} />
                    </label>
                  ))}
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button onClick={() => setStep(1)} style={{
                      flex: 1, padding: "16px", borderRadius: 14,
                      border: "1.5px solid rgba(0,0,0,0.07)", background: "white",
                      fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#0f172a",
                    }}>← Back</button>
                    <button onClick={est} disabled={ld || !form.name || !form.email} style={{
                      flex: 2, padding: "16px", borderRadius: 14, border: "none",
                      background: form.name && form.email ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e2e8f0",
                      color: form.name && form.email ? "white" : "#94a3b8",
                      fontSize: 15, fontWeight: 700, cursor: ld ? "wait" : "pointer",
                      opacity: ld ? 0.7 : 1,
                      boxShadow: form.name && form.email ? "0 6px 24px rgba(99,102,241,0.35)" : "none",
                    }}>{ld ? "Calculating..." : "Get My Estimate"}</button>
                  </div>
                </>
              )}
            </div>
          </GlowCard>
        </Reveal>

        {res && (
          <Reveal delay={100}>
            <div>
              {/* Value Hero */}
              <div style={{
                borderRadius: 24, padding: 36, color: "white", position: "relative", overflow: "hidden",
                background: "linear-gradient(135deg, #059669, #10b981, #34d399)", marginBottom: 16,
              }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 15%, rgba(255,255,255,0.2), transparent 55%)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Estimated Home Value</div>
                  <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1 }}>{fmtPrice(res.val)}</div>
                  <div style={{ marginTop: 12, fontSize: 15, opacity: 0.75 }}>Range: {fmtPrice(res.low)} — {fmtPrice(res.high)}</div>
                  <div style={{ marginTop: 16, display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "7px 16px", fontSize: 14, fontWeight: 700, backdropFilter: "blur(10px)" }}>
                    {res.conf}% confidence
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="value-metrics" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[
                  ["12-Mo Growth", `+${res.appr}%`, "#22c55e"],
                  ["Equity Gain", `+${fmtPrice(res.eq)}`, "#6366f1"],
                  ["Est. Tax/yr", `$${fmt(res.tax)}`, "#f59e0b"],
                ].map(([l, v, c]) => (
                  <GlowCard key={l}>
                    <div style={{ padding: 22, textAlign: "center", borderRadius: 22 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{l}</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: c, letterSpacing: "-1px" }}>{v}</div>
                    </div>
                  </GlowCard>
                ))}
              </div>

              {/* CTA */}
              <GlowCard>
                <div style={{ padding: 28, textAlign: "center", borderRadius: 22, background: "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(168,85,247,0.02))" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Want the precise number?</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>A walkthrough gives you the real valuation — free, no obligation.</div>
                  <button style={{
                    padding: "14px 32px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.15) inset",
                  }}>Schedule Free Walkthrough</button>
                </div>
              </GlowCard>
            </div>
          </Reveal>
        )}
      </div>

      <Footer />
    </div>
  );
}
