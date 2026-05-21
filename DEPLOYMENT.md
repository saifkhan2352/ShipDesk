# ShipDesk — Deployment Guide

Backend → **Railway** | Frontend → **Vercel**

---

## Part 1 — Deploy the Backend on Railway

### Step 1: Create a Railway account
1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"**

### Step 2: Add a PostgreSQL database
1. Inside your new project, click **"+ Add Service"** → **"Database"** → **"PostgreSQL"**
2. Railway will create a Postgres instance and auto-set `DATABASE_URL` — you don't need to configure this manually

### Step 3: Deploy the backend from GitHub
1. Click **"+ Add Service"** → **"GitHub Repo"**
2. Connect your GitHub account and select your ShipDesk repository
3. Railway will detect the `railway.toml` config automatically

### Step 4: Set environment variables on Railway
Go to your backend service → **"Variables"** tab → add these:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `CLERK_SECRET_KEY` | your Clerk secret key |
| `SESSION_SECRET` | any long random string (32+ chars) |
| `GEMINI_API_KEY` | your Gemini API key |
| `AES_ENCRYPTION_KEY` | your 64-char hex string |
| `FRONTEND_URL` | your Vercel URL (add after Step 7, e.g. `https://yourapp.vercel.app`) |
| `GITHUB_CLIENT_ID` | *(optional)* |
| `GITHUB_CLIENT_SECRET` | *(optional)* |
| `GITHUB_WEBHOOK_SECRET` | *(optional)* |
| `GITHUB_OAUTH_CALLBACK_URL` | your Railway URL + `/api/github/callback` |
| `RESEND_API_KEY` | *(optional)* |
| `EMAIL_FROM` | *(optional)* |
| `CLOUDINARY_CLOUD_NAME` | *(optional)* |
| `CLOUDINARY_API_KEY` | *(optional)* |
| `CLOUDINARY_API_SECRET` | *(optional)* |
| `CLOUDINARY_UPLOAD_PRESET` | *(optional)* |
| `LEMONSQUEEZY_API_KEY` | *(optional)* |
| `LEMONSQUEEZY_STORE_ID` | *(optional)* |
| `LEMONSQUEEZY_PRODUCT_ID` | *(optional)* |
| `LEMONSQUEEZY_VARIANT_ID` | *(optional)* |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | *(optional)* |
| `CLERK_WEBHOOK_SECRET` | *(optional)* |

### Step 5: Deploy
1. Railway will automatically build and deploy on every push to your main branch
2. Once deployed, click your service → **"Settings"** → **"Public Networking"** → enable it
3. Copy your Railway public URL (e.g. `https://shipdesk-production.up.railway.app`) — you'll need it for Vercel

---

## Part 2 — Deploy the Frontend on Vercel

### Step 6: Create a Vercel account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"**

### Step 7: Import your GitHub repo
1. Connect GitHub and select your ShipDesk repository
2. Vercel will detect `vercel.json` automatically — **do not change** the framework preset (leave as "Other")
3. Leave the root directory as `/` (Vercel reads the `vercel.json` at the root)

### Step 8: Set environment variables on Vercel
Go to **"Environment Variables"** during setup (or later in Project Settings) and add:

| Variable | Value |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | your Clerk publishable key (starts with `pk_`) |
| `VITE_API_BASE_URL` | your Railway backend URL (e.g. `https://shipdesk-production.up.railway.app`) |

### Step 9: Deploy
1. Click **"Deploy"** — Vercel will build and publish your frontend
2. Copy your Vercel URL (e.g. `https://yourapp.vercel.app`)

### Step 10: Update Railway with your Vercel URL
1. Go back to Railway → your backend service → **"Variables"**
2. Set `FRONTEND_URL` to your Vercel URL (e.g. `https://yourapp.vercel.app`)
3. Railway will automatically redeploy

---

## Part 3 — Final Checks

### Update Clerk allowed origins
1. Go to [clerk.com](https://clerk.com) → your app → **"Domains"**
2. Add your Vercel URL as an allowed origin

### Update GitHub OAuth callback (if using GitHub integration)
1. Go to GitHub → Settings → Developer Settings → your OAuth App
2. Update **Authorization callback URL** to your Railway URL + `/api/github/callback`
   - e.g. `https://shipdesk-production.up.railway.app/api/github/callback`
3. Update `GITHUB_OAUTH_CALLBACK_URL` in Railway variables to match

### Update Clerk webhook endpoint (if using Clerk webhooks)
1. Go to Clerk → Webhooks → your endpoint
2. Update the URL to your Railway URL + `/api/webhooks/clerk`

---

## Summary

```
GitHub Repo
    ├── Railway (backend, port auto-assigned)
    │     └── Connects to Railway PostgreSQL
    └── Vercel (frontend, served globally)
          └── API calls → Railway backend via VITE_API_BASE_URL
```

Every push to your `main` branch will automatically redeploy both Railway and Vercel.
