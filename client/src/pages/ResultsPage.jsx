import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function ResultsPage() {
  const [results, setResults] = useState(null);

  useEffect(() => {
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

  const { formData } = results;
  const totalMonthly = formData.rows.reduce((sum, r) => {
    return sum + (parseFloat(r.monthlySpend) || 0) * (parseInt(r.seats) || 1);
  }, 0);
  const totalAnnual = totalMonthly * 12;
  const estimatedSavings = totalAnnual * 0.28; // placeholder 28% savings estimate

  return (
    <div style={{ minHeight: "100vh", background: "#060816" }}>
      <Navbar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: 40 }}>
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
            Audit Complete
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.8px", color: "white", marginBottom: 12 }}>
            Your AI Spend Report
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>
            Team size: <strong style={{ color: "white" }}>{formData.teamSize}</strong> &nbsp;·&nbsp;
            Use case: <strong style={{ color: "white" }}>{formData.useCase}</strong>
          </p>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}
        >
          {[
            { label: "Monthly spend", value: `$${totalMonthly.toFixed(0)}`, color: "#f87171" },
            { label: "Annual spend", value: `$${totalAnnual.toFixed(0)}`, color: "#fb923c" },
            { label: "Est. potential savings", value: `$${estimatedSavings.toFixed(0)}/yr`, color: "#34d399" },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "24px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: card.color, letterSpacing: "-0.5px" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{card.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tool breakdown */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 28,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>Tool breakdown</h2>
          {formData.rows.map((row, i) => {
            const rowTotal = (parseFloat(row.monthlySpend) || 0) * (parseInt(row.seats) || 1);
            const pct = totalMonthly > 0 ? (rowTotal / totalMonthly) * 100 : 0;
            return (
              <div key={row.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>
                    {row.tool} <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>({row.plan})</span>
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                    ${rowTotal.toFixed(0)}/mo · {row.seats} seat{parseInt(row.seats) !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      borderRadius: 999,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* AI analysis placeholder */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 16,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>AI Recommendations</h2>
            <span style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
              Coming Day 3
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
            Personalized AI-powered recommendations will appear here once the backend audit engine is connected. Based on your stack, we'll surface redundant tools, cheaper plan alternatives, and seat optimization opportunities.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <Link to="/audit">
            <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.7)", padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              ← Edit Audit
            </button>
          </Link>
          <button
            onClick={() => {
              const id = Date.now().toString(36);
              localStorage.setItem(`share_${id}`, JSON.stringify(results));
              window.location.href = `/share/${id}`;
            }}
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
          >
            Share Report →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
