# API Keys Setup Guide

## Core (recommended to set up now)

- **GEMINI_API_KEY** → [aistudio.google.com](https://aistudio.google.com) → "Get API key" (free)
- **AES_ENCRYPTION_KEY** → Generate one yourself: any 64 random hex characters. Run this in a terminal:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## GitHub (for auto-generating reports from commits)

- Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
- **GITHUB_CLIENT_ID** & **GITHUB_CLIENT_SECRET** → from that OAuth App
- **GITHUB_WEBHOOK_SECRET** → make up any random string
- **GITHUB_OAUTH_CALLBACK_URL** → your Replit app URL + `/api/github/callback`
  - e.g. `https://yourapp.replit.dev/api/github/callback`

## Email (for sending reports to clients)

- **RESEND_API_KEY** → [resend.com](https://resend.com) → free account → API Keys
- **EMAIL_FROM** → e.g. `noreply@yourdomain.com`

## File Uploads (for logos/attachments)

- **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**, **CLOUDINARY_UPLOAD_PRESET**
  → [cloudinary.com](https://cloudinary.com) → free account → Dashboard

## Payments (for invoicing clients)

- **LEMONSQUEEZY_API_KEY**, **LEMONSQUEEZY_STORE_ID**, **LEMONSQUEEZY_PRODUCT_ID**, **LEMONSQUEEZY_VARIANT_ID**, **LEMONSQUEEZY_WEBHOOK_SECRET**
  → [lemonsqueezy.com](https://lemonsqueezy.com) → your store dashboard

## Clerk Webhook (keeps user data in sync)

- **CLERK_WEBHOOK_SECRET** → [clerk.com](https://clerk.com) → your app → Webhooks
  → Add endpoint pointing to your Replit URL + `/api/webhooks/clerk`

## App URL

- **FRONTEND_URL** → your Replit preview URL, e.g. `https://yourapp.replit.dev`
