# ShipDesk

AI-native client portal for freelance developers. Connects to GitHub, generates weekly AI status reports, and gives clients a branded portal for files, messages, invoices, and scope change requests.

## Architecture

Monorepo with two npm workspaces:

- `client/` — React 18 + Vite + TypeScript, port 5000
- `server/` — Node.js + Express + TypeScript, port 3000

The Vite dev server proxies all `/api` requests to the Express server on port 3000.

## Running the App

Two workflows must be running simultaneously:

- **Backend Server** — `npm run dev --workspace=server` (port 3000)
- **Start application** — `npm run dev --workspace=client` (port 5000, webview)

Or from the root: `npm run dev` (uses `concurrently` to start both).

## Key Tech

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | Replit PostgreSQL (env var: `DATABASE_URL`) |
| Auth | Clerk (dev JWT for developer routes, session cookie for client portal) |
| AI | Google Gemini 1.5 Pro (`GEMINI_API_KEY`) |
| File storage | Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) |
| Payments | Lemon Squeezy (`LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_VARIANT_ID`) |
| Email | Resend (`RESEND_API_KEY`) |

## Environment Variables

All secrets are managed via Replit Secrets. Required:

```
VITE_CLERK_PUBLISHABLE_KEY   # Clerk frontend key
CLERK_SECRET_KEY             # Clerk backend key
SESSION_SECRET               # Client portal session cookie signing
POSTGRES_URL                 # Neon DB connection string
```

Optional (features gracefully disabled if absent):

```
GEMINI_API_KEY               # AI report generation
CLOUDINARY_CLOUD_NAME        # File uploads
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_UPLOAD_PRESET
LEMONSQUEEZY_API_KEY         # Payment links on invoices/scope changes
LEMONSQUEEZY_STORE_ID
LEMONSQUEEZY_VARIANT_ID
LEMONSQUEEZY_WEBHOOK_SECRET
RESEND_API_KEY               # Transactional emails
EMAIL_FROM                   # From address (default: noreply@shipdesk.io)
GITHUB_CLIENT_ID             # GitHub OAuth
GITHUB_CLIENT_SECRET
GITHUB_WEBHOOK_SECRET
FRONTEND_URL                 # Used in email links (default: https://app.shipdesk.io)
```

## Database

Uses Prisma with Neon Postgres. To push schema changes:

```bash
npm run db:push --workspace=server
```

## Project Structure

```
client/src/
  components/
    layout/       AppShell, ClientPortalLayout
    ui/           shadcn/ui primitives
    reports/      ReportCard, ReportViewer, GenerateReportButton
    invoices/     InvoiceCard, InvoiceForm, InvoiceStatusBadge
    scope/        ScopeChangeCard, ScopeChangeForm, QuoteForm (Tiptap)
    messages/     MessageThread
    files/        FileList
    onboarding/   OnboardingChecklist
    workspace/    WorkspaceSettingsForm, BrandingEditor
    projects/     ProjectCard
  pages/
    dev/          Developer-facing pages (Dashboard, ProjectDetail, Invoices, etc.)
    client/       Client portal pages (magic link auth, reports, messages, etc.)
  hooks/          React Query data hooks
  lib/            api client, utils, prisma
  types/          Shared TypeScript types

server/src/
  routes/         workspace, projects, github, reports, clients, files,
                  messages, invoices, scopeChanges, portal, webhooks
  services/       gemini, cloudinary, lemonSqueezy, email, github, reportScheduler
  middleware/     auth (Clerk JWT), clientAuth (session cookie), errorHandler, rateLimiter
  lib/            prisma client, error helpers
  prisma/         schema.prisma
```

## Auth Model

- **Developer routes** (`/api/*`): Clerk JWT via `verifyToken` from `@clerk/backend`
- **Client portal routes** (`/api/portal/*`): Magic link → session cookie (`shipdesk_client_session`)

## Where to Get API Keys

### Core (recommended to set up now)

- **GEMINI_API_KEY** → [aistudio.google.com](https://aistudio.google.com) → "Get API key" (free)
- **AES_ENCRYPTION_KEY** → Generate one yourself: any 64 random hex characters. Run this in a terminal:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### GitHub (for auto-generating reports from commits)

- Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
- **GITHUB_CLIENT_ID** & **GITHUB_CLIENT_SECRET** → from that OAuth App
- **GITHUB_WEBHOOK_SECRET** → make up any random string
- **GITHUB_OAUTH_CALLBACK_URL** → your Replit app URL + `/api/github/callback` (e.g. `https://yourapp.replit.dev/api/github/callback`)

### Email (for sending reports to clients)

- **RESEND_API_KEY** → [resend.com](https://resend.com) → free account → API Keys
- **EMAIL_FROM** → e.g. `noreply@yourdomain.com`

### File Uploads (for logos/attachments)

- **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**, **CLOUDINARY_UPLOAD_PRESET** → [cloudinary.com](https://cloudinary.com) → free account → Dashboard

### Payments (for invoicing clients)

- **LEMONSQUEEZY_\*** → [lemonsqueezy.com](https://lemonsqueezy.com) → your store dashboard

### Clerk Webhook (keeps user data in sync)

- **CLERK_WEBHOOK_SECRET** → [clerk.com](https://clerk.com) → your app → Webhooks → Add endpoint pointing to your Replit URL + `/api/webhooks/clerk`

### App URL

- **FRONTEND_URL** → your Replit preview URL, e.g. `https://yourapp.replit.dev`

## User Preferences

- Use TypeScript strictly — no `any` unless unavoidable
- All services should initialize lazily (no eager env var throws at import time)
- Keep components small and focused; extract sub-components when a file exceeds ~150 lines
- Use `POSTGRES_URL` (not `DATABASE_URL`) — Replit reserves the latter for its own managed DB
- shadcn/ui Badge supports custom variants: `success`, `warning`, `info` (already configured)
