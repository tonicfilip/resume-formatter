/** @type {import('next').NextConfig} */
const nextConfig = {
  // Puppeteer + Chromium are server-only — exclude from client bundles
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],

  // Increase serverless function timeout for PDF generation (Vercel Pro: up to 300s)
  // On Hobby plan this is capped at 10s — use Lambda if you hit limits
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
}

export default nextConfig
