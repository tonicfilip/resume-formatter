import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PDF Resume",
};

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "40px" }}>
        Last updated: June 2025
      </p>

      <Section title="1. Who We Are">
        PDF Resume ("we", "us", "our") operates pdf-resume.com. This Privacy
        Policy explains how we collect, use, and protect your personal
        information.
      </Section>
      <Section title="2. Information We Collect">
        <span>We collect the following when you use our Service:</span>
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>
            Account information: your email address, provided via Clerk
            authentication
          </li>
          <li>
            Resume content: the information you enter into the resume builder
          </li>
          <li>
            Payment information: processed by Paddle — we never see or store
            your card details
          </li>
          <li>Usage data: basic analytics on how the Service is used</li>
        </ul>
      </Section>
      <Section title="3. How We Use Your Information">
        <span>We use your information to:</span>
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>Provide and improve the Service</li>
          <li>Process payments and verify access</li>
          <li>Send transactional emails (receipt, account-related)</li>
          <li>Respond to support requests</li>
        </ul>
      </Section>
      <Section title="4. Data Storage">
        Your account data is stored securely in Supabase. Generated PDF files
        are temporarily stored in AWS S3 and automatically deleted after 24
        hours. Resume content entered into the builder is not permanently stored
        on our servers.
      </Section>
      <Section title="5. Third-Party Services">
        <span>We use the following third-party services:</span>
        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          <li>
            <strong>Clerk</strong> — authentication
          </li>
          <li>
            <strong>Paddle</strong> — payment processing
          </li>
          <li>
            <strong>Supabase</strong> — database
          </li>
          <li>
            <strong>AWS S3</strong> — temporary file storage
          </li>
          <li>
            <strong>Vercel</strong> — hosting
          </li>
        </ul>
      </Section>
      <Section title="6. Data Sharing">
        We do not sell, rent, or share your personal data with third parties for
        marketing purposes.
      </Section>
      <Section title="7. Cookies">
        We use essential cookies for authentication and session management only.
        We do not use tracking or advertising cookies.
      </Section>
      <Section title="8. Your Rights">
        You have the right to access, correct, or delete your personal data at
        any time. Contact us at{" "}
        <a
          href="mailto:refunds-pdf-resume@gmail.com"
          style={{ color: "#0F4C81" }}
        >
          refunds-pdf-resume@gmail.com
        </a>{" "}
        and we will process your request within 30 days.
      </Section>
      <Section title="9. Data Retention">
        We retain your account data for as long as your account is active. If
        you delete your account, your data is removed within 30 days.
      </Section>
      <Section title="10. Security">
        We implement industry-standard security measures including HTTPS
        encryption, secure authentication via Clerk, and access controls on all
        data stores.
      </Section>
      <Section title="11. Changes to This Policy">
        We may update this Privacy Policy from time to time and will notify you
        of significant changes via email or a notice on the Service.
      </Section>
      <Section title="12. Contact">
        For privacy-related questions:{" "}
        <a
          href="mailto:refunds-pdf-resume@gmail.com"
          style={{ color: "#0F4C81" }}
        >
          refunds-pdf-resume@gmail.com
        </a>
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
