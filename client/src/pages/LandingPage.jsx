import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const stats = [
  { value: "$4,200", label: "Avg. annual savings" },
  { value: "3 min", label: "To complete audit" },
  { value: "15+", label: "AI tools supported" },
];

const faqs = [
  {
    q: "Is this really free?",
    a: "Yes. The audit is completely free. No credit card, no account required. You get the full report instantly.",
  },
  {
    q: "How does the audit engine work?",
    a: "We compare your reported spend against official benchmark pricing for each tool and plan. Our rule engine detects overprovisioned plans, duplicate tools, and team-size mismatches — then calculates exact monthly and annual savings.",
  },
  {
    q: "Which AI tools do you support?",
    a: "We currently support Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, OpenAI API, Anthropic API, Windsurf, v0, Midjourney, Perplexity, Notion, Linear, Vercel, and GitHub — with more being added regularly.",
  },
  {
    q: "Is my data stored?",
    a: "Audit results are stored anonymously to generate your shareable report link. We never sell your data. If you submit your email for the report, it is stored securely and used only to send your audit.",
  },
  {
    q: "What if I don't know my exact spend?",
    a: "Use your best estimate. The audit engine compares your input against official plan pricing, so even approximate numbers will surface meaningful savings opportunities.",
  },
];

const features = [
  {
    icon: "🔍",
    title: "Smart Audit Engine",
    desc: "Analyzes your entire AI tool stack against real pricing data to surface redundancies, unused seats, and cheaper alternatives.",
  },
  {
    icon: "🤖",
    title: "AI Personalized Summary",
    desc: "Get a plain-English breakdown of exactly where your money is going and what to cut — tailored to your team size and use case.",
  },
  {
    icon: "📊",
    title: "Shareable Cost Reports",
    desc: "Generate a clean, shareable report link to present findings to your finance team or leadership in seconds.",
  },
];

const steps = [
  {
    num: "01",
    title: "Enter your stack",
    desc: "Add the AI tools your team uses, select your plan, and enter monthly spend.",
  },
  {
    num: "02",
    title: "Get your audit",
    desc: "Our engine analyzes your spend against benchmarks and surfaces savings opportunities.",
  },
  {
    num: "03",
    title: "Save money",
    desc: "Act on personalized recommendations and share the report with your team.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#060816" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 100,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            style={{ display: "inline-flex", marginBottom: 24 }}
          >
            <span
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.35)",
                color: "#a5b4fc",
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.3px",
              }}
            >
              ✦ Free AI Spend Audit — No credit card required
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: 24,
              color: "white",
            }}
          >
            Stop Overspending{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              on AI Tools
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 580,
              margin: "0 auto 40px",
            }}
          >
            Instantly audit your ChatGPT, Claude, Cursor, and Copilot stack to
            uncover unnecessary AI spend — and get a personalized savings plan.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link to="/audit">
              <button
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 28px",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 0 30px rgba(99,102,241,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 0 40px rgba(99,102,241,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 0 30px rgba(99,102,241,0.35)";
                }}
              >
                Start Free Audit →
              </button>
            </Link>
            <a href="#how-it-works">
              <button
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "14px 28px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.09)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.05)")
                }
              >
                See how it works
              </button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 48,
              marginTop: 64,
              flexWrap: "wrap",
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            Features
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "white",
            }}
          >
            Everything you need to cut AI waste
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 32,
                transition: "border-color 0.3s, transform 0.3s",
                cursor: "default",
              }}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.4)" }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 12,
                  letterSpacing: "-0.3px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: 15 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{
          padding: "100px 24px",
          background: "rgba(99,102,241,0.04)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
              How it works
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                color: "white",
              }}
            >
              Audit your stack in 3 minutes
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 32,
            }}
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                style={{ textAlign: "center", padding: "0 16px" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                    border: "1px solid rgba(99,102,241,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#a5b4fc",
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 10,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: 14 }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        style={{ padding: "100px 24px", maxWidth: 760, margin: "0 auto" }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{ color: "#6366f1", fontWeight: 600, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            FAQ
          </p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.8px", color: "white" }}>
            Common questions
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "22px 24px",
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 10 }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 24,
              padding: "60px 40px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                color: "white",
                marginBottom: 16,
              }}
            >
              Ready to stop the bleed?
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 16,
                lineHeight: 1.7,
                marginBottom: 36,
              }}
            >
              Run your free AI spend audit in under 3 minutes. No account needed.
            </p>
            <Link to="/audit">
              <button
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 32px",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 0 30px rgba(99,102,241,0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 0 45px rgba(99,102,241,0.55)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 0 30px rgba(99,102,241,0.4)";
                }}
              >
                Start Free Audit →
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 60, color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
          © 2026 SpendPilot · Built for the Credex AI Challenge
        </div>
      </section>
    </div>
  );
}
