import Link from "next/link";

export const metadata = {
  title: "Terms of Service — PDF Resume",
};

export default function TermsPage() {
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
        Terms of Service
      </h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "40px" }}>
        Last updated: June 2025
      </p>

      <Section title="1. Acceptance of Terms">
        By accessing or using PDF Resume at pdf-resume.com ("the Service"), you
        agree to be bound by these Terms of Service. If you do not agree, please
        do not use the Service.
      </Section>
      <Section title="2. Description of Service">
        PDF Resume is a web-based tool that allows users to create and download
        professionally formatted PDF resumes. The Service is provided on a
        one-time payment basis.
      </Section>
      <Section title="3. Payment">
        Access to PDF download functionality requires a one-time payment of $9
        USD. All payments are processed securely through Paddle. Once payment is
        confirmed, you receive lifetime access to download your resume PDFs.
      </Section>
      <Section title="4. Refund Policy">
        We offer refunds within 7 days of purchase if you are not satisfied with
        the Service. See our{" "}
        <Link href="/refunds" style={{ color: "#0F4C81" }}>
          Refund Policy
        </Link>{" "}
        for details.
      </Section>
      <Section title="5. User Accounts">
        You must create an account to use the Service. You are responsible for
        maintaining the confidentiality of your account credentials and for all
        activities that occur under your account.
      </Section>
      <Section title="6. Acceptable Use">
        You agree not to use the Service to create resumes containing false,
        misleading, or fraudulent information, or to violate any applicable laws
        or regulations.
      </Section>
      <Section title="7. Intellectual Property">
        The Service, including its design, code, and templates, is owned by PDF
        Resume. You retain full ownership of the content you enter into the
        Service. We do not claim any rights over your resume content.
      </Section>
      <Section title="8. Data and Privacy">
        Your use of the Service is also governed by our{" "}
        <Link href="/privacy" style={{ color: "#0F4C81" }}>
          Privacy Policy
        </Link>
        . We do not sell your personal data to third parties.
      </Section>
      <Section title="9. Disclaimers">
        The Service is provided "as is" without warranties of any kind. We do
        not guarantee that the Service will be uninterrupted or error-free. We
        are not responsible for any outcomes resulting from the use of resumes
        created with the Service.
      </Section>
      <Section title="10. Limitation of Liability">
        To the maximum extent permitted by law, PDF Resume shall not be liable
        for any indirect, incidental, or consequential damages arising from your
        use of the Service. Our total liability shall not exceed the amount you
        paid for the Service.
      </Section>
      <Section title="11. Changes to Terms">
        We reserve the right to update these Terms at any time. Continued use of
        the Service after changes constitutes acceptance of the new Terms.
      </Section>
      <Section title="12. Contact">
        For questions about these Terms, contact us at:{" "}
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
