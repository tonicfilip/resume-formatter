import { renderTemplate } from '../lib/templates'
import type { ResumeData } from '../types/resume'

const SAMPLE: ResumeData = {
  contact: {
    name: 'Filip Tonic',
    email: 'filip@example.com',
    phone: '+381644454945',
    location: 'Niš, Serbia',
    linkedin: 'https://linkedin.com/in/filip-tonic',
    github: 'https://github.com/tonicfilip',
  },
  summary: 'Senior engineer with 8+ years building distributed systems.',
  experience: [
    {
      id: '1',
      company: 'The Idea Compiler',
      role: 'Senior Software Engineer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      location: 'Remote',
      bullets: ['Led migration to microservices', 'Built HIPAA-compliant data pipeline'],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of Niš',
      degree: 'BSc',
      field: 'Computer Science',
      startDate: '2012',
      endDate: '2016',
    },
  ],
  skills: [
    { id: '1', category: 'Languages', skills: ['Python', 'Go', 'TypeScript'] },
    { id: '2', category: 'Cloud', skills: ['AWS', 'Docker', 'Kubernetes'] },
  ],
  projects: [
    {
      id: '1',
      name: 'PHI-Blind gRPC',
      description: 'HIPAA-compliant encrypted data pipeline',
      url: 'https://github.com/tonicfilip/phi-blind-grpc',
      tech: ['Python', 'gRPC', 'PostgreSQL'],
    },
  ],
}

describe('renderTemplate', () => {
  const templates = ['classic', 'modern', 'minimal'] as const

  templates.forEach(templateId => {
    describe(`${templateId} template`, () => {
      let html: string

      beforeEach(() => {
        html = renderTemplate(templateId, SAMPLE)
      })

      it('renders valid HTML', () => {
        expect(html).toContain('<!DOCTYPE html>')
        expect(html).toContain('</html>')
      })

      it('includes the contact name', () => {
        expect(html).toContain('Filip Tonic')
      })

      it('includes the email', () => {
        expect(html).toContain('filip@example.com')
      })

      it('includes experience', () => {
        expect(html).toContain('The Idea Compiler')
        expect(html).toContain('Senior Software Engineer')
      })

      it('includes education', () => {
        expect(html).toContain('University of Niš')
      })

      it('includes skills', () => {
        expect(html).toContain('Python')
        expect(html).toContain('Languages')
      })

      it('includes projects', () => {
        expect(html).toContain('PHI-Blind gRPC')
      })

      it('escapes HTML special characters safely', () => {
        const xssData: ResumeData = {
          ...SAMPLE,
          contact: { ...SAMPLE.contact, name: '<script>alert("xss")</script>' },
        }
        const xssHtml = renderTemplate(templateId, xssData)
        expect(xssHtml).not.toContain('<script>alert')
        expect(xssHtml).toContain('&lt;script&gt;')
      })
    })
  })

  it('throws on unknown template id', () => {
    // Cast via unknown to bypass TS union exhaustiveness — tests the runtime default branch
    const badId = 'unknown' as unknown as TemplateId
    expect(() => renderTemplate(badId, SAMPLE)).toThrow('Unknown template: unknown')
  })
})
