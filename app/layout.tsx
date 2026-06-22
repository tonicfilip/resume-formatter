import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Resume Formatter',
  description: 'Turn your resume into a polished PDF in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
