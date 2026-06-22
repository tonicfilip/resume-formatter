import type { ResumeData, TemplateId } from '../types/resume'

export function renderTemplate(templateId: TemplateId, data: ResumeData): string {
  switch (templateId) {
    case 'classic':  return classicTemplate(data)
    case 'modern':   return modernTemplate(data)
    case 'minimal':  return minimalTemplate(data)
    default: throw new Error(`Unknown template: ${templateId}`)
  }
}

// ─── Shared helpers ──────────────────────────────────────────────

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const dateRange = (start: string, end: string) =>
  `${start} – ${end}`

// ─── Classic Template ────────────────────────────────────────────
// Traditional serif layout. Corporate, finance, legal.

function classicTemplate(d: ResumeData): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 10.5pt;
    color: #1a1a1a;
    padding: 36pt 48pt;
    line-height: 1.45;
  }
  h1 {
    font-size: 22pt;
    font-weight: normal;
    letter-spacing: 0.03em;
    text-align: center;
    margin-bottom: 4pt;
  }
  .contact {
    text-align: center;
    font-size: 9.5pt;
    color: #444;
    margin-bottom: 14pt;
  }
  .contact a { color: #444; text-decoration: none; }
  .divider {
    border: none;
    border-top: 1.5pt solid #1a1a1a;
    margin: 8pt 0 6pt;
  }
  .section-title {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6pt;
  }
  .section { margin-bottom: 12pt; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }
  .entry-sub {
    display: flex;
    justify-content: space-between;
    font-style: italic;
    color: #444;
    margin-bottom: 4pt;
  }
  ul { padding-left: 14pt; margin-top: 3pt; }
  li { margin-bottom: 2pt; }
  .summary { margin-bottom: 12pt; font-size: 10.5pt; }
  .skills-row { margin-bottom: 3pt; }
  .skills-category { font-weight: bold; }
</style>
</head>
<body>

<h1>${esc(d.contact.name)}</h1>
<div class="contact">
  ${[
    d.contact.email,
    d.contact.phone,
    d.contact.location,
    d.contact.linkedin ? `<a href="${esc(d.contact.linkedin)}">${esc(d.contact.linkedin)}</a>` : null,
    d.contact.github   ? `<a href="${esc(d.contact.github)}">${esc(d.contact.github)}</a>` : null,
  ].filter(Boolean).join(' &nbsp;|&nbsp; ')}
</div>

${d.summary ? `<div class="summary">${esc(d.summary)}</div>` : ''}

${d.experience.length ? `
<hr class="divider"/>
<div class="section">
  <div class="section-title">Experience</div>
  ${d.experience.map(e => `
    <div style="margin-bottom:9pt">
      <div class="entry-header">
        <span>${esc(e.company)}</span>
        <span>${dateRange(e.startDate, e.endDate)}</span>
      </div>
      <div class="entry-sub">
        <span>${esc(e.role)}</span>
        ${e.location ? `<span>${esc(e.location)}</span>` : '<span></span>'}
      </div>
      <ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>
  `).join('')}
</div>` : ''}

${d.education.length ? `
<hr class="divider"/>
<div class="section">
  <div class="section-title">Education</div>
  ${d.education.map(e => `
    <div style="margin-bottom:6pt">
      <div class="entry-header">
        <span>${esc(e.institution)}</span>
        <span>${dateRange(e.startDate, e.endDate)}</span>
      </div>
      <div class="entry-sub">
        <span>${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ''}</span>
        ${e.gpa ? `<span>GPA: ${esc(e.gpa)}</span>` : '<span></span>'}
      </div>
    </div>
  `).join('')}
</div>` : ''}

${d.skills.length ? `
<hr class="divider"/>
<div class="section">
  <div class="section-title">Skills</div>
  ${d.skills.map(s => `
    <div class="skills-row">
      <span class="skills-category">${esc(s.category)}:</span>
      ${esc(s.skills.join(', '))}
    </div>
  `).join('')}
</div>` : ''}

${d.projects?.length ? `
<hr class="divider"/>
<div class="section">
  <div class="section-title">Projects</div>
  ${d.projects.map(p => `
    <div style="margin-bottom:6pt">
      <div class="entry-header">
        <span>${esc(p.name)}</span>
        ${p.url ? `<a href="${esc(p.url)}" style="color:#444;font-size:9pt">${esc(p.url)}</a>` : '<span></span>'}
      </div>
      <div>${esc(p.description)}</div>
      ${p.tech?.length ? `<div style="color:#555;font-size:9.5pt">${esc(p.tech.join(' · '))}</div>` : ''}
    </div>
  `).join('')}
</div>` : ''}

</body>
</html>`
}

// ─── Modern Template ─────────────────────────────────────────────
// Sans-serif with a left accent stripe. Tech, startups.

function modernTemplate(d: ResumeData): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10pt;
    color: #222;
    display: flex;
    min-height: 100vh;
  }
  .sidebar {
    width: 200pt;
    background: #0F4C81;
    color: #fff;
    padding: 32pt 20pt;
    flex-shrink: 0;
  }
  .sidebar h1 {
    font-size: 18pt;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 8pt;
  }
  .sidebar .title { font-size: 9.5pt; opacity: 0.8; margin-bottom: 20pt; }
  .sidebar-section { margin-bottom: 18pt; }
  .sidebar-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.65;
    margin-bottom: 5pt;
  }
  .sidebar-item { font-size: 9.5pt; margin-bottom: 3pt; word-break: break-all; }
  .sidebar-item a { color: #fff; text-decoration: none; }
  .skill-chip {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    border-radius: 2pt;
    padding: 1pt 5pt;
    font-size: 8.5pt;
    margin: 2pt 2pt 0 0;
  }
  .main { flex: 1; padding: 32pt 28pt; }
  .section { margin-bottom: 16pt; }
  .section-title {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0F4C81;
    border-bottom: 1.5pt solid #0F4C81;
    padding-bottom: 3pt;
    margin-bottom: 8pt;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 10.5pt;
  }
  .entry-sub {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 9.5pt;
    margin-bottom: 4pt;
  }
  .date { color: #0F4C81; font-size: 9.5pt; }
  ul { padding-left: 12pt; margin-top: 3pt; }
  li { margin-bottom: 2pt; font-size: 9.5pt; }
  .entry { margin-bottom: 10pt; }
</style>
</head>
<body>

<div class="sidebar">
  <h1>${esc(d.contact.name)}</h1>

  <div class="sidebar-section">
    <div class="sidebar-label">Contact</div>
    ${d.contact.email ? `<div class="sidebar-item">${esc(d.contact.email)}</div>` : ''}
    ${d.contact.phone ? `<div class="sidebar-item">${esc(d.contact.phone)}</div>` : ''}
    ${d.contact.location ? `<div class="sidebar-item">${esc(d.contact.location)}</div>` : ''}
    ${d.contact.linkedin ? `<div class="sidebar-item"><a href="${esc(d.contact.linkedin)}">LinkedIn</a></div>` : ''}
    ${d.contact.github ? `<div class="sidebar-item"><a href="${esc(d.contact.github)}">GitHub</a></div>` : ''}
  </div>

  ${d.skills.length ? d.skills.map(s => `
    <div class="sidebar-section">
      <div class="sidebar-label">${esc(s.category)}</div>
      ${s.skills.map(sk => `<span class="skill-chip">${esc(sk)}</span>`).join('')}
    </div>
  `).join('') : ''}
</div>

<div class="main">
  ${d.summary ? `
  <div class="section">
    <div class="section-title">Summary</div>
    <p style="font-size:9.5pt;line-height:1.5">${esc(d.summary)}</p>
  </div>` : ''}

  ${d.experience.length ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${d.experience.map(e => `
      <div class="entry">
        <div class="entry-header">
          <span>${esc(e.role)}</span>
          <span class="date">${dateRange(e.startDate, e.endDate)}</span>
        </div>
        <div class="entry-sub">
          <span>${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ''}</span>
        </div>
        <ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </div>` : ''}

  ${d.education.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${d.education.map(e => `
      <div class="entry">
        <div class="entry-header">
          <span>${esc(e.institution)}</span>
          <span class="date">${dateRange(e.startDate, e.endDate)}</span>
        </div>
        <div class="entry-sub">
          <span>${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ''}</span>
          ${e.gpa ? `<span>GPA: ${esc(e.gpa)}</span>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${d.projects?.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${d.projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <span>${esc(p.name)}</span>
          ${p.url ? `<a href="${esc(p.url)}" style="color:#0F4C81;font-size:9pt">${esc(p.url)}</a>` : ''}
        </div>
        <div style="font-size:9.5pt;margin-bottom:2pt">${esc(p.description)}</div>
        ${p.tech?.length ? `<div style="color:#0F4C81;font-size:9pt">${esc(p.tech.join(' · '))}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}
</div>

</body>
</html>`
}

// ─── Minimal Template ────────────────────────────────────────────
// Ultra-clean. Lots of whitespace. Design, creative, senior IC.

function minimalTemplate(d: ResumeData): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10pt;
    color: #111;
    padding: 48pt 56pt;
    line-height: 1.6;
  }
  h1 {
    font-size: 26pt;
    font-weight: 300;
    letter-spacing: -0.02em;
    margin-bottom: 2pt;
  }
  .contact {
    font-size: 9.5pt;
    color: #666;
    margin-bottom: 28pt;
  }
  .contact a { color: #666; text-decoration: none; }
  .section { margin-bottom: 20pt; }
  .section-title {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #999;
    margin-bottom: 10pt;
  }
  .entry { margin-bottom: 12pt; }
  .entry-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .company { font-weight: 600; }
  .role { color: #555; font-size: 9.5pt; margin-bottom: 4pt; }
  .date { font-size: 9pt; color: #aaa; }
  ul { padding-left: 12pt; }
  li { margin-bottom: 2pt; font-size: 9.5pt; color: #333; }
  .skills-line { font-size: 9.5pt; color: #444; margin-bottom: 3pt; }
  .skills-category { font-weight: 600; color: #111; margin-right: 4pt; }
  .summary { color: #444; font-size: 9.5pt; margin-bottom: 20pt; max-width: 480pt; }
</style>
</head>
<body>

<h1>${esc(d.contact.name)}</h1>
<div class="contact">
  ${[
    d.contact.email,
    d.contact.phone,
    d.contact.location,
    d.contact.linkedin ? `<a href="${esc(d.contact.linkedin)}">${esc(d.contact.linkedin)}</a>` : null,
    d.contact.website ? `<a href="${esc(d.contact.website)}">${esc(d.contact.website)}</a>` : null,
  ].filter(Boolean).join('  ·  ')}
</div>

${d.summary ? `<div class="summary">${esc(d.summary)}</div>` : ''}

${d.experience.length ? `
<div class="section">
  <div class="section-title">Experience</div>
  ${d.experience.map(e => `
    <div class="entry">
      <div class="entry-top">
        <span class="company">${esc(e.company)}</span>
        <span class="date">${dateRange(e.startDate, e.endDate)}</span>
      </div>
      <div class="role">${esc(e.role)}${e.location ? ` · ${esc(e.location)}` : ''}</div>
      <ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>
  `).join('')}
</div>` : ''}

${d.education.length ? `
<div class="section">
  <div class="section-title">Education</div>
  ${d.education.map(e => `
    <div class="entry">
      <div class="entry-top">
        <span class="company">${esc(e.institution)}</span>
        <span class="date">${dateRange(e.startDate, e.endDate)}</span>
      </div>
      <div class="role">${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ''}${e.gpa ? ` · GPA ${esc(e.gpa)}` : ''}</div>
    </div>
  `).join('')}
</div>` : ''}

${d.skills.length ? `
<div class="section">
  <div class="section-title">Skills</div>
  ${d.skills.map(s => `
    <div class="skills-line">
      <span class="skills-category">${esc(s.category)}</span>
      ${esc(s.skills.join(', '))}
    </div>
  `).join('')}
</div>` : ''}

${d.projects?.length ? `
<div class="section">
  <div class="section-title">Projects</div>
  ${d.projects.map(p => `
    <div class="entry">
      <div class="entry-top">
        <span class="company">${esc(p.name)}</span>
        ${p.url ? `<a href="${esc(p.url)}" style="color:#aaa;font-size:9pt">${esc(p.url)}</a>` : ''}
      </div>
      <div class="role">${esc(p.description)}</div>
      ${p.tech?.length ? `<div style="color:#999;font-size:9pt">${esc(p.tech.join(' · '))}</div>` : ''}
    </div>
  `).join('')}
</div>` : ''}

</body>
</html>`
}
