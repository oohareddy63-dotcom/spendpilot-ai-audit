import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import API from "../services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" } }),
};

const severityColor = {
  high:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   text: "#f87171",  label: "High Impact" },
  medium: { bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)",  text: "#fb923c",  label: "Medium Impact" },
  low:    { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.2)",   text: "#fbbf24",  label: "Low Impact" },
};

const flagTypeIcon = { overlap: "⚠️", sprawl: "📊", mismatch: "🔍", high_spend: "💸", overpay: "🧾" };

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

const inputCls = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8, color: "white",
  padding: "10px 14px", fontSize: 14,
  width: "100%", outline: "none", boxSizing: "border-box",
};

const labelCls = {
  fontSize: 12, fontWeight: 600,
  color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase", letterSpacing: "0.5px",
  marginBottom: 6, display: "block",
};

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [leadForm, setLeadForm] = useState({ email: "", company: "", role: "", honeypot: "" });
  const [leadStatus, setLeadStatus] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("auditResults");
      if (saved) setResults(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  if (!results) {
    return (
      <div style={{ minHeight: "100vh", background: "#060816", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Navbar />
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>No audit data found.</p>
          <Link to="/audit">
            <button style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>
              Start Audit
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { formData, auditData } = results;
  const summary = auditData?.summary ?? {
    totalCurrentMonthly: formData.rows.reduce((s, r) => s + (parseFloat(r.monthlySpend) || 0) * (parseInt(r.seats) || 1), 0),
    totalMonthlySavings: 0, totalAnnualSavings: 0, savingsPercent: 0,
  };
  const recommendations = auditData?.recommendations ?? [];
  const flags = auditData?.flags ?? [];
  const aiSummary = auditData?.aiSummary ?? "";
  const shareId = auditData?.shareId ?? null;
  const shareUrl = shareId ? `${window.location.origin}/share/${shareId}` : null;
  const isHighImpact = (summary.totalAnnualSavings ?? 0) > 500;

  // Chart data
  const pieData = formData.rows.map((r) => ({
    name: r.tool,
    value: (parseFloat(r.monthlySpend) || 0) * (parseInt(r.seats) || 1),
  })).filter((d) => d.value > 0);

  const barData = [
    { name: "Current", monthly: summary.totalCurrentMonthly ?? 0, fill: "#f87171" },
    { name: "Optimized", monthly: summary.optimizedMonthly ?? (summary.totalCurrentMonthly ?? 0) - (summary.totalMonthlySavings ?? 0), fill: "#34d399" },
  ];

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied!");
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadStatus("loading");
    try {
      await API.post("/leads", {
        email: leadForm.email,
        company: leadForm.company,
        role: leadForm.role,
        honeypot: leadForm.honeypot,
        teamSize: formData.teamSize,
        auditId: shareId,
      });
      setLeadStatus("success");
      toast.success("Report sent to your inbox!");
    } catch {
      setLeadStatus("error");
      toast.error("Could not send — check backend connection.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060816" }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "120px 16px 80px" }}>

        {/* ── HERO ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 48 }}>
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            Audit Complete · {summary.toolsAudited ?? formData.rows.length} tools analyzed
          </p>
          {(summary.totalMonthlySavings ?? 0) > 0 ? (
            <>
              <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-2px", color: "white", lineHeight: 1.05, marginBottom: 12 }}>
                You could save{" "}
                <span style={{ background: "linear-gradient(135deg, #34d399, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ${(summary.totalMonthlySavings ?? 0).toFixed(0)}/month
                </span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 18, fontWeight: 500 }}>
                That's{" "}
                <strong style={{ color: "#34d399", fontSize: 22 }}>${(summary.totalAnnualSavings ?? 0).toFixed(0)}</strong>
                {" "}annually — a {summary.savingsPercent ?? 0}% reduction.
              </p>
            </>
          ) : (
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", color: "white", marginBottom: 12 }}>
              Your AI Spend Report
            </h1>
          )}
        </motion.div>

        {/* ── SUMMARY CARDS ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 40 }}
        >
          {[
            { label: "Monthly spend",  value: `$${(summary.totalCurrentMonthly ?? 0).toFixed(0)}`,  color: "#f87171" },
            { label: "Annual spend",   value: `$${(summary.totalCurrentAnnual ?? 0).toFixed(0)}`,   color: "#fb923c" },
            { label: "Monthly savings",value: `$${(summary.totalMonthlySavings ?? 0).toFixed(0)}`,  color: "#34d399" },
            { label: "Annual savings", value: `$${(summary.totalAnnualSavings ?? 0).toFixed(0)}`,   color: "#34d399" },
          ].map((card, i) => (
            <motion.div key={card.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: card.color, letterSpacing: "-0.5px" }}>{card.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.4 }}>{card.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CHARTS ── */}
        {pieData.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}
          >
            {/* Spend distribution pie */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Spend distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1a1f3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: 13 }}
                    formatter={(v) => [`$${v}/mo`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 8 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Current vs optimized bar */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Current vs optimized</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "#1a1f3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: 13 }}
                    formatter={(v) => [`$${v}/mo`, "Monthly spend"]}
                  />
                  <Bar dataKey="monthly" radius={[6, 6, 0, 0]}>
                    {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── AI SUMMARY ── */}
        {aiSummary && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 28, marginBottom: 32 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }} aria-hidden="true">🤖</span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>AI Optimization Analysis</h2>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.85, margin: 0 }}>{aiSummary}</p>
          </motion.div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        {recommendations.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={7} aria-label="Recommendations" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20 }}>
              💡 Recommendations ({recommendations.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {recommendations.map((rec, i) => {
                const sev = severityColor[rec.severity] ?? severityColor.medium;
                return (
                  <motion.article key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i + 7}
                    style={{ background: sev.bg, border: `1px solid ${sev.border}`, borderRadius: 14, padding: 24 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{rec.tool}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{rec.currentPlan} → {rec.recommendedPlan}</span>
                        <span style={{ background: sev.bg, border: `1px solid ${sev.border}`, color: sev.text, borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                          {sev.label}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>${rec.monthlySavings}/mo</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>${rec.monthlySavings * 12}/yr saved</div>
                      </div>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>{rec.reason}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── FLAGS ── */}
        {flags.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={12} aria-label="Additional insights" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20 }}>
              🔎 Additional Insights ({flags.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {flags.map((flag, i) => {
                const sev = severityColor[flag.severity] ?? severityColor.low;
                return (
                  <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i + 12}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true">{flagTypeIcon[flag.type] ?? "ℹ️"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: sev.text }}>{sev.label}</span>
                        {flag.potentialSavings != null && (
                          <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>~${flag.potentialSavings}/mo potential</span>
                        )}
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{flag.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── CREDEX CTA ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={16}
          style={{
            background: isHighImpact ? "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.08))" : "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
            border: isHighImpact ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(99,102,241,0.2)",
            borderRadius: 16, padding: 28, marginBottom: 32,
          }}
        >
          {isHighImpact ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }} aria-hidden="true">🚀</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#34d399", margin: 0 }}>High-impact optimization opportunity detected</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Your stack has over $500/year in identified savings. Book a Credex consultation to unlock additional infrastructure savings and get a full cost optimization roadmap tailored to your team.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }} aria-hidden="true">✅</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#a5b4fc", margin: 0 }}>Your current stack is already reasonably optimized</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                No major overspend patterns were detected. Continue monitoring your usage as your team grows — plan tiers that fit today may become inefficient at scale.
              </p>
            </>
          )}
        </motion.div>

        {/* ── LEAD CAPTURE ── */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={17} aria-label="Email report"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32, marginBottom: 32 }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>📧 Email my audit report</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 24 }}>
            Get a copy of this report with the full AI analysis sent to your inbox.
          </p>

          <AnimatePresence mode="wait">
            {leadStatus === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} role="status"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }} aria-hidden="true">✅</div>
                <p style={{ color: "#34d399", fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>Report sent!</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Check your inbox for your personalized AI spend audit.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleLeadSubmit} noValidate>
                {/* Honeypot — hidden from humans */}
                <input
                  type="text" name="honeypot" value={leadForm.honeypot}
                  onChange={(e) => setLeadForm((p) => ({ ...p, honeypot: e.target.value }))}
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                  tabIndex={-1} autoComplete="off" aria-hidden="true"
                />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label htmlFor="lead-email" style={labelCls}>Work email *</label>
                    <input id="lead-email" type="email" required placeholder="you@company.com"
                      value={leadForm.email} onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                      style={inputCls} aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-company" style={labelCls}>Company</label>
                    <input id="lead-company" type="text" placeholder="Acme Inc."
                      value={leadForm.company} onChange={(e) => setLeadForm((p) => ({ ...p, company: e.target.value }))}
                      style={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-role" style={labelCls}>Your role</label>
                    <input id="lead-role" type="text" placeholder="CTO, Head of Eng…"
                      value={leadForm.role} onChange={(e) => setLeadForm((p) => ({ ...p, role: e.target.value }))}
                      style={inputCls}
                    />
                  </div>
                </div>
                <button type="submit" disabled={leadStatus === "loading"} aria-label="Send audit report to email"
                  style={{
                    background: leadStatus === "loading" ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white", border: "none", borderRadius: 10, padding: "12px 28px",
                    fontSize: 15, fontWeight: 700, cursor: leadStatus === "loading" ? "not-allowed" : "pointer",
                    boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                  }}
                >
                  {leadStatus === "loading" ? "Sending…" : "Email My Report →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── ACTIONS ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={18}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}
        >
          <Link to="/audit">
            <button aria-label="Edit audit" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.7)", padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              ← Edit Audit
            </button>
          </Link>
          {shareUrl && (
            <button onClick={handleCopyLink} aria-label="Copy shareable report link"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.7)", padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              🔗 Copy share link
            </button>
          )}
          {shareId && (
            <Link to={`/share/${shareId}`}>
              <button aria-label="View public shareable report" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
                View Public Report →
              </button>
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
}
