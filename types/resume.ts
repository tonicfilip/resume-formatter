export type TemplateId = 'classic' | 'modern' | 'minimal'

export interface ResumeContact {
  name: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface ResumeExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string        // 'Present' for current
  location?: string
  bullets: string[]
}

export interface ResumeEducation {
  id: string
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface ResumeSkillGroup {
  id: string
  category: string       // e.g. 'Languages', 'Frameworks', 'Cloud'
  skills: string[]
}

export interface ResumeProject {
  id: string
  name: string
  description: string
  url?: string
  tech?: string[]
}

export interface ResumeData {
  contact: ResumeContact
  summary?: string
  experience: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkillGroup[]
  projects?: ResumeProject[]
}

export interface GenerateRequest {
  resumeData: ResumeData
  templateId: TemplateId
}
