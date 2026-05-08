import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const severityColor = {
  high:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   text: "#f87171",  label: "High Impact" },
  medium: { bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)",  text: "#fb923c",  label: "Medium Impact" },
  low:    { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.2)",   text: "#fbbf24",  label: "Low Impact" },
};

const flagTypeIcon = {
  overlap:    "⚠️",
  sprawl:     "📊",
  mismatch:   "🔍",
  high_spend: "💸",
  overpay:    "🧾",
};

export default function ResultsPage() {
  const location = useLocation();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Try location state first (direct navigation), then localStorage
    try {
      const saved = localStorage.getItem("auditResults");
      if (saved) setResults(JSON.parse(saved));
    } catch {
      // ignore
    }
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

  // Fallback: if auditData missing (old localStorage), compute basic numbers
  const summary = auditData?.summary ?? {
    totalCurrentMonthly: formData.rows.reduce((s, r) => s + (parseFloat(r.monthlySpend) || 0) * (parseInt(r.seats) || 1), 0),
    totalMonthlySavings: 0,
    totalAnnualSavings: 0,
    savingsPercent: 0,
  };
  const recommendations = auditData?.recommendations ?? [];
  const flags = auditData?.flags ?? [];

  const hasSavings = summary.totalMonthlySavings > 0;
  const isHighImpact = summary.totalAnnualSavings > 500;

  return (
    <div style={{ minHeight: "100vh", background: "#060816" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* ── HERO SAVINGS HEADER ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 48 }}>
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            Audit Complete · {summary.toolsAudited} tool{summary.toolsAudited !== 1 ? "s" : ""} analyzed
          </p>

          {hasSavings ? (
            <>
              <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, marginBottom: 12 }}>
                You could save{" "}
                <span style={{ background: "linear-gradient(135deg, #34d399, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ${summary.totalMonthlySavings.toFixed(0)}/month
                </span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 500 }}>
                That's{" "}
                <strong style={{ color: "#34d399" }}>${summary.totalAnnualSavings.toFixed(0)} annually</strong>
                {" "}— a {summary.savingsPercent}% reduction in your AI spend.
              </p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", color: "white", marginBottom: 12 }}>
                Your AI Spend Report
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
                Team: <strong style={{ color: "white" }}>{summary.teamSize}</strong> &nbsp;·&nbsp;
                Use case: <strong style={{ color: "white" }}>{summary.useCase}</strong>
              </p>
            </>
          )}
        </motion.div>

        {/* ── SUMMARY CARDS ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}
        >
          {[
            { label: "Current monthly spend", value: `$${summary.totalCurrentMonthly?.toFixed(0) ?? 0}`, color: "#f87171" },
            { label: "Current annual spend",  value: `$${summary.totalCurrentAnnual?.toFixed(0) ?? 0}`,  color: "#fb923c" },
            { label: "Monthly savings",       value: `$${summary.totalMonthlySavings?.toFixed(0) ?? 0}`, color: "#34d399" },
            { label: "Annual savings",        value: `$${summary.totalAnnualSavings?.toFixed(0) ?? 0}`,  color: "#34d399" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "22px 18px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: card.color, letterSpacing: "-0.5px" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, lineHeight: 1.4 }}>{card.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── RECOMMENDATIONS ── */}
        {recommendations.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20 }}>
              💡 Recommendations ({recommendations.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {recommendations.map((rec, i) => {
                const sev = severityColor[rec.severity] ?? severityColor.medium;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" animate="visible" custom={i + 5}
                    style={{
                      background: sev.bg,
                      border: `1px solid ${sev.border}`,
                      borderRadius: 14,
                      padding: 24,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>{rec.tool}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 8px" }}>
                          {rec.currentPlan} → {rec.recommendedPlan}
                        </span>
                        <span style={{
                          background: sev.bg,
                          border: `1px solid ${sev.border}`,
                          color: sev.text,
                          borderRadius: 999,
                          padding: "2px 10px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}>
                          {sev.label}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#34d399" }}>
                          ${rec.monthlySavings}/mo
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                          ${rec.monthlySavings * 12}/yr saved
                        </div>
                      </div>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                      {rec.reason}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── FLAGS / INSIGHTS ── */}
        {flags.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={10} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20 }}>
              🔎 Additional Insights ({flags.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {flags.map((flag, i) => {
                const sev = severityColor[flag.severity] ?? severityColor.low;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" animate="visible" custom={i + 10}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "18px 20px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{flagTypeIcon[flag.type] ?? "ℹ️"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: sev.text }}>{sev.label}</span>
                        {flag.potentialSavings != null && (
                          <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>
                            ~${flag.potentialSavings}/mo potential
                          </span>
                        )}
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                        {flag.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── TOOL BREAKDOWN ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={15}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>Spend breakdown</h2>
          {formData.rows.map((row) => {
            const rowTotal = (parseFloat(row.monthlySpend) || 0) * (parseInt(row.seats) || 1);
            const pct = summary.totalCurrentMonthly > 0 ? (rowTotal / summary.totalCurrentMonthly) * 100 : 0;
            return (
              <div key={row.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
                    {row.tool}{" "}
                    <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>({row.plan})</span>
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                    ${rowTotal.toFixed(0)}/mo · {row.seats} seat{parseInt(row.seats) !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── CREDEX CTA ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={16}
          style={{
            background: isHighImpact
              ? "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.08))"
              : "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
            border: isHighImpact
              ? "1px solid rgba(52,211,153,0.25)"
              : "1px solid rgba(99,102,241,0.2)",
            borderRadius: 16,
            padding: 28,
            marginBottom: 32,
          }}
        >
          {isHighImpact ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>🚀</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#34d399" }}>
                  High-impact optimization opportunity detected
                </h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Your stack has over $500/year in identified savings. Book a Credex consultation to unlock additional infrastructure savings and get a full cost optimization roadmap tailored to your team.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#a5b4fc" }}>
                  Your current stack is already reasonably optimized
                </h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                No major overspend patterns were detected. Continue monitoring your usage as your team grows — plan tiers that fit today may become inefficient at scale.
              </p>
            </>
          )}
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={17}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <Link to="/audit">
            <button style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "rgba(255,255,255,0.7)",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              ← Edit Audit
            </button>
          </Link>
          <button
            onClick={() => {
              const id = Date.now().toString(36);
              localStorage.setItem(`share_${id}`, JSON.stringify(results));
              window.location.href = `/share/${id}`;
            }}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(99,102,241,0.3)",
            }}
          >
            Share Report →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
