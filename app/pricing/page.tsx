import Link from "next/link";

export const metadata = {
  title: "Pricing — PDF Resume",
};

export default function PricingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "60px 24px",
        textAlign: "center",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "14px",
          color: "#60a5fa",
          textDecoration: "none",
          marginBottom: "48px",
          display: "block",
        }}
      >
        ← Back to home
      </Link>

      <h1
        style={{
          fontSize: "40px",
          fontWeight: 800,
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}
      >
        Simple pricing
      </h1>
      <p style={{ color: "#9ca3af", fontSize: "18px", marginBottom: "48px" }}>
        One price. No subscriptions. No surprises.
      </p>

      <div
        style={{
          background: "#111",
          border: "1px solid #1e3a5f",
          borderRadius: "16px",
          padding: "40px 48px",
          maxWidth: "400px",
          width: "100%",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#60a5fa",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "16px",
          }}
        >
          One-time payment
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          $9
        </div>
        <div
          style={{ color: "#6b7280", fontSize: "14px", marginBottom: "32px" }}
        >
          USD · pay once · use forever
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 32px",
            textAlign: "left",
          }}
        >
          {[
            "3 professional resume templates",
            "ATS-friendly PDF output",
            "Live preview as you type",
            "Unlimited downloads after purchase",
            "All future template updates included",
          ].map((f) => (
            <li
              key={f}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #1f2937",
                fontSize: "15px",
                color: "#d1d5db",
                display: "flex",
                gap: "10px",
              }}
            >
              <span style={{ color: "#3b82f6", flexShrink: 0 }}>✓</span> {f}
            </li>
          ))}
        </ul>

        <Link
          href="/resume"
          style={{
            display: "block",
            background: "#0F4C81",
            color: "#fff",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "16px",
            textDecoration: "none",
          }}
        >
          Build my resume →
        </Link>
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "14px",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link
          href="/terms"
          style={{ color: "#6b7280", textDecoration: "none" }}
        >
          Terms
        </Link>
        <Link
          href="/privacy"
          style={{ color: "#6b7280", textDecoration: "none" }}
        >
          Privacy
        </Link>
        <Link
          href="/refunds"
          style={{ color: "#6b7280", textDecoration: "none" }}
        >
          Refunds
        </Link>
      </div>
    </main>
  );
}
