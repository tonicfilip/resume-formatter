'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import type { ResumeData, TemplateId } from '../../types/resume'

const EMPTY_RESUME: ResumeData = {
  contact: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
}

const TEMPLATES: { id: TemplateId; label: string; sub: string }[] = [
  { id: 'classic', label: 'Classic',  sub: 'Serif · Corporate' },
  { id: 'modern',  label: 'Modern',   sub: 'Sidebar · Tech' },
  { id: 'minimal', label: 'Minimal',  sub: 'Clean · Creative' },
]

export default function ResumePage() {
  const { isSignedIn } = useUser()
  const searchParams = useSearchParams()
  const previewRef = useRef<HTMLDivElement>(null)

  const [resumeData, setResumeData]   = useState<ResumeData>(EMPTY_RESUME)
  const [templateId, setTemplateId]   = useState<TemplateId>('modern')
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [previewScale, setPreviewScale] = useState(0.7)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPaid, setIsPaid]           = useState(false)
  const [status, setStatus]           = useState<{ msg: string; type: 'info' | 'error' | 'success' } | null>(null)

  // Compute preview scale based on available panel width
  useEffect(() => {
    const calc = () => {
      if (!previewRef.current) return
      const panelW = previewRef.current.offsetWidth - 64
      const panelH = previewRef.current.offsetHeight - 64
      const scaleW = panelW / 794
      const scaleH = panelH / 1123
      setPreviewScale(Math.min(scaleW, scaleH, 0.85))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setIsPaid(true)
      setStatus({ msg: 'Payment confirmed — download away!', type: 'success' })
    }
  }, [searchParams])

  // Live preview debounced 400ms
  const updatePreview = useCallback(async () => {
    if (!resumeData.contact.name) return
    const res = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, templateId }),
    })
    setPreviewHtml(await res.text())
  }, [resumeData, templateId])

  useEffect(() => {
    const t = setTimeout(updatePreview, 400)
    return () => clearTimeout(t)
  }, [updatePreview])

  const handleDownload = async () => {
    if (!isSignedIn) {
      setStatus({ msg: 'Sign in to download your resume.', type: 'info' })
      return
    }
    setIsGenerating(true)
    setStatus(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, templateId }),
      })
      if (res.status === 401) { setStatus({ msg: 'Please sign in first.', type: 'error' }); return }
      if (res.status === 402) {
        const { checkoutUrl } = await res.json()
        window.location.href = checkoutUrl
        return
      }
      if (!res.ok) { setStatus({ msg: 'Something went wrong. Try again.', type: 'error' }); return }
      const { downloadUrl, isBase64 } = await res.json()
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'resume.pdf'
      if (!isBase64) a.target = '_blank'
      a.click()
      setStatus({ msg: 'PDF downloaded!', type: 'success' })
      setIsPaid(true)
    } catch {
      setStatus({ msg: 'Network error. Try again.', type: 'error' })
    } finally {
      setIsGenerating(false)
    }
  }

  const addExperience = () => setResumeData(d => ({
    ...d, experience: [...d.experience,
      { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: 'Present', bullets: [''] }]
  }))
  const removeExperience = (i: number) => setResumeData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))

  const addEducation = () => setResumeData(d => ({
    ...d, education: [...d.education,
      { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '' }]
  }))
  const removeEducation = (i: number) => setResumeData(d => ({ ...d, education: d.education.filter((_, j) => j !== i) }))

  const addSkillGroup = () => setResumeData(d => ({
    ...d, skills: [...d.skills, { id: crypto.randomUUID(), category: '', skills: [] }]
  }))
  const removeSkillGroup = (i: number) => setResumeData(d => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }))

  function updateExp(i: number, field: string, value: any) {
    setResumeData(d => { const e = [...d.experience]; e[i] = { ...e[i], [field]: value }; return { ...d, experience: e } })
  }
  function updateEdu(i: number, field: string, value: any) {
    setResumeData(d => { const e = [...d.education]; e[i] = { ...e[i], [field]: value }; return { ...d, education: e } })
  }
  function updateSkill(i: number, field: string, value: any) {
    setResumeData(d => { const s = [...d.skills]; s[i] = { ...s[i], [field]: value }; return { ...d, skills: s } })
  }

  const statusColor = status?.type === 'error' ? '#dc2626' : status?.type === 'success' ? '#16a34a' : '#0F4C81'

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, sans-serif; margin: 0; }
        input, textarea, button { font-family: inherit; }
        input:focus, textarea:focus { outline: 2px solid #0F4C81; outline-offset: -1px; border-color: transparent !important; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
        .remove-btn { opacity: 0; transition: opacity 0.15s; }
        .card-wrap:hover .remove-btn { opacity: 1; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>

        {/* ── Header ── */}
        <header style={{
          height: '56px', background: '#fff', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', background: '#0F4C81', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '14px', fontWeight: 700,
            }}>R</div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', letterSpacing: '-0.01em' }}>
              Resume Formatter
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isSignedIn
              ? <SignInButton mode="modal">
                  <button style={{ ...btnSecondary, fontSize: '13px', padding: '6px 14px' }}>Sign in</button>
                </SignInButton>
              : <UserButton afterSignOutUrl="/" />
            }
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              data-testid="download-btn"
              style={{
                ...btnPrimary, fontSize: '13px', padding: '7px 18px',
                opacity: isGenerating ? 0.6 : 1,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating ? 'Generating…' : isPaid ? '↓ Download PDF' : '↓ Download PDF — $9'}
            </button>
          </div>
        </header>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── Left panel ── */}
          <aside style={{
            width: '380px', flexShrink: 0, overflowY: 'auto',
            background: '#fff', borderRight: '1px solid #e2e8f0',
            padding: '24px 20px 40px',
          }}>

            {/* Status banner */}
            {status && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', marginBottom: '20px',
                fontSize: '13px', fontWeight: 500, color: statusColor,
                background: status.type === 'error' ? '#fef2f2' : status.type === 'success' ? '#f0fdf4' : '#eff6ff',
                border: `1px solid ${status.type === 'error' ? '#fecaca' : status.type === 'success' ? '#bbf7d0' : '#bfdbfe'}`,
              }}>
                {status.msg}
              </div>
            )}

            {/* Template picker */}
            <Section label="Template">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplateId(t.id)} style={{
                    padding: '10px 6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: templateId === t.id ? '#0F4C81' : '#f1f5f9',
                    color: templateId === t.id ? '#fff' : '#475569',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.75, marginTop: '2px' }}>{t.sub}</div>
                  </button>
                ))}
              </div>
            </Section>

            {/* Contact */}
            <Section label="Contact">
              {([
                ['name', 'Full name'],
                ['email', 'Email address'],
                ['phone', 'Phone number'],
                ['location', 'Location (e.g. Niš, Serbia)'],
                ['linkedin', 'LinkedIn URL'],
                ['github', 'GitHub URL'],
              ] as const).map(([field, placeholder]) => (
                <input key={field} placeholder={placeholder}
                  data-testid={`contact-${field}`}
                  value={(resumeData.contact as any)[field] ?? ''}
                  onChange={e => setResumeData(d => ({ ...d, contact: { ...d.contact, [field]: e.target.value } }))}
                  style={inputStyle} />
              ))}
            </Section>

            {/* Summary */}
            <Section label="Professional Summary">
              <textarea data-testid="summary"
                placeholder="Senior engineer with X years of experience in..."
                value={resumeData.summary ?? ''}
                onChange={e => setResumeData(d => ({ ...d, summary: e.target.value }))}
                style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
            </Section>

            {/* Experience */}
            <Section label="Experience" onAdd={addExperience} addLabel="+ Add role">
              {resumeData.experience.map((exp, i) => (
                <div key={exp.id} className="card-wrap" style={{ position: 'relative', marginBottom: '10px' }}>
                  <div style={cardStyle}>
                    <RowTwo>
                      <input placeholder="Company" value={exp.company} style={inputStyle}
                        onChange={e => updateExp(i, 'company', e.target.value)} />
                      <input placeholder="Role / Title" value={exp.role} style={inputStyle}
                        onChange={e => updateExp(i, 'role', e.target.value)} />
                    </RowTwo>
                    <RowTwo>
                      <input placeholder="Start (Jan 2022)" value={exp.startDate} style={inputStyle}
                        onChange={e => updateExp(i, 'startDate', e.target.value)} />
                      <input placeholder="End (Present)" value={exp.endDate} style={inputStyle}
                        onChange={e => updateExp(i, 'endDate', e.target.value)} />
                    </RowTwo>
                    <textarea placeholder={"One bullet per line:\nBuilt X that improved Y by Z\nLed team of N engineers"}
                      value={exp.bullets.join('\n')}
                      onChange={e => updateExp(i, 'bullets', e.target.value.split('\n'))}
                      style={{ ...inputStyle, height: '80px', resize: 'vertical', marginBottom: 0 }} />
                  </div>
                  <RemoveBtn onClick={() => removeExperience(i)} />
                </div>
              ))}
            </Section>

            {/* Education */}
            <Section label="Education" onAdd={addEducation} addLabel="+ Add">
              {resumeData.education.map((edu, i) => (
                <div key={edu.id} className="card-wrap" style={{ position: 'relative', marginBottom: '10px' }}>
                  <div style={cardStyle}>
                    <input placeholder="Institution" value={edu.institution} style={inputStyle}
                      onChange={e => updateEdu(i, 'institution', e.target.value)} />
                    <RowTwo>
                      <input placeholder="Degree" value={edu.degree} style={inputStyle}
                        onChange={e => updateEdu(i, 'degree', e.target.value)} />
                      <input placeholder="Field of study" value={edu.field ?? ''} style={inputStyle}
                        onChange={e => updateEdu(i, 'field', e.target.value)} />
                    </RowTwo>
                    <RowTwo>
                      <input placeholder="Start" value={edu.startDate} style={inputStyle}
                        onChange={e => updateEdu(i, 'startDate', e.target.value)} />
                      <input placeholder="End" value={edu.endDate} style={{ ...inputStyle, marginBottom: 0 }}
                        onChange={e => updateEdu(i, 'endDate', e.target.value)} />
                    </RowTwo>
                  </div>
                  <RemoveBtn onClick={() => removeEducation(i)} />
                </div>
              ))}
            </Section>

            {/* Skills */}
            <Section label="Skills" onAdd={addSkillGroup} addLabel="+ Add group">
              {resumeData.skills.map((sg, i) => (
                <div key={sg.id} className="card-wrap" style={{ position: 'relative', marginBottom: '10px' }}>
                  <div style={cardStyle}>
                    <input placeholder="Category (e.g. Languages)" value={sg.category} style={inputStyle}
                      onChange={e => updateSkill(i, 'category', e.target.value)} />
                    <input placeholder="Python, Go, TypeScript, ..." value={sg.skills.join(', ')}
                      style={{ ...inputStyle, marginBottom: 0 }}
                      onChange={e => updateSkill(i, 'skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                  </div>
                  <RemoveBtn onClick={() => removeSkillGroup(i)} />
                </div>
              ))}
            </Section>

          </aside>

          {/* ── Preview panel ── */}
          <div ref={previewRef} style={{
            flex: 1, background: '#f1f5f9', display: 'flex',
            alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            position: 'relative',
          }}>
            {previewHtml ? (
              <div style={{
                width: `${794 * previewScale}px`,
                height: `${1123 * previewScale}px`,
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                borderRadius: '2px',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <iframe
                  data-testid="preview-iframe"
                  srcDoc={previewHtml}
                  style={{
                    width: '794px', height: '1123px', border: 'none',
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                  }}
                  title="Resume preview"
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  Your preview will appear here
                </p>
                <p style={{ fontSize: '14px' }}>Start by entering your name above</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────

function Section({ label, children, onAdd, addLabel }: {
  label: string; children: React.ReactNode; onAdd?: () => void; addLabel?: string
}) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: '#94a3b8',
        }}>{label}</span>
        {onAdd && (
          <button onClick={onAdd} style={{
            fontSize: '12px', fontWeight: 600, color: '#0F4C81',
            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
          }}>{addLabel}</button>
        )}
      </div>
      {children}
    </section>
  )
}

function RowTwo({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>{children}</div>
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button className="remove-btn" onClick={onClick} style={{
      position: 'absolute', top: '8px', right: '8px',
      width: '20px', height: '20px', borderRadius: '50%',
      background: '#fee2e2', border: 'none', cursor: 'pointer',
      color: '#dc2626', fontSize: '14px', lineHeight: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>×</button>
  )
}

// ─── Styles ───────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '8px 11px',
  fontSize: '13px', border: '1px solid #e2e8f0',
  borderRadius: '7px', marginBottom: '8px', background: '#fff',
  color: '#0f172a', transition: 'border-color 0.15s',
}

const cardStyle: React.CSSProperties = {
  background: '#f8fafc', border: '1px solid #e2e8f0',
  borderRadius: '10px', padding: '12px',
}

const btnPrimary: React.CSSProperties = {
  background: '#0F4C81', color: '#fff', border: 'none',
  borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
}

const btnSecondary: React.CSSProperties = {
  background: 'transparent', color: '#475569',
  border: '1px solid #e2e8f0', borderRadius: '8px',
  fontWeight: 500, cursor: 'pointer',
}
