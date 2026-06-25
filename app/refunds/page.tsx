import Link from "next/link";

export const metadata = {
  title: "Refund Policy — PDF Resume",
};

export default function RefundsPage() {
  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "60px 24px 80px",
        fontFamily: "system-ui, sans-serif",
        color: "#1a1a1a",
        lineHeight: 1.7,
      }}
    >
      <Link
        href="/"
        style={{ fontSize: "14px", color: "#0F4C81", textDecoration: "none" }}
      >
        ← Back to home
      </Link>

      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          marginTop: "32px",
          marginBottom: "8px",
        }}
      >
        Refund Policy
      </h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "40px" }}>
        Last updated: June 2025
      </p>

      <Section title="Our Guarantee">
        We want you to be completely satisfied with PDF Resume. If you're not
        happy with your purchase for any reason, we offer a straightforward
        refund policy.
      </Section>
      <Section title="7-Day Money-Back Guarantee">
        You may request a full refund within 7 days of your purchase, no
        questions asked. After 7 days, refunds are considered on a case-by-case
        basis.
      </Section>
      <Section title="How to Request a Refund">
        <span>
          Email us at{" "}
          <a
            href="mailto:refunds-pdf-resume@gmail.com"
            style={{ color: "#0F4C81" }}
          >
            refunds-pdf-resume@gmail.com
          </a>{" "}
          with:
        </span>
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>The email address used for your purchase</li>
          <li>Your order ID (found in your Paddle receipt email)</li>
          <li>Reason for the refund (optional but helpful)</li>
        </ul>
        <span style={{ display: "block", marginTop: "8px" }}>
          We will process your refund within 3–5 business days.
        </span>
      </Section>
      <Section title="Exceptions">
        Refunds will not be issued if there is evidence of abuse of the refund
        policy (e.g. repeated purchases and refunds of the same product).
      </Section>
      <Section title="Questions">
        Contact us at{" "}
        <a
          href="mailto:refunds-pdf-resume@gmail.com"
          style={{ color: "#0F4C81" }}
        >
          refunds-pdf-resume@gmail.com
        </a>{" "}
        and we'll be happy to help.
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
        {title}
      </h2>
      <div style={{ color: "#374151" }}>{children}</div>
    </div>
  );
}
