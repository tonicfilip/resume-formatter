import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '24px',
      textAlign: 'center',
    }}>

      {/* Badge */}
      <div style={{
        fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#60a5fa',
        background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
        borderRadius: '20px', padding: '4px 14px', marginBottom: '32px',
      }}>
        One-time · $9 · Instant download
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(36px, 6vw, 72px)',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        marginBottom: '20px',
        maxWidth: '700px',
      }}>
        Your resume,{' '}
        <span style={{ color: '#3b82f6' }}>finally</span>{' '}
        looking the part.
      </h1>

      {/* Subheading */}
      <p style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: '#9ca3af',
        maxWidth: '480px',
        lineHeight: 1.6,
        marginBottom: '40px',
      }}>
        Fill in your details, pick a template, download a pixel-perfect
        ATS-friendly PDF. No Word wrestling. No design skills needed.
      </p>

      {/* CTA */}
      <Link href="/resume" style={{
        display: 'inline-block',
        background: '#0F4C81',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 700,
        padding: '14px 36px',
        borderRadius: '10px',
        textDecoration: 'none',
        marginBottom: '48px',
        transition: 'background 0.15s',
      }}>
        Build my resume →
      </Link>

      {/* Feature row */}
      <div style={{
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '14px',
      }}>
        {[
          '✦  3 professional templates',
          '✦  ATS-friendly PDF output',
          '✦  Live preview as you type',
          '✦  Pay once, download forever',
        ].map(f => (
          <span key={f}>{f}</span>
        ))}
      </div>

    </main>
  )
}
