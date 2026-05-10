import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { tools, toolNames, useCases } from "../data/tools";
import API from "../services/api";

const defaultRow = () => ({
  id: uuidv4(),
  tool: "",
  plan: "",
  monthlySpend: "",
  seats: "",
});

const defaultForm = {
  teamSize: "",
  useCase: "",
  rows: [defaultRow()],
};

export default function AuditFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("auditForm");
      return saved ? JSON.parse(saved) : defaultForm;
    } catch {
      return defaultForm;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("auditForm", JSON.stringify(formData));
  }, [formData]);

  const updateGlobal = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateRow = (id, field, value) =>
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === id ? { ...r, [field]: value, ...(field === "tool" ? { plan: "" } : {}) } : r
      ),
    }));

  const addRow = () =>
    setFormData((prev) => ({ ...prev, rows: [...prev.rows, defaultRow()] }));

  const removeRow = (id) =>
    setFormData((prev) => ({ ...prev, rows: prev.rows.filter((r) => r.id !== id) }));

  const totalSpend = formData.rows.reduce(
    (sum, r) => sum + (parseFloat(r.monthlySpend) || 0) * (parseInt(r.seats) || 1),
    0
  );

  // Client-side validation
  const validate = () => {
    for (const row of formData.rows) {
      if (!row.tool) return "Please select a tool for each row.";
      if (!row.plan) return "Please select a plan for each tool.";
      if (parseFloat(row.monthlySpend) < 0) return "Monthly spend cannot be negative.";
      if (parseInt(row.seats) < 1) return "Seats must be at least 1.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      teamSize: formData.teamSize,
      useCase: formData.useCase,
      tools: formData.rows.map((r) => ({
        name: r.tool,
        plan: r.plan,
        seats: parseInt(r.seats) || 1,
        spend: parseFloat(r.monthlySpend) || 0,
      })),
    };

    try {
      const response = await API.post("/audit", payload);
      localStorage.setItem(
        "auditResults",
        JSON.stringify({ formData, auditData: response.data, submittedAt: new Date().toISOString() })
      );
      toast.success("Audit complete!");
      navigate("/results");
    } catch (err) {
      const msg = "Could not reach the audit server. Make sure the backend is running on port 5000.";
      setError(msg);
      toast.error("Audit failed — check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "white",
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelCls = {
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060816" }}>
      <Navbar />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "120px 16px 80px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 40 }}>
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
            Free Audit
          </p>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.8px", color: "white", marginBottom: 12 }}>
            Audit your AI spend
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.6 }}>
            Add every AI tool your team pays for. We'll analyze your stack and surface savings.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Team context */}
          <motion.section
            aria-label="Team context"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 20px", marginBottom: 20 }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>Team context</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <label htmlFor="teamSize" style={labelCls}>Team size</label>
                <select
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) => updateGlobal("teamSize", e.target.value)}
                  style={{ ...inputCls, cursor: "pointer" }}
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Select size</option>
                  {["1", "2–5", "6–15", "16–50", "51–200", "200+"].map((s) => (
                    <option key={s} value={s} style={{ background: "#0f1225" }}>{s} people</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="useCase" style={labelCls}>Primary use case</label>
                <select
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => updateGlobal("useCase", e.target.value)}
                  style={{ ...inputCls, cursor: "pointer" }}
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Select use case</option>
                  {useCases.map((u) => (
                    <option key={u} value={u} style={{ background: "#0f1225" }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.section>

          {/* Tool rows */}
          <motion.section
            aria-label="AI tools"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 20px", marginBottom: 20 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>
                AI tools ({formData.rows.length})
              </h2>
              {totalSpend > 0 && (
                <span style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", borderRadius: 999, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
                  ${totalSpend.toFixed(0)}/mo total
                </span>
              )}
            </div>

            {/* Desktop column headers — hidden on mobile */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 40px", gap: 10, marginBottom: 8 }}
              className="desktop-headers"
              aria-hidden="true"
            >
              {["Tool", "Plan", "$/mo per seat", "Seats", ""].map((h) => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
              ))}
            </div>

            <AnimatePresence>
              {formData.rows.map((row, idx) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  role="group"
                  aria-label={`Tool row ${idx + 1}`}
                  style={{ marginBottom: 12 }}
                >
                  {/* Desktop layout */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 40px", gap: 10, alignItems: "center" }}
                    className="tool-row-desktop"
                  >
                    <select
                      value={row.tool}
                      onChange={(e) => updateRow(row.id, "tool", e.target.value)}
                      style={{ ...inputCls, cursor: "pointer" }}
                      required
                      aria-label={`Tool ${idx + 1}`}
                    >
                      <option value="" disabled>Select tool</option>
                      {toolNames.map((t) => (
                        <option key={t} value={t} style={{ background: "#0f1225" }}>{t}</option>
                      ))}
                    </select>

                    <select
                      value={row.plan}
                      onChange={(e) => updateRow(row.id, "plan", e.target.value)}
                      style={{ ...inputCls, cursor: "pointer" }}
                      disabled={!row.tool}
                      required
                      aria-label={`Plan for tool ${idx + 1}`}
                    >
                      <option value="" disabled>Select plan</option>
                      {row.tool && tools[row.tool]?.map((p) => (
                        <option key={p} value={p} style={{ background: "#0f1225" }}>{p}</option>
                      ))}
                    </select>

                    <input
                      type="number" min="0" step="0.01" placeholder="0"
                      value={row.monthlySpend}
                      onChange={(e) => updateRow(row.id, "monthlySpend", e.target.value)}
                      style={inputCls}
                      required
                      aria-label={`Monthly spend per seat for tool ${idx + 1}`}
                    />

                    <input
                      type="number" min="1" placeholder="1"
                      value={row.seats}
                      onChange={(e) => updateRow(row.id, "seats", e.target.value)}
                      style={inputCls}
                      required
                      aria-label={`Number of seats for tool ${idx + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={formData.rows.length === 1}
                      aria-label={`Remove tool row ${idx + 1}`}
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 8,
                        color: formData.rows.length === 1 ? "rgba(255,255,255,0.15)" : "#f87171",
                        width: 36, height: 36,
                        cursor: formData.rows.length === 1 ? "not-allowed" : "pointer",
                        fontSize: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={addRow}
              aria-label="Add another tool"
              style={{
                marginTop: 8,
                background: "rgba(99,102,241,0.08)",
                border: "1px dashed rgba(99,102,241,0.35)",
                borderRadius: 8,
                color: "#a5b4fc",
                padding: "10px 20px",
                fontSize: 14, fontWeight: 600,
                cursor: "pointer", width: "100%",
              }}
            >
              + Add another tool
            </button>
          </motion.section>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                role="alert"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", color: "#f87171", fontSize: 14, marginBottom: 16 }}
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}
          >
            <button
              type="button"
              onClick={() => { setFormData(defaultForm); localStorage.removeItem("auditForm"); toast("Form reset."); }}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.5)", padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-label="Run AI spend audit"
              aria-busy={loading}
              style={{
                background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white", border: "none", borderRadius: 10,
                padding: "12px 32px", fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.35)",
                minWidth: 160,
              }}
            >
              {loading ? "Analyzing…" : "Run Audit →"}
            </button>
          </motion.div>
        </form>
      </main>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .tool-row-desktop {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .tool-row-desktop > *:nth-child(3),
          .tool-row-desktop > *:nth-child(4) {
            grid-column: span 1;
          }
          .tool-row-desktop > *:nth-child(5) {
            grid-column: span 2;
            width: 36px;
            margin-left: auto;
          }
          .desktop-headers {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
