import { renderTemplate } from './templates'
import type { ResumeData, TemplateId } from '../types/resume'

const IS_LOCAL = process.env.NODE_ENV === 'development'

// ─── Main export ─────────────────────────────────────────────────

/**
 * Generates a PDF and returns either:
 *  - LOCAL:  a base64 data URI (no S3 needed)
 *  - PROD:   a signed S3 URL (set USE_S3=true in env)
 */
export async function generateAndUploadPdf(
  resumeData: ResumeData,
  templateId: TemplateId,
  userId: string
): Promise<{ url: string; isBase64: boolean }> {
  const html = renderTemplate(templateId, resumeData)
  const pdfBuffer = await renderPdf(html)

  if (IS_LOCAL || process.env.USE_S3 !== 'true') {
    // Return as base64 data URI — browser can download directly, no S3 needed
    const base64 = pdfBuffer.toString('base64')
    return {
      url: `data:application/pdf;base64,${base64}`,
      isBase64: true,
    }
  }

  // Production: upload to S3 and return signed URL
  const signedUrl = await uploadToS3AndSign(pdfBuffer, userId)
  return { url: signedUrl, isBase64: false }
}

// ─── Puppeteer rendering ─────────────────────────────────────────

async function renderPdf(html: string): Promise<Buffer> {
  let browser: any

  if (IS_LOCAL) {
    // Local dev: use full puppeteer (installs its own Chromium)
    const puppeteer = (await import('puppeteer')).default
    browser = await puppeteer.launch({ headless: true })
  } else {
    // Serverless: use sparticuz/chromium (no bundled binary)
    const chromium = (await import('@sparticuz/chromium')).default
    const puppeteer = (await import('puppeteer-core')).default
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })
  }

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

// ─── S3 (production only) ────────────────────────────────────────

async function uploadToS3AndSign(buffer: Buffer, userId: string): Promise<string> {
  const { S3Client, PutObjectCommand, GetObjectCommand } = await import('@aws-sdk/client-s3')
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')

  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  const key = `resumes/${userId}/${Date.now()}.pdf`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf',
  }))

  return getSignedUrl(s3, new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ResponseContentDisposition: 'attachment; filename="resume.pdf"',
  }), { expiresIn: 600 })
}
