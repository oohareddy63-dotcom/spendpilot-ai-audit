import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";
import { tools, toolNames, useCases } from "../data/tools";

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

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "white",
  padding: "10px 14px",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: 6,
  display: "block",
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

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem("auditForm", JSON.stringify(formData));
  }, [formData]);

  const updateGlobal = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateRow = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: value,
              // reset plan when tool changes
              ...(field === "tool" ? { plan: "" } : {}),
            }
          : r
      ),
    }));
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      rows: [...prev.rows, defaultRow()],
    }));
  };

  const removeRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.filter((r) => r.id !== id),
    }));
  };

  const totalSpend = formData.rows.reduce((sum, r) => {
    const spend = parseFloat(r.monthlySpend) || 0;
    const seats = parseInt(r.seats) || 1;
    return sum + spend * seats;
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save results stub and navigate
    localStorage.setItem("auditResults", JSON.stringify({ formData, submittedAt: new Date().toISOString() }));
    navigate("/results");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060816" }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "120px 24px 80px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
            Free Audit
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "white",
              marginBottom: 12,
            }}
          >
            Audit your AI spend
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.6 }}>
            Add every AI tool your team pays for. We'll analyze your stack and surface savings.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Global fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>
              Team context
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Team size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => updateGlobal("teamSize", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  required
                >
                  <option value="" disabled>Select size</option>
                  {["1", "2–5", "6–15", "16–50", "51–200", "200+"].map((s) => (
                    <option key={s} value={s} style={{ background: "#0f1225" }}>{s} people</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Primary use case</label>
                <select
                  value={formData.useCase}
                  onChange={(e) => updateGlobal("useCase", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  required
                >
                  <option value="" disabled>Select use case</option>
                  {useCases.map((u) => (
                    <option key={u} value={u} style={{ background: "#0f1225" }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Tool rows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>
                AI tools ({formData.rows.length})
              </h2>
              {totalSpend > 0 && (
                <span
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a5b4fc",
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  ${totalSpend.toFixed(0)}/mo total
                </span>
              )}
            </div>

            {/* Column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 40px",
                gap: 12,
                marginBottom: 10,
              }}
            >
              {["Tool", "Plan", "$/mo per seat", "Seats", ""].map((h) => (
                <span key={h} style={labelStyle}>{h}</span>
              ))}
            </div>

            <AnimatePresence>
              {formData.rows.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.5fr 1fr 1fr 40px",
                    gap: 12,
                    marginBottom: 12,
                    alignItems: "center",
                  }}
                >
                  {/* Tool dropdown */}
                  <select
                    value={row.tool}
                    onChange={(e) => updateRow(row.id, "tool", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    required
                  >
                    <option value="" disabled>Select tool</option>
                    {toolNames.map((t) => (
                      <option key={t} value={t} style={{ background: "#0f1225" }}>{t}</option>
                    ))}
                  </select>

                  {/* Plan dropdown */}
                  <select
                    value={row.plan}
                    onChange={(e) => updateRow(row.id, "plan", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    disabled={!row.tool}
                    required
                  >
                    <option value="" disabled>Select plan</option>
                    {row.tool &&
                      tools[row.tool]?.map((p) => (
                        <option key={p} value={p} style={{ background: "#0f1225" }}>{p}</option>
                      ))}
                  </select>

                  {/* Monthly spend */}
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={row.monthlySpend}
                    onChange={(e) => updateRow(row.id, "monthlySpend", e.target.value)}
                    style={inputStyle}
                    required
                  />

                  {/* Seats */}
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={row.seats}
                    onChange={(e) => updateRow(row.id, "seats", e.target.value)}
                    style={inputStyle}
                    required
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={formData.rows.length === 1}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 8,
                      color: formData.rows.length === 1 ? "rgba(255,255,255,0.15)" : "#f87171",
                      width: 36,
                      height: 36,
                      cursor: formData.rows.length === 1 ? "not-allowed" : "pointer",
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                    }}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add row */}
            <button
              type="button"
              onClick={addRow}
              style={{
                marginTop: 8,
                background: "rgba(99,102,241,0.08)",
                border: "1px dashed rgba(99,102,241,0.35)",
                borderRadius: 8,
                color: "#a5b4fc",
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "rgba(99,102,241,0.14)")}
              onMouseLeave={(e) => (e.target.style.background = "rgba(99,102,241,0.08)")}
            >
              + Add another tool
            </button>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
          >
            <button
              type="button"
              onClick={() => {
                setFormData(defaultForm);
                localStorage.removeItem("auditForm");
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "rgba(255,255,255,0.5)",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(99,102,241,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 0 36px rgba(99,102,241,0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 0 24px rgba(99,102,241,0.35)";
              }}
            >
              Run Audit →
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
