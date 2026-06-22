# Resume Formatter

Turn any resume into a polished, ATS-friendly PDF in seconds.

## Stack

- **Next.js 14** (App Router)
- **Clerk** — auth
- **Supabase** — user/payment state
- **Lemon Squeezy** — payments + webhooks
- **Puppeteer + @sparticuz/chromium** — PDF generation
- **AWS S3** — signed URL delivery
- **Vercel** — hosting

## Project Structure

```
app/
  api/
    preview/route.ts        # Returns HTML preview (free)
    generate/route.ts       # Generates + uploads PDF (paid)
    webhook/route.ts        # Lemon Squeezy webhook handler
  resume/page.tsx           # Main resume builder UI
  templates/page.tsx        # Template picker
components/
  ui/                       # Shared UI primitives
  resume/
    ResumeForm.tsx          # Resume content form
    ResumePreview.tsx       # Live HTML preview
    TemplateCard.tsx        # Template selector card
lib/
  supabase.ts               # Supabase client
  lemonsqueezy.ts           # LS webhook verification + checkout
  pdf.ts                    # Puppeteer PDF generation
  templates.ts              # Template HTML renderers
types/
  resume.ts                 # Resume data types
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_PRODUCT_ID=
LEMON_SQUEEZY_WEBHOOK_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=resume-formatter-pdfs

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Schema

```sql
create table users (
  id          text primary key,   -- Clerk user ID
  email       text not null,
  paid        boolean default false,
  paid_at     timestamptz,
  order_id    text,               -- Lemon Squeezy order ID
  created_at  timestamptz default now()
);
```

## Local Setup

```bash
npm install
cp .env.example .env.local
# Fill in env vars
npm run dev
```

## Deploy

Push to GitHub → connect to Vercel → add env vars in Vercel dashboard.

Set your Lemon Squeezy webhook URL to:
`https://your-domain.com/api/webhook`
