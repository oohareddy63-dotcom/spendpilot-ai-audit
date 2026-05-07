import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(6, 8, 22, 0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
          }}
        >
          S
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: "white", letterSpacing: "-0.3px" }}>
          SpendPilot
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { label: "Features", href: "/#features" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Pricing", href: "/#pricing" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <Link to="/audit">
        <button
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.9";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Start Free Audit →
        </button>
      </Link>
    </nav>
  );
}
