# ShipDesk — API Keys Setup Guide

This guide walks you through getting every API key ShipDesk needs. You only need to set up the services you plan to use — the app works without them, but each one unlocks a specific feature.

---

## 1. GEMINI_API_KEY — AI Report Generation ⭐ Recommended

Used to generate plain-English weekly status reports from GitHub activity.

**Steps:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API key"** in the left sidebar
4. Click **"Create API key"** → select a Google Cloud project (or create one)
5. Copy the generated key
6. Add it to Replit Secrets as `GEMINI_API_KEY`

---

## 2. AES_ENCRYPTION_KEY — Data Encryption ⭐ Recommended

Used to encrypt sensitive data stored in the database.

**Steps:**
1. Open a terminal (or use the Replit Shell tab)
2. Run this command:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Copy the 64-character string it outputs
4. Add it to Replit Secrets as `AES_ENCRYPTION_KEY`

---

## 3. GitHub OAuth — Connect GitHub Repos

Lets developers connect their GitHub repositories to ShipDesk for automatic report generation.

**Steps:**
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in the form:
   - **Application name:** `ShipDesk`
   - **Homepage URL:** your Replit preview URL (e.g. `https://yourapp.replit.dev`)
   - **Authorization callback URL:** your Replit URL + `/api/github/callback`
     - e.g. `https://yourapp.replit.dev/api/github/callback`
4. Click **"Register application"**
5. Copy the **Client ID** → add to Replit Secrets as `GITHUB_CLIENT_ID`
6. Click **"Generate a new client secret"** → copy it → add as `GITHUB_CLIENT_SECRET`
7. Make up any random string (e.g. `shipdesk-webhook-secret-123`) → add as `GITHUB_WEBHOOK_SECRET`
8. Add your full callback URL as `GITHUB_OAUTH_CALLBACK_URL`
   - e.g. `https://yourapp.replit.dev/api/github/callback`

---

## 4. Resend — Sending Emails to Clients

Used to email magic login links and report notifications to your clients.

**Steps:**
1. Go to [resend.com](https://resend.com) and create a free account
2. In the dashboard, click **"API Keys"** → **"Create API Key"**
3. Give it a name (e.g. `ShipDesk`) and click **"Add"**
4. Copy the key → add to Replit Secrets as `RESEND_API_KEY`
5. For `EMAIL_FROM`: enter the address emails will be sent from
   - If you have a custom domain, verify it in Resend first
   - Otherwise use `onboarding@resend.dev` for testing
6. Add it to Replit Secrets as `EMAIL_FROM`

---

## 5. Cloudinary — File Uploads

Used for uploading logos, attachments, and client files.

**Steps:**
1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. From the dashboard home, copy:
   - **Cloud name** → add as `CLOUDINARY_CLOUD_NAME`
   - **API Key** → add as `CLOUDINARY_API_KEY`
   - **API Secret** → add as `CLOUDINARY_API_SECRET`
3. To create an upload preset:
   - Go to **Settings** → **Upload** → scroll to **"Upload presets"**
   - Click **"Add upload preset"**
   - Set **Signing mode** to `Unsigned`
   - Give it a name (e.g. `shipdesk`) → click **Save**
   - Copy the preset name → add as `CLOUDINARY_UPLOAD_PRESET`

---

## 6. Lemon Squeezy — Payments & Invoicing

Used to generate payment links on invoices sent to clients.

**Steps:**
1. Go to [lemonsqueezy.com](https://lemonsqueezy.com) and create an account
2. Create a store if you haven't already
3. Get your **Store ID**:
   - Go to **Settings** → **Stores** → copy the ID next to your store
   - Add as `LEMONSQUEEZY_STORE_ID`
4. Get your **API Key**:
   - Go to **Settings** → **API** → **"Create new API key"**
   - Copy it → add as `LEMONSQUEEZY_API_KEY`
5. Create a **Product**:
   - Go to **Products** → **"New product"** → create a simple product
   - Copy the **Product ID** → add as `LEMONSQUEEZY_PRODUCT_ID`
   - Click into the product → copy the **Variant ID** → add as `LEMONSQUEEZY_VARIANT_ID`
6. Set up a **Webhook**:
   - Go to **Settings** → **Webhooks** → **"Add webhook"**
   - URL: your Replit URL + `/api/webhooks/lemonsqueezy`
   - Make up a signing secret → add as `LEMONSQUEEZY_WEBHOOK_SECRET`

---

## 7. Clerk Webhook — Keep User Data in Sync

Keeps your database in sync when users sign up or update their profile in Clerk.

**Steps:**
1. Go to [clerk.com](https://clerk.com) → open your application
2. In the left sidebar, click **"Webhooks"**
3. Click **"Add Endpoint"**
4. Enter your Replit URL + `/api/webhooks/clerk`
   - e.g. `https://yourapp.replit.dev/api/webhooks/clerk`
5. Under **"Subscribe to events"**, select:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Click **"Create"**
7. Copy the **Signing Secret** (starts with `whsec_`) → add as `CLERK_WEBHOOK_SECRET`

> **Note:** Without this, ShipDesk auto-creates users on first login anyway — so this is only needed for keeping profile updates in sync.

---

## 8. FRONTEND_URL — Your App's Public URL

Used in email links sent to clients so they can click through to the right URL.

**Steps:**
1. Look at the top of your Replit preview pane — copy the URL
   - e.g. `https://yourapp.replit.dev`
2. Add it to Replit Secrets as `FRONTEND_URL`

---

## Quick Reference

| Secret | Feature | Required? |
|--------|---------|-----------|
| `GEMINI_API_KEY` | AI report generation | Recommended |
| `AES_ENCRYPTION_KEY` | Data encryption | Recommended |
| `GITHUB_CLIENT_ID` | GitHub repo connection | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub repo connection | Optional |
| `GITHUB_WEBHOOK_SECRET` | GitHub repo connection | Optional |
| `GITHUB_OAUTH_CALLBACK_URL` | GitHub repo connection | Optional |
| `RESEND_API_KEY` | Client emails | Optional |
| `EMAIL_FROM` | Client emails | Optional |
| `CLOUDINARY_CLOUD_NAME` | File uploads | Optional |
| `CLOUDINARY_API_KEY` | File uploads | Optional |
| `CLOUDINARY_API_SECRET` | File uploads | Optional |
| `CLOUDINARY_UPLOAD_PRESET` | File uploads | Optional |
| `LEMONSQUEEZY_API_KEY` | Payments | Optional |
| `LEMONSQUEEZY_STORE_ID` | Payments | Optional |
| `LEMONSQUEEZY_PRODUCT_ID` | Payments | Optional |
| `LEMONSQUEEZY_VARIANT_ID` | Payments | Optional |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Payments | Optional |
| `CLERK_WEBHOOK_SECRET` | User sync | Optional |
| `FRONTEND_URL` | Email links | Optional |
